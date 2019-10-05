using System;
using System.Windows.Forms;

namespace LouvorJA
{
    public partial class FormEuCreio : Form
	{
		public FormEuCreio()
		{
			InitializeComponent();
		}

        #region eventos
        void pnl01_MouseClick(object sender, MouseEventArgs e)
        {
            abrir("Abertura");
        }
        void pnl02_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("Eu-Creio");
		}
		void pnl03_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("Minha-Fortaleza");
		}
		void pnl04_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("Último-Convite");
		}
		void pnl05_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("Doce-Paz");
		}
		void pnl06_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("Orando");
		}
		void pnl07_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("Consagração");
		}
		void pnl08_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("Ouço-Sua-Voz");
		}
		void FormEuCreio_KeyDown(object sender, KeyEventArgs e)
		{
			if (e.KeyCode == Keys.Escape)
				Close();
		}
		#endregion

		void abrir(String arquivo)
		{
			new Louvor().abrir(@"Eu-Creio\" + arquivo + ".exe");
		}

    }
}
