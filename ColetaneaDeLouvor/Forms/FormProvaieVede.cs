using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace ColetaneaDeLouvor.Forms
{
    public partial class FormProvaieVede : Form
    {
        public FormProvaieVede()
        {
            InitializeComponent();
        }

        private void FormProvaieVede_Load(object sender, EventArgs e)
        {
            dtVideo.Value = DateTime.Now;//datetime recebe a data atual
        }

        String getMes(Int32 mes)
        {
            switch (mes) {
                case 1:
                    return "01_janeiro";
                case 2:
                    return "02_fevereiro";
                case 3:
                    return "03_março";
                case 4:
                    return "04_abril";
                case 5:
                    return "05_maio";
                case 6:
                    return "06_junho";
                case 7:
                    return "07_julho";
                case 8:
                    return "08_agosto";
                case 9:
                    return "09_setembro";
                case 10:
                    return "10_outubro";
                case 11:
                    return "11_novembro";
                default:
                case 12:
                    return "12_dezembro";
            }
    }

        private void btnAbrir_Click(object sender, EventArgs e)
        {
            abrir();    
        }

        void abrir()
        {
            var data = dtVideo.Value;
            var diaSemana = "erro";

            switch (data.DayOfWeek) {
                case DayOfWeek.Sunday:
                    diaSemana = "Domingo";
                    break;
                case DayOfWeek.Saturday:
                    diaSemana = "Sábado";
                    break;
                case DayOfWeek.Wednesday:
                    diaSemana = "Quarta-Feira";
                    break;
            }

            if (diaSemana == "erro") {
                MessageBox.Show("Escolha uma data válida e tente novamente.\n\nOBS.: Dias disponíveis: Domingo, Quarta-feira ou Sábado.", "Data inválida", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            string caminhoArquivo = string.Empty;
            var dir = new DirectoryInfo(@"arquivos\\provai_e_vede\\" + diaSemana + "\\" + getMes(data.Month) + "\\");
            if (!Directory.Exists(dir.FullName))
                Directory.CreateDirectory(dir.FullName);

            var files = Directory.GetFiles(dir.FullName, data.Day.ToString("00") + "*.mp4");
            if(files.Length == 0) {
                caminhoArquivo = dir.FullName + "\\" + data.Day.ToString("00") + "...mp4";
                MessageBox.Show("Arquivo não encontrado: " + caminhoArquivo + "\nRealize o download no site \nhttps://downloads.adventistas.org/pt/projeto/provai-e-vede", "Falha ao encontrar o vídeo.", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }
            Process.Start(files[0]);
        }
    }
}