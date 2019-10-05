using System;
using System.Windows.Forms;

namespace LouvorJA
{
    public partial class FormCelebraSP2 : Form
	{
		public FormCelebraSP2()
		{
			InitializeComponent();
		}

		#region eventos
		void pnl01_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("Ele-é-o-caminho");
		}
		void pnl02_MouseClick(object sender, MouseEventArgs e)
		{
			abrir("Só-um-pouco-mais");
        }
        void pnl03_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("Nada-vai-separar");
        }
        void pnl04_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("Somos-Um");
        }
        void pnl05_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("Conte-Comigo");
        }
        void pnl06_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("Tu-me-Amas");
        }
        void pnl07_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("Sem-Palavras");
        }
        void pnl08_MouseClick(object sender, MouseEventArgs e)
		{
            abrir("Quero-Ser");
        }
        void Form_KeyDown(object sender, KeyEventArgs e)
		{
			if (e.KeyCode == Keys.Escape)
				Close();
		}
		#endregion

		void abrir(string arquivo)
		{
			new Louvor().abrir(@"Celebra-SP-2\" + arquivo + ".exe");
		}
    }
}
