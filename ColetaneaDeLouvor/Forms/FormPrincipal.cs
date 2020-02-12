using ColetaneaDeLouvor.DAO;
using ColetaneaDeLouvor.Database;
using Microsoft.VisualBasic.Devices;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.OleDb;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml;

namespace ColetaneaDeLouvor.Forms
{
    public partial class FormPrincipal : Form
    {
        OleDbConnection aConnection = new OleDbConnection(DadosAccess.Dados());
        TextBox numHino = new TextBox();
        public FormPrincipal()
        {
            InitializeComponent();            
        }

        private void FormPrincipal_Load(object sender, EventArgs e)
        {
            this.Text += " " + Application.ProductVersion;

            //abre a conexão com o banco de dados
            try
            {
                aConnection.Open();
            }
            catch (OleDbException)
            {
                MessageBox.Show("Um arquivo de Dados não se encontra em seu computador e necessitamos dele para que possamos executar a Coletânea de Louvor.", "Falha na execução do programa!", MessageBoxButtons.OK, MessageBoxIcon.Error);
                Download download = new Download();
                download.abrir(@"Dados.zip");
                ArquivoZip.ExtrairArquivoZip("Dados.zip", AppDomain.CurrentDomain.BaseDirectory.ToString());//chamando classe para extrair o Dados.mdb e deletar o arquivo zip
                
            }
            catch (Exception)
            {
                MessageBox.Show("Um erro ocorreu ao executar a Coletânea de Louvor.\nPara corrigir, precisamos realizar novamente o download do arquivo de Dados.", "Falha na execução do programa!", MessageBoxButtons.OK, MessageBoxIcon.Error);
                Download download = new Download();
                download.abrir(@"Dados.zip");
                ArquivoZip.ExtrairArquivoZip("Dados.zip", AppDomain.CurrentDomain.BaseDirectory.ToString());//chamando classe para extrair o Dados.mdb e deletar o arquivo zip
            }

            try
            {
                if (File.Exists("Dados.zip"))
                {
                    File.Delete("Dados.zip");
                    aConnection.Open();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }    

            foreach (var post in ScreenProperties.getAllScreens())
                cboTela.Items.Add(post.DeviceName.Replace(@"\\.\DISPLAY", "Tela "));

            //SELECIONAR A TELA SECUNDÁRIA COMO PADRÃO NO COMBO
            if (cboTela.Items.Count != 1)
                cboTela.SelectedIndex = ScreenProperties.getScreenSecondary() - 1;
            else //SE NÃO TIVER, SERÁ SELECIONADA A TELA PRINCIPAL
                cboTela.SelectedIndex = 0;

            btnJa_Click(sender, e);
        }

        private void FormPrincipal_FormClosing(object sender, FormClosingEventArgs e)
        {
            aConnection.Close();
        }

        //CLASSE DAS CRIAÇÕES DOS BOTÕES NO PANELDIREITA. Exceto o Hinário
        private void btn(OleDbCommand aCommand)
        {
            panelDireita.Controls.Clear(); //Limpar o panel

            try
            {
                //cria o objeto datareader para fazer a conexao com a tabela
                OleDbDataReader aReader = aCommand.ExecuteReader();

                //Faz a interação com o banco de dados lendo os dados da tabela
                while (aReader.Read())
                {
                    //Se a capa existir, o botão será criado
                    if (File.Exists(@"arquivos\\capas\\" + aReader.GetString(2) + ".jpg"))
                    {
                        //cria o botão do cd
                        Button button = new Button();
                        button.Name = aReader.GetString(1); //nome do button no Access
                        button.Font = new Font("Calibri", 15, FontStyle.Regular);
                        button.ForeColor = Color.Black;
                        button.Size = new Size(165, 165);
                        button.BackColor = Color.Transparent;
                        button.BackgroundImage = Image.FromFile(@"arquivos\\capas\\" + aReader.GetString(2) + ".jpg"); //nome da capa no Access
                        button.BackgroundImageLayout = ImageLayout.Stretch;
                        button.FlatStyle = FlatStyle.Flat;
                        button.Tag = aReader.GetString(2); //nome da capa no Access

                        //Adiciona o botão no panel2
                        panelDireita.Controls.Add(button);

                        //AQUI CRIA OS BOTÕES PARA QUE O USUÁRIO ABRA O CD
                        button.Click += new EventHandler(btnAbrir_Click);
                        button.Cursor = Cursors.Hand;
                    }
                    else //se a capa não existir, será feito o download e se for sucessível, será criado o botão
                    {
                        MessageBox.Show("Para executar o álbum " + aReader.GetString(0) + ", você precisa realizar o download da capa que no momento não se encontra em seu computador.");
                        Download download = new Download();
                        download.abrir(@"arquivos\\capas\\" + aReader.GetString(2) + ".jpg");

                        if (File.Exists(@"arquivos\\capas\\" + aReader.GetString(2) + ".jpg"))
                        {
                            //cria o botão do cd
                            Button button = new Button();
                            button.Name = aReader.GetString(1); //nome do button no Access
                            button.Font = new Font("Calibri", 15, FontStyle.Regular);
                            button.ForeColor = Color.Black;
                            button.Size = new Size(165, 165);
                            button.BackColor = Color.Transparent;
                            button.BackgroundImage = Image.FromFile(@"arquivos\\capas\\" + aReader.GetString(2) + ".jpg"); //nome da capa no Access
                            button.BackgroundImageLayout = ImageLayout.Stretch;
                            button.FlatStyle = FlatStyle.Flat;
                            button.Tag = aReader.GetString(2); //nome da capa no Access

                            //Adiciona o botão no panel2
                            panelDireita.Controls.Add(button);

                            //AQUI CRIA OS BOTÕES PARA QUE O USUÁRIO ABRA O CD
                            button.Click += new EventHandler(btnAbrir_Click);
                            button.Cursor = Cursors.Hand;
                        }
                    }
                }
                //fecha o reader
                aReader.Close();

            }
            //Trata a exceção
            catch (OleDbException ex)
            {
                MessageBox.Show("Error: {0}", ex.Errors[0].Message);
                aConnection.Dispose();
                this.Dispose();
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
                aConnection.Dispose();
                this.Dispose();
                this.Close();
            }
        }

        private void btnAbrir_Click(object sender, EventArgs e)
        {
            Button button = sender as Button;//para pegar as informações do button criado
            if (button.Name.Equals(button.Tag))
            {
                FormButton botao = new FormButton(button.Name);
                botao.Show();
            }
            else //Se ele não for, então o arquivo que foi aberto é individual, ou seja, não está dentro de um álbum
            {
                string caminhoArquivo = string.Empty;
                try
                {
                    caminhoArquivo = @"arquivos\\coletaneas\\" + button.Name + "\\" + button.Tag;
                    Process.Start(caminhoArquivo);
                }
                catch (Win32Exception)
                {
                    Download download = new Download();
                    download.abrir(caminhoArquivo);
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }            
        }

        private void btnHinario_Click(object sender, EventArgs e)
        {            
            //panelDireita.Controls.Clear(); //Limpar o panel

            //Trocando as cores dos botões do panelEsquerda
            //Imagens
            btnHinario.BackgroundImage = Properties.Resources._1_Hinario_branco;
            btnJa.BackgroundImage = Properties.Resources._2_LouvoresJA_cinza;
            btnColetanea.BackgroundImage = Properties.Resources._3_Coletanea_cinza;
            btnLouvores.BackgroundImage = Properties.Resources._4_Louvores_cinza;
            btnDoxologia.BackgroundImage = Properties.Resources._5_Doxologia_cinza;
            btnInfantil.BackgroundImage = Properties.Resources._6_Infantil_cinza;
            btnUtilitarios.BackgroundImage = Properties.Resources._7_Utilitarios_cinza;
            btnSobre.BackgroundImage = Properties.Resources._8_Sobre_cinza;
            //Fundo
            btnHinario.BackColor = Color.FromArgb(63, 70, 82);
            btnJa.BackColor = Color.FromArgb(39, 44, 51);
            btnColetanea.BackColor = Color.FromArgb(39, 44, 51);
            btnLouvores.BackColor = Color.FromArgb(39, 44, 51);
            btnDoxologia.BackColor = Color.FromArgb(39, 44, 51);
            btnInfantil.BackColor = Color.FromArgb(39, 44, 51);
            btnUtilitarios.BackColor = Color.FromArgb(39, 44, 51);
            btnSobre.BackColor = Color.FromArgb(39, 44, 51);

            //Habilita/desabilita os botões.
            btnJa.Enabled = true;
            btnColetanea.Enabled = true;
            btnLouvores.Enabled = true;
            btnDoxologia.Enabled = true;
            btnInfantil.Enabled = true;
            btnUtilitarios.Enabled = true;

            FormHinario hinario = new FormHinario();
            hinario.ShowDialog();
        }

        private void btnJa_Click(object sender, EventArgs e)
        {
            //Trocando as cores dos botões do panelEsquerda
            //Imagens
            btnHinario.BackgroundImage = Properties.Resources._1_Hinario_cinza;
            btnJa.BackgroundImage = Properties.Resources._2_LouvoresJA_branco;
            btnColetanea.BackgroundImage = Properties.Resources._3_Coletanea_cinza;
            btnLouvores.BackgroundImage = Properties.Resources._4_Louvores_cinza;
            btnDoxologia.BackgroundImage = Properties.Resources._5_Doxologia_cinza;
            btnInfantil.BackgroundImage = Properties.Resources._6_Infantil_cinza;
            btnUtilitarios.BackgroundImage = Properties.Resources._7_Utilitarios_cinza;
            btnSobre.BackgroundImage = Properties.Resources._8_Sobre_cinza;
            //Fundo
            btnHinario.BackColor = Color.FromArgb(39, 44, 51);
            btnJa.BackColor = Color.FromArgb(63, 70, 82);
            btnColetanea.BackColor = Color.FromArgb(39, 44, 51);
            btnLouvores.BackColor = Color.FromArgb(39, 44, 51);
            btnDoxologia.BackColor = Color.FromArgb(39, 44, 51);
            btnInfantil.BackColor = Color.FromArgb(39, 44, 51);
            btnUtilitarios.BackColor = Color.FromArgb(39, 44, 51);
            btnSobre.BackColor = Color.FromArgb(39, 44, 51);

            //cria o objeto command and armazena a consulta SQL
            OleDbCommand aCommand = new OleDbCommand("SELECT DISTINCT Album, Button, Capa, Ordem FROM Dados WHERE Button LIKE 'ja_%' OR Button LIKE 'Adoradores-%' OR Button LIKE 'Celebra-SP-%' OR Button LIKE 'Acustico-NT%' OR Button LIKE 'Daniel-Ludtke_%' OR Button LIKE 'Ministerio-Louvor_%' ORDER BY Ordem DESC, Album DESC", aConnection);

            //Chama a classe para importar os botões
            btn(aCommand);

            //Habilita/desabilita os botões.
            btnJa.Enabled = false;
            btnColetanea.Enabled = true;
            btnLouvores.Enabled = true;
            btnDoxologia.Enabled = true;
            btnInfantil.Enabled = true;
            btnUtilitarios.Enabled = true;
        }

        private void btnColetanea_Click(object sender, EventArgs e)
        {
            //Trocando as cores dos botões do panelEsquerda
            //Imagens
            btnHinario.BackgroundImage = Properties.Resources._1_Hinario_cinza;
            btnJa.BackgroundImage = Properties.Resources._2_LouvoresJA_cinza;
            btnColetanea.BackgroundImage = Properties.Resources._3_Coletanea_branco;
            btnLouvores.BackgroundImage = Properties.Resources._4_Louvores_cinza;
            btnDoxologia.BackgroundImage = Properties.Resources._5_Doxologia_cinza;
            btnInfantil.BackgroundImage = Properties.Resources._6_Infantil_cinza;
            btnUtilitarios.BackgroundImage = Properties.Resources._7_Utilitarios_cinza;
            btnSobre.BackgroundImage = Properties.Resources._8_Sobre_cinza;
            //Fundo
            btnHinario.BackColor = Color.FromArgb(39, 44, 51);
            btnJa.BackColor = Color.FromArgb(39, 44, 51);
            btnColetanea.BackColor = Color.FromArgb(63, 70, 82);
            btnLouvores.BackColor = Color.FromArgb(39, 44, 51);
            btnDoxologia.BackColor = Color.FromArgb(39, 44, 51);
            btnInfantil.BackColor = Color.FromArgb(39, 44, 51);
            btnUtilitarios.BackColor = Color.FromArgb(39, 44, 51);
            btnSobre.BackColor = Color.FromArgb(39, 44, 51);

            //cria o objeto command and armazena a consulta SQL
            OleDbCommand aCommand = new OleDbCommand("SELECT DISTINCT Album, Button, Capa FROM Dados WHERE Button NOT LIKE 'HASD%' AND Button NOT LIKE 'ja_%' AND Button NOT LIKE 'Adoradores-%' AND Button NOT LIKE 'Celebra-SP-%' AND Button NOT LIKE 'Acustico-NT%' AND Button NOT LIKE 'Daniel-Ludtke_%' AND Button NOT LIKE 'Ministerio-Louvor_%' AND Button NOT LIKE 'louvores_%' AND Button NOT LIKE 'doxologia_%' AND Button NOT LIKE 'infantil_%' ORDER BY Button", aConnection);

            //Chama a classe para importar os botões
            btn(aCommand);

            //Habilita/desabilita os botões.
            btnJa.Enabled = true;
            btnColetanea.Enabled = false;
            btnLouvores.Enabled = true;
            btnDoxologia.Enabled = true;
            btnInfantil.Enabled = true;
            btnUtilitarios.Enabled = true;
        }

        private void btnLouvores_Click(object sender, EventArgs e)
        {
            //Trocando as cores dos botões do panelEsquerda
            //Imagens
            btnHinario.BackgroundImage = Properties.Resources._1_Hinario_cinza;
            btnJa.BackgroundImage = Properties.Resources._2_LouvoresJA_cinza;
            btnColetanea.BackgroundImage = Properties.Resources._3_Coletanea_cinza;
            btnLouvores.BackgroundImage = Properties.Resources._4_Louvores_branco;
            btnDoxologia.BackgroundImage = Properties.Resources._5_Doxologia_cinza;
            btnInfantil.BackgroundImage = Properties.Resources._6_Infantil_cinza;
            btnUtilitarios.BackgroundImage = Properties.Resources._7_Utilitarios_cinza;
            btnSobre.BackgroundImage = Properties.Resources._8_Sobre_cinza;
            //Fundo
            btnHinario.BackColor = Color.FromArgb(39, 44, 51);
            btnJa.BackColor = Color.FromArgb(39, 44, 51);
            btnColetanea.BackColor = Color.FromArgb(39, 44, 51);
            btnLouvores.BackColor = Color.FromArgb(63, 70, 82);
            btnDoxologia.BackColor = Color.FromArgb(39, 44, 51);
            btnInfantil.BackColor = Color.FromArgb(39, 44, 51);
            btnUtilitarios.BackColor = Color.FromArgb(39, 44, 51);
            btnSobre.BackColor = Color.FromArgb(39, 44, 51);

            //cria o objeto command and armazena a consulta SQL
            OleDbCommand aCommand = new OleDbCommand("SELECT DISTINCT Album, Button, Capa FROM Dados WHERE Button LIKE 'louvores_%' ORDER BY Capa", aConnection);

            //Chama a classe para importar os botões
            btn(aCommand);

            //Habilita/desabilita os botões.
            btnJa.Enabled = true;
            btnColetanea.Enabled = true;
            btnLouvores.Enabled = false;
            btnDoxologia.Enabled = true;
            btnInfantil.Enabled = true;
            btnUtilitarios.Enabled = true;
        }

        private void btnDoxologia_Click(object sender, EventArgs e)
        {
            //Trocando as cores dos botões do panelEsquerda
            //Imagens
            btnHinario.BackgroundImage = Properties.Resources._1_Hinario_cinza;
            btnJa.BackgroundImage = Properties.Resources._2_LouvoresJA_cinza;
            btnColetanea.BackgroundImage = Properties.Resources._3_Coletanea_cinza;
            btnLouvores.BackgroundImage = Properties.Resources._4_Louvores_cinza;
            btnDoxologia.BackgroundImage = Properties.Resources._5_Doxologia_branco;
            btnInfantil.BackgroundImage = Properties.Resources._6_Infantil_cinza;
            btnUtilitarios.BackgroundImage = Properties.Resources._7_Utilitarios_cinza;
            btnSobre.BackgroundImage = Properties.Resources._8_Sobre_cinza;
            //Fundo
            btnHinario.BackColor = Color.FromArgb(39, 44, 51);
            btnJa.BackColor = Color.FromArgb(39, 44, 51);
            btnColetanea.BackColor = Color.FromArgb(39, 44, 51);
            btnLouvores.BackColor = Color.FromArgb(39, 44, 51);
            btnDoxologia.BackColor = Color.FromArgb(63, 70, 82);
            btnInfantil.BackColor = Color.FromArgb(39, 44, 51);
            btnUtilitarios.BackColor = Color.FromArgb(39, 44, 51);
            btnSobre.BackColor = Color.FromArgb(39, 44, 51);

            //cria o objeto command and armazena a consulta SQL
            OleDbCommand aCommand = new OleDbCommand("SELECT DISTINCT Album, Button, Capa, Ordem FROM Dados WHERE Button LIKE 'doxologia_%' ORDER BY Ordem Desc, Capa", aConnection);

            //Chama a classe para importar os botões
            btn(aCommand);

            //Habilita/desabilita os botões.
            btnJa.Enabled = true;
            btnColetanea.Enabled = true;
            btnLouvores.Enabled = true;
            btnDoxologia.Enabled = false;
            btnInfantil.Enabled = true;
            btnUtilitarios.Enabled = true;
        }

        private void btnInfantil_Click(object sender, EventArgs e)
        {
            //Trocando as cores dos botões do panelEsquerda
            //Imagens
            btnHinario.BackgroundImage = Properties.Resources._1_Hinario_cinza;
            btnJa.BackgroundImage = Properties.Resources._2_LouvoresJA_cinza;
            btnColetanea.BackgroundImage = Properties.Resources._3_Coletanea_cinza;
            btnLouvores.BackgroundImage = Properties.Resources._4_Louvores_cinza;
            btnDoxologia.BackgroundImage = Properties.Resources._5_Doxologia_cinza;
            btnInfantil.BackgroundImage = Properties.Resources._6_Infantil_branco;
            btnUtilitarios.BackgroundImage = Properties.Resources._7_Utilitarios_cinza;
            btnSobre.BackgroundImage = Properties.Resources._8_Sobre_cinza;
            //Fundo
            btnHinario.BackColor = Color.FromArgb(39, 44, 51);
            btnJa.BackColor = Color.FromArgb(39, 44, 51);
            btnColetanea.BackColor = Color.FromArgb(39, 44, 51);
            btnLouvores.BackColor = Color.FromArgb(39, 44, 51);
            btnDoxologia.BackColor = Color.FromArgb(39, 44, 51);
            btnInfantil.BackColor = Color.FromArgb(63, 70, 82);
            btnUtilitarios.BackColor = Color.FromArgb(39, 44, 51);
            btnSobre.BackColor = Color.FromArgb(39, 44, 51);

            //cria o objeto command and armazena a consulta SQL
            OleDbCommand aCommand = new OleDbCommand("SELECT DISTINCT Album, Button, Capa, Ordem FROM Dados WHERE Button LIKE 'infantil_%' ORDER BY Ordem DESC, Capa", aConnection);

            //Chama a classe para importar os botões
            btn(aCommand);

            //Habilita/desabilita os botões.
            btnJa.Enabled = true;
            btnColetanea.Enabled = true;
            btnLouvores.Enabled = true;
            btnDoxologia.Enabled = true;
            btnInfantil.Enabled = false;
            btnUtilitarios.Enabled = true;
        }

        private void btnUtilitarios_Click(object sender, EventArgs e)
        {
            panelDireita.Controls.Clear(); //Limpar o panel

            //Trocando as cores dos botões do panelEsquerda
            //Imagens
            btnHinario.BackgroundImage = Properties.Resources._1_Hinario_cinza;
            btnJa.BackgroundImage = Properties.Resources._2_LouvoresJA_cinza;
            btnColetanea.BackgroundImage = Properties.Resources._3_Coletanea_cinza;
            btnLouvores.BackgroundImage = Properties.Resources._4_Louvores_cinza;
            btnDoxologia.BackgroundImage = Properties.Resources._5_Doxologia_cinza;
            btnInfantil.BackgroundImage = Properties.Resources._6_Infantil_cinza;
            btnUtilitarios.BackgroundImage = Properties.Resources._7_Utilitarios_branco;
            btnSobre.BackgroundImage = Properties.Resources._8_Sobre_cinza;
            //Fundo
            btnHinario.BackColor = Color.FromArgb(39, 44, 51);
            btnJa.BackColor = Color.FromArgb(39, 44, 51);
            btnColetanea.BackColor = Color.FromArgb(39, 44, 51);
            btnLouvores.BackColor = Color.FromArgb(39, 44, 51);
            btnDoxologia.BackColor = Color.FromArgb(39, 44, 51);
            btnInfantil.BackColor = Color.FromArgb(39, 44, 51);
            btnUtilitarios.BackColor = Color.FromArgb(63, 70, 82);
            btnSobre.BackColor = Color.FromArgb(39, 44, 51);

            #region criação dos botões dos utilitários
            //cria os botões dos utilitários
            Button btnBiblia = new Button();
            btnBiblia.Name = "btnBiblia";
            btnBiblia.Font = new Font("Calibri", 15, FontStyle.Regular);
            btnBiblia.ForeColor = Color.Black;
            btnBiblia.Size = new Size(165, 165);
            btnBiblia.BackColor = Color.Transparent;
            //btnBiblia.BackgroundImage = Properties.Resources.
            btnBiblia.BackgroundImageLayout = ImageLayout.Stretch;
            btnBiblia.FlatStyle = FlatStyle.Flat;

            Button btnCronometro = new Button();
            btnCronometro.Name = "btnCronometro";
            btnCronometro.Font = new Font("Calibri", 15, FontStyle.Regular);
            btnCronometro.ForeColor = Color.Black;
            btnCronometro.Size = new Size(165, 165);
            btnCronometro.BackColor = Color.Transparent;
            btnCronometro.BackgroundImage = Properties.Resources.Cronômetro;
            btnCronometro.BackgroundImageLayout = ImageLayout.Stretch;
            btnCronometro.FlatStyle = FlatStyle.Flat;

            Button btnEscolaSabatina = new Button();
            btnEscolaSabatina.Name = "btnEscolaSabatina";
            btnEscolaSabatina.Font = new Font("Calibri", 15, FontStyle.Regular);
            btnEscolaSabatina.ForeColor = Color.Black;
            btnEscolaSabatina.Size = new Size(165, 165);
            btnEscolaSabatina.BackColor = Color.Transparent;
            btnEscolaSabatina.BackgroundImage = Properties.Resources.Escola_Sabatina;
            btnEscolaSabatina.BackgroundImageLayout = ImageLayout.Stretch;
            btnEscolaSabatina.FlatStyle = FlatStyle.Flat;

            Button btnProvaieVede = new Button();
            btnProvaieVede.Name = "btnProvaieVede";
            btnProvaieVede.Font = new Font("Calibri", 15, FontStyle.Regular);
            btnProvaieVede.ForeColor = Color.Black;
            btnProvaieVede.Size = new Size(165, 165);
            btnProvaieVede.BackColor = Color.Transparent;
            btnProvaieVede.BackgroundImage = Properties.Resources.provai_e_vede;
            btnProvaieVede.BackgroundImageLayout = ImageLayout.Stretch;
            btnProvaieVede.FlatStyle = FlatStyle.Flat;

            Button btnSorteioNum = new Button();
            btnSorteioNum.Name = "btnSorteioNum";
            btnSorteioNum.Font = new Font("Calibri", 15, FontStyle.Regular);
            btnSorteioNum.ForeColor = Color.Black;
            btnSorteioNum.Size = new Size(165, 165);
            btnSorteioNum.BackColor = Color.Transparent;
            btnSorteioNum.BackgroundImage = Properties.Resources.Sorteio_num;
            btnSorteioNum.BackgroundImageLayout = ImageLayout.Stretch;
            btnSorteioNum.FlatStyle = FlatStyle.Flat;
            #endregion

            //Adiciona o botão no panelcentral
            panelDireita.Controls.Add(btnCronometro);
            panelDireita.Controls.Add(btnEscolaSabatina);
            panelDireita.Controls.Add(btnProvaieVede);
            panelDireita.Controls.Add(btnSorteioNum);

            //AQUI CRIA OS BOTÕES PARA QUE O USUÁRIO ABRA O UTILITÁRIO
            btnCronometro.Click += new EventHandler(btnCronometro_Click);
            btnCronometro.Cursor = Cursors.Hand;

            btnEscolaSabatina.Click += new EventHandler(EscolaSabatina_Click);
            btnEscolaSabatina.Cursor = Cursors.Hand;

            btnProvaieVede.Click += new EventHandler(btnProvaieVede_Click);
            btnProvaieVede.Cursor = Cursors.Hand;

            btnSorteioNum.Click += new EventHandler(btnSorteioNum_Click);
            btnSorteioNum.Cursor = Cursors.Hand;

            //Habilita/desabilita os botões.
            btnJa.Enabled = true;
            btnColetanea.Enabled = true;
            btnLouvores.Enabled = true;
            btnDoxologia.Enabled = true;
            btnInfantil.Enabled = true;
            btnUtilitarios.Enabled = false;
        }

        private void btnSorteioNum_Click(object sender, EventArgs e)
        {
            FormSorteioNum abrir = new FormSorteioNum();
            abrir.Show();
        }

        private void btnProvaieVede_Click(object sender, EventArgs e)
        {
            //Comando para selecionar o monitor da tela estendida
            string selecionaTela = Convert.ToString(cboTela.SelectedItem);
            int numTela = ScreenProperties.getIndexFromName(selecionaTela);

            FormProvaieVede abrir = new FormProvaieVede();
            abrir.Show();
        }

        private void EscolaSabatina_Click(object sender, EventArgs e)
        {
            //Comando para selecionar o monitor da tela estendida
            string selecionaTela = Convert.ToString(cboTela.SelectedItem);
            int numTela = ScreenProperties.getIndexFromName(selecionaTela);

            FormEscolaSabatina abrir = new FormEscolaSabatina(numTela - 1); //variável 'numTela' diminui um valor para que se inicie em '0'
            abrir.Show();
        }

        private void btnCronometro_Click(object sender, EventArgs e)
        {
            FormCronometro abrir = new FormCronometro();
            abrir.Show();
        }

        //Usuário poder dar ENTER no Busca
        private void txtBusca_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == 13)
                this.busca();
        }

