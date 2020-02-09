using ColetaneaDeLouvor.DAO;
using ColetaneaDeLouvor.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
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

        private void btnAbrir_Click(object sender, EventArgs e)
        {
            DateTime escolhido = dtVideo.Value;

            //Se o dia atual for domingo, quarta ou sábado
            if ((int)escolhido.DayOfWeek == 0 || (int)escolhido.DayOfWeek == 3 || (int)escolhido.DayOfWeek == 6)
            {
                CultureInfo culture = new CultureInfo("pt-BR");
                DateTimeFormatInfo dtfi = culture.DateTimeFormat;

                string dia = Convert.ToString(escolhido.Day);
                string ano = Convert.ToString(escolhido.Year);
                string mesNum = Convert.ToString(escolhido.Month);
                string mesExtenso = culture.TextInfo.ToTitleCase(dtfi.GetMonthName(escolhido.Month));
                string diaSemana = culture.TextInfo.ToTitleCase(dtfi.GetDayName(escolhido.DayOfWeek));

                if (mesNum.Length == 1) //se tiver apenas um caracter, um 0 a esquerda será add no mês
                    mesNum = mesNum.PadLeft(2, '0');

                if (dia.Length == 1) //se tiver apenas um caracter, um 0 a esquerda será add no dia
                    dia = dia.PadLeft(2, '0');

                mesExtenso = (Char.ToLower(mesExtenso[0]) + mesExtenso.Substring(1)); //tornar a primeira letra em minúscula

                string caminhoArquivo = string.Empty;

                try
                {
                    DirectoryInfo dir = new DirectoryInfo(@"arquivos\\provai_e_vede\\" + diaSemana + "\\" + mesNum + "_" + mesExtenso + "\\");
                    List<string> lista = new List<string>();

                    switch(diaSemana)
                    {
                        case "Sábado":
                            lista = ProvaieVede.Sabado(mesExtenso);
                            break;
                        case "Domingo":
                            lista = ProvaieVede.Domingo(mesExtenso);
                            break;
                        default:
                            lista = ProvaieVede.Quarta(mesExtenso);
                            break;
                    }

                    foreach (string result in lista)
                    {
                        if (result.Contains(dia))
                        {                            
                            caminhoArquivo = dir + result; //Endereço do arquivo. Ex.: arquivos\\provai_e_vede\\Sábado\\01_janeiro\\04_Uma Exceção.mp4
                        }
                    }

                    if (File.Exists(caminhoArquivo))
                    {
                        //Abrir o arquivo
                        Process.Start(caminhoArquivo);
                        Thread.Sleep(2000);
                        SendKeys.SendWait("%{ENTER}");
                    }
                    else
                    {
                        //Criando as pastas das semanas
                        string path = @"arquivos\\provai_e_vede";
                        Directory.CreateDirectory(path + "\\Domingo");
                        Directory.CreateDirectory(path + "\\Quarta-Feira");
                        Directory.CreateDirectory(path + "\\Sábado");

                        Download download = new Download();
                        download.abrir(caminhoArquivo);
                    }
                }
                catch (Exception)
                {
                    string local = AppDomain.CurrentDomain.BaseDirectory.ToString() + "\\arquivos\\provai_e_vede";
                    MessageBox.Show("Arquivo não encontrado, por favor, realize o download através do site\n https://downloads.adventistas.org/pt/projeto/provai-e-vede/ \nVocê também pode entrar em contato com a equipe da Coletânea de Louvor ou adquira a mídia com a sua Associação/Missão local.\n\nApós estar com o conteúdo em mãos, coloque os vídeos de acordo com o seu dia da semana e mês nesse local:\n" + local, "Falha ao encontrar o vídeo.", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }                   
            }
            else
                MessageBox.Show("Escolha uma data válida e tente novamente.\n\nOBS.: Dias disponíveis: Domingo, Quarta-feira ou Sábado.", "Data inválida", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
}