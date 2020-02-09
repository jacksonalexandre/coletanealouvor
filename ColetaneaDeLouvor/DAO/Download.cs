using ColetaneaDeLouvor.Database;
using ColetaneaDeLouvor.Forms;
using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Windows.Forms;

namespace ColetaneaDeLouvor.DAO
{
    public class Download
    {
        FormProgresso frmProgresso;

        public void abrir(String arquivo)
        {
            var ext = Path.GetExtension(arquivo);

            if (!File.Exists(arquivo))
            {
                var arquivo2 = arquivo.Replace("mp4", "exe");

                if (File.Exists(arquivo2))
                {
                    arquivo = arquivo2;
                }
                else
                {
                    var msg = "Não foi possível encontrar o arquivo:";
                    msg += "\r\n" + Path.GetFullPath(arquivo);
                    msg += "\r\nGostaria de baixar?";

                    if (MessageBox.Show(msg, "Arquivo não encontrado", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
                        download(arquivo);
                    return;
                }
            }
            try
            {
                abrirLink(arquivo);
                /*switch (Path.GetExtension(arquivo))
                {
                    case ".mp4":
                        var p = Process.Start(arquivo);
                        break;
                    default:
                        p = Process.Start(arquivo);
                        break;
                }*/
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erro: " + ex.Message, "Erro ao abrir arquivo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        void download(String arquivo)
        {
            frmProgresso = new FormProgresso();

            var siteOficial = DadosAccess.LinkServidor();
            using (WebClient client = new WebClient())
            {
                var url = siteOficial + arquivo.Replace("\\", "/");

                if (!arquivo.Contains("updater.exe") || !arquivo.Contains("Dados.zip"))//se a string arquivo não for do atualizador updater
                    url = url.Replace("arquivos//coletaneas//", "");//Substituir o caminho do arquivo no PC pelo do site

                var path = Path.Combine(Application.StartupPath, arquivo);
                var dir = Path.GetDirectoryName(path);
                if (!Directory.Exists(dir))
                    Directory.CreateDirectory(dir);
                client.DownloadProgressChanged += client_DownloadProgressChanged;
                client.DownloadFileCompleted += client_DownloadFileCompleted;
                client.DownloadFileAsync(new Uri(url), path);

                frmProgresso.Arquivo = arquivo;
                frmProgresso.Progresso = 0;

                var rs = frmProgresso.ShowDialog();
                if (rs == DialogResult.Cancel)
                {
                    client.CancelAsync();
                }
            }
        }

        void client_DownloadProgressChanged(object sender, DownloadProgressChangedEventArgs e)
        {
            frmProgresso.Progresso = e.ProgressPercentage;
        }

        void client_DownloadFileCompleted(object sender, System.ComponentModel.AsyncCompletedEventArgs e)
        {
            frmProgresso.Close();
            if (e.Error != null)
            {
                File.Delete(frmProgresso.Arquivo);
                if (e.Cancelled)
                    return;

                var msg = "Não foi possível baixar o arquivo " + Path.GetFileName(frmProgresso.Arquivo);
                if (e.Error.Message.Contains("404"))
                    MessageBox.Show(msg + "\nMotivo: Arquivo indisponível", "Erro");
                if (e.Error.Message.Contains("'coletanealouvor.com.br'"))
                    MessageBox.Show(msg + "\nMotivo: Internet indisponível", "Erro");
            }
            else
                abrir(frmProgresso.Arquivo);
        }
        public void abrirLink(String link)
        {
            if (!link.Contains(".jpg") && !link.Contains(".zip")) //se o link não conter a extensão .jpg e .mdb
                Process.Start(link);
        }
    }
}