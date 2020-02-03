using ColetaneaDeLouvor.DAO;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ColetaneaDeLouvor.Forms
{
    public partial class FormHinario : Form
    {
        public FormHinario()
        {
            InitializeComponent();
        }

        private void txtHino_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (!(char.IsNumber(e.KeyChar)) && !(e.KeyChar == (char)Keys.Enter) && !(e.KeyChar == (char)Keys.Back))
                e.Handled = true;

            if (e.KeyChar == 13)
                this.btnHino.PerformClick();
        }

        private void btnHino_Click(object sender, EventArgs e)
        {
            //Se no textbox não estiver com o número de caracteres corretos
            string hino = txtHino.Text;
            if (hino.Length == 1)
                hino = "00" + hino;
            else
                if (hino.Length == 2)
                hino = "0" + hino;

            //ABRIR O HINO ESCOLHIDO, SE NÃO FUNCIONAR ELE SERÁ BAIXADO DA INTERNET
            string abrirHino = string.Empty;
            try
            {
                abrirHino = @"arquivos\\coletaneas\\HASD\\" + hino + ".exe";
                Process.Start(abrirHino);
            }
            catch (Win32Exception)
            {
                Download download = new Download();
                download.abrir(abrirHino);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
    }
}
