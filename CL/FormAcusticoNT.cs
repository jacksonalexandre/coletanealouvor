using System;
using System.Windows.Forms;

namespace LouvorJA
{
    public partial class FormAcusticoNT : Form
	{
		public FormAcusticoNT()
		{
			InitializeComponent();
		}

        #region eventos
        void lnk_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e) => abrir((sender as LinkLabel).Text);

		#endregion

		void abrir(String arquivo)
		{
			new Louvor().abrir(@"Acustico-NT\" + arquivo.Replace(" ", "-") + ".exe");
		}

        private void FormAcusticoNT_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Escape)
                Close();
        }
    }
}
