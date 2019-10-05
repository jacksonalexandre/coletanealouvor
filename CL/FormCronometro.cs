using System;
using System.Drawing;
using System.Windows.Forms;

namespace LouvorJA
{
	public partial class FormCronometro : Form
	{
		private TimeSpan tempo = new TimeSpan();

		public FormCronometro()
		{
			InitializeComponent();
			exibirHorarioAtual();
		}

		#region eventos
		void btnIniciar_Click(object sender, EventArgs e)
		{
			iniciar();
		}
		void btnReiniciar_Click(object sender, EventArgs e)
		{
			reiniciar();
		}
		void txtTempo_TextChanged(object sender, EventArgs e)
		{
			exibirTempoInicial();
		}
		void txtVisibilidade_ValueChanged(object sender, EventArgs e)
		{
			visibilidade();
		}
		void timer_Tick(object sender, EventArgs e)
		{
			exibirHorarioAtual();
			tempo = tempo.Subtract(new TimeSpan(0, 0, 1));
			exibirTempo();
		}
		void FormCronometro_SizeChanged(object sender, EventArgs e)
		{
			lblTempo.Font = new Font(FontFamily.GenericSansSerif, this.Height / 4);
		}
		void txtTempo_KeyDown(object sender, KeyEventArgs e)
		{
			switch (e.KeyCode)
			{
				case Keys.Enter:
					iniciar();
					break;
				case Keys.Escape:
					reiniciar();
					break;
				case Keys.Down:
					if (txtVisibilidade.Value > txtVisibilidade.Minimum)
						txtVisibilidade.Value -= 10;
					break;
				case Keys.Up:
					if (txtVisibilidade.Value < txtVisibilidade.Maximum)
						txtVisibilidade.Value += 10;
					break;
			}
		}
		#endregion

		#region métodos
		void iniciar()
		{
			exibirTempoInicial();
			timer.Start();
		}
		void reiniciar()
		{
			timer.Stop();
			exibirTempoInicial();
		}
		void exibirTempoInicial()
		{
			timer.Stop();
			var minutos = 0m;
			var minutosInteiro = 0;
			var segundos = 0;
			try
			{
				if(!String.IsNullOrEmpty(txtTempo.Text))
					minutos = Convert.ToDecimal(txtTempo.Text);
				minutosInteiro = Convert.ToInt32(minutos);
				segundos = Convert.ToInt32((minutos - minutosInteiro) * 60);
			}
			catch (Exception)
			{
				lblTempo.Text = "";
				return;
			}
			
			tempo = new TimeSpan(0, minutosInteiro, segundos);
			exibirTempo();
		}
		void visibilidade()
		{
			this.Opacity = Convert.ToDouble(txtVisibilidade.Value)/100;
		}
		void exibirHorarioAtual()
		{
			lblHorarioAtual.Text = DateTime.Now.ToString("HH:mm");
		}
		void exibirTempo()
		{
			if (tempo.TotalSeconds < 0)
				lblTempo.ForeColor = Color.Red;
			else
				lblTempo.ForeColor = Color.Black;
			var horas = tempo.Hours;
			var minutos = tempo.Minutes;
			var segundos = tempo.Seconds;

			//Retirar sinal negativo
			if (horas < 0)
				horas = horas * -1;
			if (minutos < 0)
				minutos = minutos * -1;
			if (segundos < 0)
				segundos = segundos * -1;
			lblTempo.Text = horas.ToString("00") + ":" + minutos.ToString("00") + ":" + segundos.ToString("00");
		}
		#endregion
	}
}