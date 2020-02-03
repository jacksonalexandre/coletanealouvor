using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ColetaneaDeLouvor.Forms
{
    public partial class FormSorteioNum : Form
    {
        delegate void del();

        private static FormSorteioNum frmSorteio = null;

        private String arquivo = Path.Combine(Path.GetTempPath(), "numeros.dat");
        private Int32 minimo;
        private Int32 maximo;

        public FormSorteioNum()
        {
            InitializeComponent();
        }

        #region eventos
        private void btnSortear_Click(object sender, EventArgs e)
        {
            sortear();
        }

        private void btnReiniciar_Click(object sender, EventArgs e)
        {
            reiniciar();
        }

        private void txt_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.KeyCode)
            {
                case Keys.Enter:
                    sortear();
                    break;
                case Keys.Escape:
                    reiniciar();
                    break;
            }
        }

        private void FormSorteioNum_SizeChanged(object sender, EventArgs e)
        {
            lblSorteado.Font = new Font(FontFamily.GenericSansSerif, this.Height / 3);
        }

        private void FormSorteioNum_FormClosed(object sender, FormClosedEventArgs e)
        {
            frmSorteio = null;
        }

        private void FormSorteioNum_Load(object sender, EventArgs e)
        {
            load();
        }
        #endregion

        internal static void Abrir()
        {
            if (frmSorteio == null)
            {
                frmSorteio = new FormSorteioNum();
                frmSorteio.Show();
            }
            else
                frmSorteio.Focus();
        }

        #region métodos
        void load()
        {
            txtNumeroFinal.Focus();
            loadNumerosArquivo();
        }
        void loadNumerosArquivo()
        {
            if (!File.Exists(arquivo))
                return;
            var numeros = File.ReadAllLines(arquivo);
            for (int x = 0; x < numeros.Length; x++)
                if (!String.IsNullOrEmpty(numeros[x]))
                {
                    switch (x)
                    {
                        case 0:
                            txtNumeroInicial.Text = numeros[0];
                            break;
                        case 1:
                            txtNumeroFinal.Text = numeros[1];
                            break;
                        default:
                            lstSorteados.Items.Add(numeros[x]);
                            break;
                    }
                }
        }
        Boolean problemaIntervalo()
        {
            try
            {
                minimo = Convert.ToInt32(txtNumeroInicial.Text);
                maximo = Convert.ToInt32(txtNumeroFinal.Text);
            }
            catch (Exception)
            {
                minimo = 1;
                maximo = 0;
            }
            if (maximo <= 0)
                return true;
            if (minimo > maximo)
            {
                MessageBox.Show("Número mínimo não pode ser maior que o máximo", "Número mínimo de participantes", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return true;
            }
            if (maximo > 99999)
            {
                MessageBox.Show("Número máximo de participantes é 99999, favor escolher outro número.", "Número máximo de participantes", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return true;
            }

            if (lstSorteados.Items.Count > (maximo - minimo))
            {
                lblSorteado.Text = "FIM";
                return true;
            }
            return false;
        }
        void sortear()
        {
            if (problemaIntervalo())
                return;
            var formato = "0";
            while (formato.Length < txtNumeroFinal.Text.Length)
            {
                formato += "0";
            }
            var sorteado = 0;
            var x = 0;
            do
            {
                sorteado = new Random().Next(minimo, maximo + 1);
                lblSorteado.Text = sorteado.ToString(formato);
                lblSorteado.Refresh();
                Thread.Sleep(100);
                x++;
            } while (lstSorteados.Items.Contains(sorteado.ToString()) || x < 10);

            lstSorteados.Items.Insert(0, sorteado.ToString());
            salvarArquivo();
            lblSorteado.Text = sorteado.ToString(formato);
        }

        private void Invoke(del del)
        {
            throw new NotImplementedException();
        }
        void salvarArquivo()
        {
            String[] numeros = new String[1002];
            numeros[0] = minimo.ToString();
            numeros[1] = maximo.ToString();
            for (int x = 0; x < lstSorteados.Items.Count && x < 1000; x++)
                numeros[x + 2] = lstSorteados.Items[x].ToString();
            File.WriteAllLines(arquivo, numeros);
        }
        void reiniciar()
        {
            if (MessageBox.Show("Deseja realmente reiniciar os números do sorteio?", "Reiniciar Sorteio", MessageBoxButtons.YesNo, MessageBoxIcon.Question, MessageBoxDefaultButton.Button2) == DialogResult.No)
                return;
            lstSorteados.Items.Clear();
            lblSorteado.Text = "";
            File.Delete(arquivo);
        }
        #endregion
    }
}
