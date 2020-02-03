using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ColetaneaDeLouvor.Forms
{
    public partial class FormEscolaSabatina : Form
    {
        int numScreen;//variável do número da tela

        public FormEscolaSabatina(int numTela)
        {
            InitializeComponent();
            numScreen = numTela; //número da tela que foi escolhido pelo usuário
        }

        private void FormEscolaSabatina_Load(object sender, EventArgs e)
        {
            //Adicionar 5 minutos e 5 segundos ao DateTimerPicker
            dateTimePicker1.Value = dateTimePicker1.Value.AddSeconds(305);
        }

        private void btnIniciarContagem_Click(object sender, EventArgs e)
        {
            //Verifica se já existe uma Tela de cronômetro da escola sabatina aberta, se sim, um erro será exibido
            if (Application.OpenForms["ContagemForm"] == null)
            {
                //Usuário deve escolher uma data maior que agora
                if (dateTimePicker1.Value > DateTime.Now)
                {
                    FormContagem contagemForm = new FormContagem(dateTimePicker1.Value, numScreen);
                    contagemForm.Show();
                }
                else
                    MessageBox.Show("Escolha uma data válida e tente novamente.", "Data inválida", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            else
                MessageBox.Show("Já existe uma Tela de cronômetro em ação.", "Erro ao abrir a Tela do cronômetro", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }

        private void btnFecharContagem_Click(object sender, EventArgs e)
        {
            //Comando para fechar o form de Contagem e parar o som do 5 ou 1 minuto
            if (Application.OpenForms["FormContagem"] != null)
            {
                FormContagem contagemForm = new FormContagem(DateTime.Now, numScreen);
                contagemForm.StopSound();
                Application.OpenForms["FormContagem"].Close();
            }
        }
    }
}
