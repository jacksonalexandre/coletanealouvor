namespace LouvorJA
{
	partial class FormSorteio
	{
		/// <summary>
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows Form Designer generated code

		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormSorteio));
            this.txtNumeroFinal = new System.Windows.Forms.TextBox();
            this.lstSorteados = new System.Windows.Forms.ListBox();
            this.lblSorteados = new System.Windows.Forms.Label();
            this.lblTitulo = new System.Windows.Forms.Label();
            this.btnSortear = new System.Windows.Forms.Button();
            this.btnReiniciar = new System.Windows.Forms.Button();
            this.lblSorteado = new System.Windows.Forms.Label();
            this.txtNumeroInicial = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // txtNumeroFinal
            // 
            this.txtNumeroFinal.Font = new System.Drawing.Font("Microsoft Sans Serif", 30F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtNumeroFinal.Location = new System.Drawing.Point(138, 29);
            this.txtNumeroFinal.Name = "txtNumeroFinal";
            this.txtNumeroFinal.Size = new System.Drawing.Size(126, 53);
            this.txtNumeroFinal.TabIndex = 0;
            this.txtNumeroFinal.KeyDown += new System.Windows.Forms.KeyEventHandler(this.txt_KeyDown);
            // 
            // lstSorteados
            // 
            this.lstSorteados.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lstSorteados.FormattingEnabled = true;
            this.lstSorteados.Location = new System.Drawing.Point(462, 38);
            this.lstSorteados.Name = "lstSorteados";
            this.lstSorteados.Size = new System.Drawing.Size(60, 316);
            this.lstSorteados.TabIndex = 1;
            this.lstSorteados.TabStop = false;
            // 
            // lblSorteados
            // 
            this.lblSorteados.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.lblSorteados.AutoSize = true;
            this.lblSorteados.Location = new System.Drawing.Point(462, 13);
            this.lblSorteados.Name = "lblSorteados";
            this.lblSorteados.Size = new System.Drawing.Size(55, 13);
            this.lblSorteados.TabIndex = 2;
            this.lblSorteados.Text = "Sorteados";
            // 
            // lblTitulo
            // 
            this.lblTitulo.AutoSize = true;
            this.lblTitulo.Location = new System.Drawing.Point(138, 13);
            this.lblTitulo.Name = "lblTitulo";
            this.lblTitulo.Size = new System.Drawing.Size(72, 13);
            this.lblTitulo.TabIndex = 3;
            this.lblTitulo.Text = "Número Final:";
            // 
            // btnSortear
            // 
            this.btnSortear.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.btnSortear.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnSortear.Location = new System.Drawing.Point(12, 321);
            this.btnSortear.Name = "btnSortear";
            this.btnSortear.Size = new System.Drawing.Size(123, 43);
            this.btnSortear.TabIndex = 1;
            this.btnSortear.Text = "Sortear";
            this.btnSortear.UseVisualStyleBackColor = true;
            this.btnSortear.Click += new System.EventHandler(this.btnSortear_Click);
            this.btnSortear.KeyDown += new System.Windows.Forms.KeyEventHandler(this.txt_KeyDown);
            // 
            // btnReiniciar
            // 
            this.btnReiniciar.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.btnReiniciar.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnReiniciar.Location = new System.Drawing.Point(141, 321);
            this.btnReiniciar.Name = "btnReiniciar";
            this.btnReiniciar.Size = new System.Drawing.Size(123, 43);
            this.btnReiniciar.TabIndex = 2;
            this.btnReiniciar.Text = "Reiniciar";
            this.btnReiniciar.UseVisualStyleBackColor = true;
            this.btnReiniciar.Click += new System.EventHandler(this.btnReiniciar_Click);
            // 
            // lblSorteado
            // 
            this.lblSorteado.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lblSorteado.Font = new System.Drawing.Font("Microsoft Sans Serif", 135F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSorteado.Location = new System.Drawing.Point(12, 81);
            this.lblSorteado.Name = "lblSorteado";
            this.lblSorteado.Size = new System.Drawing.Size(434, 220);
            this.lblSorteado.TabIndex = 5;
            this.lblSorteado.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // txtNumeroInicial
            // 
            this.txtNumeroInicial.Font = new System.Drawing.Font("Microsoft Sans Serif", 30F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtNumeroInicial.Location = new System.Drawing.Point(9, 29);
            this.txtNumeroInicial.Name = "txtNumeroInicial";
            this.txtNumeroInicial.Size = new System.Drawing.Size(126, 53);
            this.txtNumeroInicial.TabIndex = 0;
            this.txtNumeroInicial.Text = "1";
            this.txtNumeroInicial.KeyDown += new System.Windows.Forms.KeyEventHandler(this.txt_KeyDown);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(9, 13);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(77, 13);
            this.label1.TabIndex = 3;
            this.label1.Text = "Número Inicial:";
            // 
            // FormSorteio
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(534, 376);
            this.Controls.Add(this.lblSorteado);
            this.Controls.Add(this.btnReiniciar);
            this.Controls.Add(this.btnSortear);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.lblTitulo);
            this.Controls.Add(this.lblSorteados);
            this.Controls.Add(this.txtNumeroInicial);
            this.Controls.Add(this.lstSorteados);
            this.Controls.Add(this.txtNumeroFinal);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MinimumSize = new System.Drawing.Size(400, 400);
            this.Name = "FormSorteio";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Sorteio";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.FormSorteio_FormClosed);
            this.Load += new System.EventHandler(this.FormSorteio_Load);
            this.SizeChanged += new System.EventHandler(this.FormSorteio_SizeChanged);
            this.ResumeLayout(false);
            this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.TextBox txtNumeroFinal;
		private System.Windows.Forms.ListBox lstSorteados;
		private System.Windows.Forms.Label lblSorteados;
		private System.Windows.Forms.Label lblTitulo;
		private System.Windows.Forms.Button btnSortear;
		private System.Windows.Forms.Button btnReiniciar;
		private System.Windows.Forms.Label lblSorteado;
		private System.Windows.Forms.TextBox txtNumeroInicial;
		private System.Windows.Forms.Label label1;
	}
}