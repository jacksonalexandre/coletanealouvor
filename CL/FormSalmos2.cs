using System;
using System.Windows.Forms;

namespace LouvorJA
{
    public partial class FormSalmos2 : Form
	{
		public FormSalmos2()
		{
			InitializeComponent();
		}

		#region eventos
		void pnl01_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("01");
		}
		void pnl02_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("02");
        }
        void pnl03_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("03");
        }
        void pnl04_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("04");
        }
        void pnl05_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("05");
        }
        void pnl06_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("06");
        }
        void pnl07_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("07");
        }
        void pnl08_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("08");
        }
        void pnl09_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("09");
        }
        void pnl10_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("10");
        }
        void Form_KeyDown(object sender, KeyEventArgs e)
		{
			if (e.KeyCode == Keys.Escape)
				Close();
		}
		#endregion

		void abrir(string arquivo)
		{
			new Louvor().abrir(@"Salmos-2\" + arquivo + ".exe");
		}
    }
}
