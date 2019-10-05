using System;
using System.Windows.Forms;

namespace LouvorJA
{
    public partial class FormAdoradores3 : Form
	{
		public FormAdoradores3()
		{
			InitializeComponent();
		}

		#region eventos
		void pnl01_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("01-Flua-em-Mim");
		}
		void pnl02_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("02-Nossa-Oração");
        }
        void pnl03_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("03-Nas-Mãos-do-Oleiro");
        }
        void pnl04_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("04-Tua-Palavra");
        }
        void pnl05_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("05-Cópia-de-Jesus");
        }
        void pnl06_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("06-Fé-e-Ação");
        }
        void pnl07_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("07-Medley");
        }
        void pnl08_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("08-Santuário-no-Tempo");
        }
        void pnl09_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("09-Declaração");
        }
        void pnl10_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("10-Eu-Vou");
        }
        void pnl11_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("11-Milagres");
        }
        void pnl12_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("12-Em-Tua-Presença");
        }
        void pnl13_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("13-Restaurado");
        }
        void pnl14_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("14-Tua-Casa-Tua-Morada");
        }
        void pnl15_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("15-Quero-Agradecer");
        }
        void pnl16_MouseClick(object sender, MouseEventArgs e)
        {
            abrir("16-Quero-Te-Pedir-Senhor");
        }
        void Form_KeyDown(object sender, KeyEventArgs e)
		{
			if (e.KeyCode == Keys.Escape)
				Close();
		}
		#endregion

		void abrir(string arquivo)
		{
			new Louvor().abrir(@"Adoradores-3\" + arquivo + ".exe");
		}
    }
}