        //CAMPO PESQUISAR LOUVOR
        private void busca()
        {
            panelEncontradas.Controls.Clear();//limpa todo o groupbox das músicas já listadas (se houver)
            panelEncontradas.BackgroundImage = null;

            if (txtBusca.Text != "" && txtBusca.Text != "Busque o Hino...")
            {

                //CRIAÇÃO DAS LABELS COM O NOME DAS MÚSICAS NO GROUPBOX LISTAMÚSICAS
                int x = 5; //definir local  horizontal
                int y = 10; //definir local vertical

                //cria o objeto command and armazena a consulta SQL
                OleDbCommand aCommand = new OleDbCommand("SELECT * FROM Dados WHERE Titulo LIKE '%" + txtBusca.Text + "%' OR Id LIKE '" + txtBusca.Text + "' OR Letra LIKE '%" + txtBusca.Text + "%' ORDER BY Album", aConnection);

                try
                {
                    //cria o objeto datareader para fazer a conexao com a tabela
                    OleDbDataReader aReader = aCommand.ExecuteReader();

                    //Faz a interação com o banco de dados lendo os dados da tabela
                    while (aReader.Read())
                    {
                        //cria as labels da pesquisa
                        Label label = new Label();
                        label.Name = aReader.GetString(4); //nome do button no Access
                        label.Font = new Font("Calibri", 10, FontStyle.Bold);
                        label.ForeColor = Color.White;
                        label.AutoSize = true;
                        label.BackColor = Color.Transparent;
                        label.Location = new Point(x, y);
                        label.Tag = aReader.GetString(6); //nome do caminho no Access
                        label.Text = aReader.GetString(1) + " (" + aReader.GetString(2) + ")";

                        //INSERE O BOTÃO E LABEL NO PANEL DAS MÚSICAS ENCONTRADAS
                        panelEncontradas.Controls.Add(label);

                        y = y + 20;//aumenta o número de linhas do nome das músicas

                        //AQUI É CHAMADO O EVENTO PARA ABRIR O HINO ESCOLHIDO
                        label.Click += new EventHandler(lblInserir_Click);
                        label.Cursor = Cursors.Hand;
                    }
                    //fecha o reader
                    aReader.Close();

                }
                //Trata a exceção
                catch (OleDbException ex)
                {
                    MessageBox.Show("Error: {0}", ex.Errors[0].Message);
                }
            }
            else
            {                
                panelEncontradas.BackgroundImage = Properties.Resources.logo_e_midias;
                MessageBox.Show("O campo de pesquisa está em branco, preencha corretamente e tente novamente.", "Falha na Pesquisa!", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }                
        }

        //LABEL CRIADA PELO SISTEMA DE BUSCA
        private void lblInserir_Click(object sender, EventArgs e)
        {
            //Aqui pega as informações do label clicado
            Label label = sender as Label;
            string caminhoArquivo = string.Empty;

            try
            {
                DirectoryInfo Dir;//Aqui é criado a variável do diretório dos arquivos de busca
                Dir = new DirectoryInfo(@"arquivos\\coletaneas\\");//define o local do diretório
                caminhoArquivo = Dir + label.Name + "\\" + label.Tag;
                Process.Start(caminhoArquivo);
            }
            catch (Win32Exception)
            {
                Download download = new Download();
                download.abrir(caminhoArquivo);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }   
        }

        //ANOTAÇÕES
        private void txtInformacoes_Leave(object sender, EventArgs e)
        {
            if (txtInformacoes.Text == "")
            {
                txtInformacoes.Text = "Anotações:";
                txtInformacoes.ForeColor = Color.Black;
            }
        }

        //ANOTAÇÕES
        private void txtInformacoes_MouseClick(object sender, MouseEventArgs e)
        {
            if (txtInformacoes.Text == "Anotações:")
                txtInformacoes.Text = "";
        }

        //BOTÃO SOBRE
        private void btnSobre_Click(object sender, EventArgs e)
        {
            //panelDireita.Controls.Clear(); //Limpar o panel

            //Trocando as cores dos botões do panelEsquerda
            //Imagens
            btnHinario.BackgroundImage = Properties.Resources._1_Hinario_cinza;
            btnJa.BackgroundImage = Properties.Resources._2_LouvoresJA_cinza;
            btnColetanea.BackgroundImage = Properties.Resources._3_Coletanea_cinza;
            btnLouvores.BackgroundImage = Properties.Resources._4_Louvores_cinza;
            btnDoxologia.BackgroundImage = Properties.Resources._5_Doxologia_cinza;
            btnInfantil.BackgroundImage = Properties.Resources._6_Infantil_cinza;
            btnUtilitarios.BackgroundImage = Properties.Resources._7_Utilitarios_cinza;
            btnSobre.BackgroundImage = Properties.Resources._8_Sobre_branco;
            //Fundo
            btnHinario.BackColor = Color.FromArgb(39, 44, 51);
            btnJa.BackColor = Color.FromArgb(39, 44, 51);
            btnColetanea.BackColor = Color.FromArgb(39, 44, 51);
            btnLouvores.BackColor = Color.FromArgb(39, 44, 51);
            btnDoxologia.BackColor = Color.FromArgb(39, 44, 51);
            btnInfantil.BackColor = Color.FromArgb(39, 44, 51);
            btnUtilitarios.BackColor = Color.FromArgb(39, 44, 51);
            btnSobre.BackColor = Color.FromArgb(63, 70, 82);

            //Habilita/desabilita os botões.
            btnJa.Enabled = true;
            btnColetanea.Enabled = true;
            btnLouvores.Enabled = true;
            btnDoxologia.Enabled = true;
            btnInfantil.Enabled = true;
            btnUtilitarios.Enabled = true;

            FormSobre sobre = new FormSobre();
            sobre.ShowDialog();
        }

        //LINK DOS BOTÕES DO CONTATO NA TELA SOBRE
        private void lblContato_Click(object sender, EventArgs e)
        {
            Label label = sender as Label;
            ProcessStartInfo abrirLink;
            string site = label.Text;

            if (site.Contains("@"))
                abrirLink = new ProcessStartInfo("mailto:" + site);
            else
                abrirLink = new ProcessStartInfo(site);

            Process.Start(abrirLink);
        }

        //TEXTBOX Busca - Quando o usuário sai do textbox
        private void txtBusca_Leave(object sender, EventArgs e)
        {
            timerBuscaHino.Interval = 3000;
            timerBuscaHino.Start();
            
        }

        //TEXTBOX Busca - Quando o usuário clica no textbox
        private void txtBusca_MouseClick(object sender, MouseEventArgs e)
        {            
            if (txtBusca.Text == "Busque o Hino...")
            {
                txtBusca.Text = "";
                txtBusca.ForeColor = Color.Black;
            }                
        }

        //Picturebox para fechar
        private void pbFechar_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        //Picturebox para minimizar
        private void pbMinimizar_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;
        }

        //Picturebox para restaurar e maximizar
        private void pbMaximizar_Click(object sender, EventArgs e)
        {
            if (this.WindowState == FormWindowState.Maximized)
                this.WindowState = FormWindowState.Normal;
            else
                this.WindowState = FormWindowState.Maximized;
            
        }

        //Timer para voltar a escrever 'Busque o Hino...'
        private void timerBuscaHino_Tick(object sender, EventArgs e)
        {
            txtBusca.Text = "Busque o Hino...";
            txtBusca.ForeColor = Color.Silver;
            timerBuscaHino.Stop();
        }

        private void txtBusca_TextChanged(object sender, EventArgs e)
        {

        }
    }
}