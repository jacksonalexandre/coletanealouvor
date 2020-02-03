using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Media;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ColetaneaDeLouvor.Forms
{
    public partial class FormContagem : Form
    {
        private DateTime dtFimEvento;
        SoundPlayer Sound = new SoundPlayer();//Para o uso do 5 ou 1 minuto do término da lição
        int numScreen;//variável do número da tela

        public FormContagem(DateTime data, int numTela)
        {
            InitializeComponent();
            dtFimEvento = data;
            numScreen = numTela; //número da tela que foi escolhido pelo usuário
        }

        private void FormContagem_Load(object sender, EventArgs e)
        {
            try
            {
                this.Location = Screen.AllScreens[numScreen].WorkingArea.Location;//Jogar form para a tela estendida
            }
            catch (IndexOutOfRangeException)
            {
                this.Location = Screen.AllScreens[0].WorkingArea.Location;//Se causar um erro na tela estendida, jogar ContagemForm para a tela principal
            }
            finally
            {
                this.FormBorderStyle = FormBorderStyle.None;//Retira a borda do form
                this.WindowState = FormWindowState.Maximized;//Maximiza a tela

                //Textbox do tempo é centralizado na tela
                txtTempo.Left = (this.ClientSize.Width - txtTempo.Width) / 2;
                txtTempo.Top = (this.ClientSize.Height - txtTempo.Height) / 2;
            }
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            //Se alcançou a data selecionada
            if (dtFimEvento <= DateTime.Now)
            {
                timer1.Enabled = false;
                //MessageBox.Show("Fim da contagem.", "Pronto", MessageBoxButtons.OK, MessageBoxIcon.Information);
                this.Close();
            }
            //Se não alcançou, atualiza os labels
            else
            {
                TimeSpan tsTempoRestante = dtFimEvento.Subtract(DateTime.Now);

                //Código usado para inserir um '0' caso o número do tempo tenha apenas 1 algarismo
                string hora = "";
                string minuto = "";
                string segundo = "";
                if (tsTempoRestante.Hours.ToString().Length == 1) hora = "0";
                if (tsTempoRestante.Minutes.ToString().Length == 1) minuto = "0";
                if (tsTempoRestante.Seconds.ToString().Length == 1) segundo = "0";

                //Campo textBox recebe o tempo
                txtTempo.Text = hora + tsTempoRestante.Hours.ToString() + ":" + minuto + tsTempoRestante.Minutes.ToString() + ":" + segundo + tsTempoRestante.Seconds.ToString();

                if (tsTempoRestante.Hours == 0 && tsTempoRestante.Minutes == 5 && tsTempoRestante.Seconds == 0)
                {
                    timer1.Enabled = false;
                    Sound = new SoundPlayer(@"arquivos\\audio\\5minutos.wav");
                    Sound.Play();
                    timer1.Enabled = true;
                }

                if (tsTempoRestante.Hours == 0 && tsTempoRestante.Minutes == 1 && tsTempoRestante.Seconds == 0)
                {
                    timer1.Enabled = false;
                    Sound = new SoundPlayer(@"arquivos\\audio\\1minuto.wav");
                    Sound.Play();
                    timer1.Enabled = true;
                }
            }
        }

        public void StopSound()
        {
            if (Sound != null)//Se o som não for nulo
                Sound.Stop();
        }

        //SE O ESC FOR PRESSIONADO, O FORM IRÁ SE FECHAR
        private void txtTempo_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyValue.Equals(27)) //ESC
            {
                if (Sound != null)//Se o som não for nulo
                    Sound.Stop();
                this.Close();
            }
        }

        //SE O ESC FOR PRESSIONADO, O FORM IRÁ SE FECHAR
        private void FormContagem_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyValue.Equals(27)) //ESC
            {
                if (Sound != null)//Se o som não for nulo
                    Sound.Stop();
                this.Close();
            }
        }
    }
}
