namespace ColetaneaDeLouvor.Forms
{
    partial class FormCronometro
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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormCronometro));
            this.lblTempo = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.txtVisibilidade = new System.Windows.Forms.NumericUpDown();
            this.txtTempo = new System.Windows.Forms.TextBox();
            this.btnReiniciar = new System.Windows.Forms.Button();
            this.btnIniciar = new System.Windows.Forms.Button();
            this.timer = new System.Windows.Forms.Timer(this.components);
            this.lblHorarioAtual = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.toolTip1 = new System.Windows.Forms.ToolTip(this.components);
            ((System.ComponentModel.ISupportInitialize)(this.txtVisibilidade)).BeginInit();
            this.SuspendLayout();
            // 
            // lblTempo
            // 
            this.lblTempo.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lblTempo.Font = new System.Drawing.Font("Microsoft Sans Serif", 70F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblTempo.Location = new System.Drawing.Point(13, 54);
            this.lblTempo.Name = "lblTempo";
            this.lblTempo.Size = new System.Drawing.Size(589, 120);
            this.lblTempo.TabIndex = 14;
            this.lblTempo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(235, 11);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(83, 17);
            this.label2.TabIndex = 10;
            this.label2.Text = "Visibilidade:";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(10, 11);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(132, 17);
            this.label1.TabIndex = 8;
            this.label1.Text = "Tempo em minutos:";
            // 
            // txtVisibilidade
            // 
            this.txtVisibilidade.Increment = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.txtVisibilidade.Location = new System.Drawing.Point(324, 11);
            this.txtVisibilidade.Minimum = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.txtVisibilidade.Name = "txtVisibilidade";
            this.txtVisibilidade.Size = new System.Drawing.Size(57, 20);
            this.txtVisibilidade.TabIndex = 11;
            this.toolTip1.SetToolTip(this.txtVisibilidade, "Visibilidade do Cronômetro (Atalho: Seta Cima/Baixo)");
            this.txtVisibilidade.Value = new decimal(new int[] {
            100,
            0,
            0,
            0});
            this.txtVisibilidade.ValueChanged += new System.EventHandler(this.txtVisibilidade_ValueChanged);
            // 
            // txtTempo
            // 
            this.txtTempo.Location = new System.Drawing.Point(148, 11);
            this.txtTempo.Name = "txtTempo";
            this.txtTempo.Size = new System.Drawing.Size(57, 20);
            this.txtTempo.TabIndex = 6;
            this.txtTempo.TextChanged += new System.EventHandler(this.txtTempo_TextChanged);
            this.txtTempo.KeyDown += new System.Windows.Forms.KeyEventHandler(this.txtTempo_KeyDown);
            // 
            // btnReiniciar
            // 
            this.btnReiniciar.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.btnReiniciar.Location = new System.Drawing.Point(527, 199);
            this.btnReiniciar.Name = "btnReiniciar";
            this.btnReiniciar.Size = new System.Drawing.Size(75, 23);
            this.btnReiniciar.TabIndex = 9;
            this.btnReiniciar.Text = "Reiniciar";
            this.toolTip1.SetToolTip(this.btnReiniciar, "Reiniciar o cronômetro (Atalho: ESC)");
            this.btnReiniciar.UseVisualStyleBackColor = true;
            this.btnReiniciar.Click += new System.EventHandler(this.btnReiniciar_Click);
            // 
            // btnIniciar
            // 
            this.btnIniciar.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.btnIniciar.Location = new System.Drawing.Point(446, 199);
            this.btnIniciar.Name = "btnIniciar";
            this.btnIniciar.Size = new System.Drawing.Size(75, 23);
            this.btnIniciar.TabIndex = 7;
            this.btnIniciar.Text = "Iniciar";
            this.toolTip1.SetToolTip(this.btnIniciar, "Iniciar o cronômetro (Atalho: Enter)");
            this.btnIniciar.UseVisualStyleBackColor = true;
            this.btnIniciar.Click += new System.EventHandler(this.btnIniciar_Click);
            // 
            // timer
            // 
            this.timer.Interval = 1000;
            this.timer.Tick += new System.EventHandler(this.timer_Tick);
            // 
            // lblHorarioAtual
            // 
            this.lblHorarioAtual.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.lblHorarioAtual.AutoSize = true;
            this.lblHorarioAtual.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblHorarioAtual.Location = new System.Drawing.Point(544, 11);
            this.lblHorarioAtual.Name = "lblHorarioAtual";
            this.lblHorarioAtual.Size = new System.Drawing.Size(59, 17);
            this.lblHorarioAtual.TabIndex = 12;
            this.lblHorarioAtual.Text = "HH:MM";
            // 
            // label3
            // 
            this.label3.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(443, 11);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(95, 17);
            this.label3.TabIndex = 13;
            this.label3.Text = "Horário Atual:";
            // 
            // FormCronometro
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(613, 232);
            this.Controls.Add(this.lblTempo);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.txtVisibilidade);
            this.Controls.Add(this.txtTempo);
            this.Controls.Add(this.btnReiniciar);
            this.Controls.Add(this.btnIniciar);
            this.Controls.Add(this.lblHorarioAtual);
            this.Controls.Add(this.label3);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MinimumSize = new System.Drawing.Size(580, 250);
            this.Name = "FormCronometro";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Cronômetro";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.SizeChanged += new System.EventHandler(this.FormCronometro_SizeChanged);
            ((System.ComponentModel.ISupportInitialize)(this.txtVisibilidade)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lblTempo;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.NumericUpDown txtVisibilidade;
        private System.Windows.Forms.ToolTip toolTip1;
        private System.Windows.Forms.TextBox txtTempo;
        private System.Windows.Forms.Button btnReiniciar;
        private System.Windows.Forms.Button btnIniciar;
        private System.Windows.Forms.Timer timer;
        private System.Windows.Forms.Label lblHorarioAtual;
        private System.Windows.Forms.Label label3;
    }
}