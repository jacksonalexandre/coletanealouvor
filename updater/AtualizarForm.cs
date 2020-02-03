using ColetaneaDeLouvor.DAO;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Deployment.Application;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml;

namespace updater
{
    public partial class AtualizarForm : Form
    {
        private static string pastaRaiz = Path.GetDirectoryName(Application.ExecutablePath); //Armazena o diretório local do app

        public int total = 0;//declaração da variável com total de arquivos para baixar
        public int contador = 0;//declaração do contador para finalizar o programa

        public AtualizarForm()
        {
            InitializeComponent();

            List<string> pathLocal = new List<string>(); //Armazena o diretório do servidor do app
            List<string> pathServidor = new List<string>(); //Armazena o diretório do servidor do app

            //LEITURA DO XML NO LINK DO SERVIDOR
            XmlDocument doc1 = new XmlDocument();
            doc1.Load("http://www.coletanealouvor.com.br/files/autoupdate.xml");            
            XmlNodeList NodeLocal = doc1.SelectNodes("//update/local");
            XmlNodeList NodeServidor = doc1.SelectNodes("//update/servidor");

            for (int i = 0; i < NodeLocal.Count; i++)
            {
                foreach (XmlNode node in NodeLocal[i])
                    pathLocal.Add(node.ChildNodes[0].InnerText);
            }

            for (int i = 0; i < NodeServidor.Count; i++)
            {               
                foreach (XmlNode node in NodeServidor[i])
                    pathServidor.Add(node.ChildNodes[0].InnerText);
            }
            
            total = pathServidor.Count; //variável recebe o nº total de arquivos

            //se o app 'ColetaneaDeLouvor' estiver aberto, ele fecha
            Process[] processes = Process.GetProcessesByName("ColetaneaDeLouvor");
            foreach (Process process in processes)
            {
                process.Kill();
            }
            
            //Baixar os arquivos
            Thread thread = new Thread(() =>
            {
                for (int i=0;i<pathServidor.Count;i++)
                {                    
                    downloadFiles(pathServidor[i], pathLocal[i]); 
                    contador++;
                }                
            });
            thread.Start();            
        }

        //FUNÇÃO PARA ATUALIZAR O APP 'ColetaneaDeLouvor'
        private void downloadFiles(string source, string destination)
        {
            Thread.Sleep(1000); //sistema aguarda 1 segundo

            //AQUI SE INICIA O WEBCLIENT, ONDE É EXECUTADO FUNÇÕES PARA REALIZAR O DOWNLOAD DA ATUALIZAÇÃO
            using (WebClient webClient = new WebClient())
            {
                webClient.DownloadProgressChanged += new DownloadProgressChangedEventHandler(webClient_DownloadProgressChanged);
                webClient.DownloadFileAsync(new Uri(source), destination);
                webClient.DownloadFileCompleted += webClient_DownloadFileCompleted;
            }
        }

        //FUNÇÃO QUE FINALIZA O DOWNLOAD
        private void webClient_DownloadFileCompleted(object sender, AsyncCompletedEventArgs e)
        {
            if (e.Cancelled)
            {
                MessageBox.Show("O download foi cancelado.");
                return;
            }

            if (e.Error != null) // We have an error! Retry a few times, then abort.
            {
                MessageBox.Show("Um erro ocorreu ao realizar o download do arquivo.");
                MessageBox.Show("" + e.Error.Message);
                return;
            }

            if (contador == total)//se o contador for igual o total de arquivos para baixar
            {
                DialogResult resultado = MessageBox.Show("Clique em 'Ok' e abra o programa novamente.", "Atualização realizada com sucesso.", MessageBoxButtons.OK, MessageBoxIcon.Question);

                if (resultado == DialogResult.OK)
                {
                    if (File.Exists("Dados.zip"))
                    {
                        ArquivoZip.ExtrairArquivoZip("Dados.zip", AppDomain.CurrentDomain.BaseDirectory.ToString());//chamando classe para extrair o Dados.mdb e deletar o arquivo zip
                    }

                    //Process.Start(pastaRaiz + @"\ColetaneaDeLouvor.exe"); //abre o app 'ColetaneaDeLouvor'
                                                                          //this.Close(); //fecha o app da atualização
                    this.Close();
                }
            }
        }

        //FUNÇÃO PARA REALIZAR O DOWNLOAD
        private void webClient_DownloadProgressChanged(object sender, System.Net.DownloadProgressChangedEventArgs e)
        {
            // Update progressbar on download
            this.lblProgress.Text = string.Format("Baixando {0} de {1}.", FormatBytes(e.BytesReceived, 1, true), FormatBytes(e.TotalBytesToReceive, 1, true));
            this.progressBar.Value = e.ProgressPercentage;
        }

        //FUNÇÃO PARA A FORMATAÇÃO DE BYTES
        private string FormatBytes(long bytes, int decimalPlaces, bool showByteType)
        {
            double newBytes = bytes;
            string formatString = "{0";
            string byteType = "B";

            // Check if best size in KB
            if (newBytes > 1024 && newBytes < 1048576)
            {
                newBytes /= 1024;
                byteType = "KB";
            }
            else if (newBytes > 1048576 && newBytes < 1073741824)
            {
                // Check if best size in MB
                newBytes /= 1048576;
                byteType = "MB";
            }
            else
            {
                // Best size in GB
                newBytes /= 1073741824;
                byteType = "GB";
            }

            // Show decimals
            if (decimalPlaces > 0)
                formatString += ":0.";

            // Add decimals
            for (int i = 0; i < decimalPlaces; i++)
                formatString += "0";

            // Close placeholder
            formatString += "}";

            // Add byte type
            if (showByteType)
                formatString += byteType;

            return string.Format(formatString, newBytes);
        }
    }
}
