using ColetaneaDeLouvor.DAO;
using ColetaneaDeLouvor.Database;
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

namespace ColetaneaDeLouvor.Forms
{
    public partial class FormButton : Form
    {
        string nome;//variável para receber o botão que foi passado

        //cria a conexão com o banco de dados do Microsoft Access
        OleDbConnection aConnection = new OleDbConnection(DadosAccess.Dados());

        public FormButton(string button)
        {
            InitializeComponent();

            nome = button;//variável nome recebe o nome do botão que foi passado

            //abre a conexão com o banco de dados
            aConnection.Open();            
        }

        private void FormButton_Load(object sender, EventArgs e)
        {
            int c = 1; //contador
            int x = 30; //definir local  horizontal
            int y = 50; //definir local vertical   
            int xPlay = 0;       
            
            //cria o objeto command and armazena a consulta SQL
            OleDbCommand aCommand = new OleDbCommand("SELECT * FROM Dados WHERE Button LIKE '" + nome + "%' ORDER BY id", aConnection);

            //cria o objeto datareader para fazer a conexao com a tabela
            OleDbDataReader aReader = aCommand.ExecuteReader();

            //Faz a interação com o banco de dados lendo os dados da tabela
            while (aReader.Read())
            {
                if (panel1.Controls.Count == 0)
                {
                    this.Text = aReader.GetString(2);
                    pbCapa.BackgroundImage = Image.FromFile(@"arquivos\\capas\\" + aReader.GetString(5) + ".jpg"); //nome da capa no Access
                }

                PictureBox pb = new PictureBox();
                pb.Name = nome + "__" + c;
                pb.BackgroundImage = Properties.Resources.play;
                pb.BackgroundImageLayout = ImageLayout.Zoom;
                pb.Size = new Size(22, 22);
                pb.Location = new Point(xPlay, y);

                //LINKLABEL COM AS INFORMAÇÕES DO ITEM ESCOLHIDO
                LinkLabel label = new LinkLabel();
                label.Name = nome + "_" + c;
                label.Font = new Font("Calibri", 15, FontStyle.Regular);
                label.ForeColor = Color.Black;
                label.AutoSize = true;
                label.LinkColor = Color.WhiteSmoke;
                label.Anchor = AnchorStyles.Left;
                label.Location = new Point(x, y);
                label.LinkClicked += new LinkLabelLinkClickedEventHandler(label_LinkClicked);
                label.Text = aReader.GetString(1); //nome do título no Access

                panel1.Controls.Add(pb);
                panel1.Controls.Add(label);//panel1 ganha a label

                y = y + 30;//aumenta o número de linhas do nome das músicas
                c++; //aumenta o contador
            }       
            //fecha o reader
            aReader.Close();
        }        

        //CLASSE PARA ABRIR O LINK DO LABEL
        private void label_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            //Aqui pega as informações do label clicado
            Label label = sender as Label;

            //cria o objeto command and armazena a consulta SQL
            OleDbCommand aCommand = new OleDbCommand("SELECT caminho FROM Dados WHERE Button LIKE '" + nome + "%' AND Titulo LIKE '" + label.Text + "'", aConnection);

            //cria o objeto datareader para fazer a conexao com a tabela
            OleDbDataReader aReader = aCommand.ExecuteReader();

            //Faz a interação com o banco de dados lendo os dados da tabela
            while (aReader.Read())
            {
                //ABRIR O LOUVOR ESCOLHIDO, SE NÃO FUNCIONAR ELE SERÁ BAIXADO DA INTERNET
                string caminhoArquivo = string.Empty;
                try
                {
                    caminhoArquivo = @"arquivos\\coletaneas\\" + nome + "\\" + aReader.GetString(0);
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
            //fecha o reader
            aReader.Close();
        }
               
        //SE O ESC FOR PRESSIONADO, O FORM IRÁ SE FECHAR
        private void FormButton_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyValue.Equals(27)) //ESC
            {
                this.Close();
            }
        }
    }
}