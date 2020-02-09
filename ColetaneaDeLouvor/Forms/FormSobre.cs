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
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml;

namespace ColetaneaDeLouvor.Forms
{
    public partial class FormSobre : Form
    {
        List<String> lstNaoEncontradosFaltando = new List<String>();
        List<String> lstNaoEncontradosSobrando = new List<String>();

        public FormSobre()
        {
            InitializeComponent();
        }

        //LINK DO BOTÃO ATUALIZAR O SISTEMA NA TELA SOBRE
        private void linkVerificar_Click(object sender, EventArgs e)
        {
            //Primeiro faz um teste se existe conexão com a internet, se existir o sistema verificará se existe atualização
            int fail = TestarConexao.IsConnected();
            if (fail == 0)
            {
                string versao_local = this.ProductVersion; //pega a versão do app local
                string versao_servidor = string.Empty; //variável para pegar a versão do app na web
                string updater_local = Path.GetFileName(@"\\updater.exe"); //variável para pegar a versão do updater local
                string updater_servidor = string.Empty; //variável para pegar a versão do updater na web

                bool baixarAtualizador = false;

                #region leitura do xml do autoupdate
                XmlDocument doc1 = new XmlDocument();
                doc1.Load(DadosAccess.LinkServidor() + "autoupdate.xml");
                XmlNodeList nodes = doc1.SelectNodes("//update/coletanea");
                foreach (XmlNode node in nodes)
                {
                    versao_servidor = node["versao_servidor"].InnerText;
                    updater_servidor = node["updater_servidor"].InnerText;
                }
                #endregion

                if (!versao_local.Equals(versao_servidor)) //SE A VERSÃO DO APP LOCAL FOR DIFERENTE DA VERSÃO DO APP NA WEB
                {
                    if (File.Exists(updater_local)) //SE O APP UPDATER EXISTIR NA MÁQUINA LOCAL
                    {
                        updater_local = FileVersionInfo.GetVersionInfo(updater_local).ProductVersion;//variável recebe a versão do updater local
                        if (updater_local.Equals(updater_servidor)) //SE A VERSÃO DO UPDATER LOCAL FOR IGUAL DA VERSÃO DO UPDATER NA WEB
                        {
                            Process.Start(@"updater.exe"); //abre o software de atualização do sistema
                        }
                        else //SE A VERSÃO DO UPDATER LOCAL FOR DIFERENTE
                        {
                            File.Delete(Path.GetFileName(@"updater.exe"));
                            baixarAtualizador = true;
                        }

                    }
                    else //SE O APP UPDATER NÃO EXISTIR NA MÁQUINA LOCAL
                        baixarAtualizador = true;
                }
                else //SE A VERSÃO DO APP LOCAL FOR IGUAL A DO APP NA WEB
                    MessageBox.Show("Não se preocupe a sua Coletânea de Louvor já está atualizada.", "Coletânea já atualizada!", MessageBoxButtons.OK);

                if (baixarAtualizador == true)
                {
                    Download download = new Download();
                    download.abrir(Path.GetFileName(@"updater.exe"));
                }
            }
        }

        private void FormSobre_Load(object sender, EventArgs e)
        {
            lblVersao.Text = this.ProductVersion;
        }

        private void pnlLinkSite_Click(object sender, EventArgs e)
        {
            abrirLink("www.coletanealouvor.com.br");
        }

        public void abrirLink(String link)
        {
            Process.Start(link);
        }

        void ajustar()
        {
            var path = Application.StartupPath + @"\arquivos\coletaneas";
            var lstArquivosFisicos = Directory.GetFiles(path, "*.*", SearchOption.AllDirectories).ToList();

            var lstEncontradosFaltando = new List<String>();
            var lstEncontradosSobrando = new List<String>();

            var dt = new DataTable();
            var adapter = new OleDbDataAdapter("select distinct button+'\\'+caminho as caminho from dados", DadosAccess.Dados());
            adapter.Fill(dt);

            //1ª verificação
            foreach (DataRow r in dt.Rows)
            {
                var c = r["caminho"].ToString();
                if (lstArquivosFisicos.Contains(Path.Combine(path, c)))
                    lstEncontradosFaltando.Add(c);
                else
                {
                    lstNaoEncontradosFaltando.Add(c);
                }

            }
            //lblQtdFaltando.Text = lstNaoEncontradosFaltando.Count.ToString();
            //lnkFaltando.Visible = lstNaoEncontradosFaltando.Count > 0;
            Console.WriteLine("Arquivos > Encontrados: " + lstEncontradosFaltando.Count + " Não: " + lstNaoEncontradosFaltando.Count);
            lstNaoEncontradosFaltando.ForEach(i => Console.WriteLine(i));

            //2ª verificação
            foreach (String a in lstArquivosFisicos)
            {
                if (a.Contains("Dados.mdb") || a.Contains("Coletânea de Louvor.") || a.Contains("Coletanea-de-Louvor") || a.Contains("HASDPPS"))
                    continue;
                if (dt.Compute("count(caminho)", "caminho='" + a.Substring(path.Length + 1) + "'").ToString() != "0")
                    lstEncontradosSobrando.Add(a);
                else
                    lstNaoEncontradosSobrando.Add(a);
            }
            //lblQtdSobrando.Text = lstNaoEncontradosSobrando.Count.ToString();
            //lnkSobrando.Visible = lstNaoEncontradosSobrando.Count > 0;
            Console.WriteLine("Access > Encontrados: " + lstEncontradosSobrando.Count + " Não: " + lstNaoEncontradosSobrando.Count);
            //lstNaoEncontradosSobrando.ForEach(i => Console.WriteLine(i));


        }

        private void lnkAjustar_Click(object sender, EventArgs e)
        {
            ajustar();
        }
    }
}
