using System;
using System.Windows.Forms;

namespace LouvorJA
{
    public partial class FormJA2011 : Form
	{
		public FormJA2011()
		{
			InitializeComponent();
		}

		#region eventos
		void pnl01_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(1);
		}
		void pnl02_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(2);
		}
		void pnl03_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(3);
		}
		void pnl04_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(4);
		}
		void pnl05_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(5);
		}
		void pnl06_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(6);
		}
		void pnl07_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(7);
		}
		void pnl08_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(8);
		}
		void pnl09_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(9);
		}
		void pnl10_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(10);
		}
		void pnl11_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(11);
		}
		void pnl12_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(12);
		}
		void pnl13_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(13);
		}
		void pnl14_MouseClick(object sender, MouseEventArgs e)
		{
			abrir(14);
		}
		void FormJA2011_KeyDown(object sender, KeyEventArgs e)
		{
			if (e.KeyCode == Keys.Escape)
				Close();
		}
		#endregion

		void abrir(Int32 numero)
		{
			new Louvor().abrir(@"JA 2011\" + numero.ToString("00") + ".exe");
		}
	}
}
