using System;
using System.Windows.Forms;

namespace LouvorJA
{
    public partial class FormCelebraSP : Form
	{
		public FormCelebraSP()
		{
			InitializeComponent();
		}

        #region eventos
        void lnk_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e) => abrir((sender as LinkLabel).Text);

		#endregion

		void abrir(String arquivo)
		{
			new Louvor().abrir(@"Celebra-SP-1\" + arquivo.Replace(" ", "-") + ".exe");
		}

        private void FormAcusticoNT_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Escape)
                Close();
        }
    }
}
