namespace LouvorJA
{
    partial class FormConfig
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormConfig));
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.lblQtdFaltando = new System.Windows.Forms.Label();
            this.lblQtdSobrando = new System.Windows.Forms.Label();
            this.lnkSobrando = new System.Windows.Forms.LinkLabel();
            this.nudTamanho = new System.Windows.Forms.NumericUpDown();
            this.lnkFaltando = new System.Windows.Forms.LinkLabel();
            ((System.ComponentModel.ISupportInitialize)(this.nudTamanho)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(9, 9);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(130, 17);
            this.label1.TabIndex = 3;
            this.label1.Text = "Tamanho do ícone:";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(9, 42);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(74, 17);
            this.label2.TabIndex = 3;
            this.label2.Text = "Sobrando:";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(9, 68);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(67, 17);
            this.label3.TabIndex = 3;
            this.label3.Text = "Faltando:";
            // 
            // lblQtdFaltando
            // 
            this.lblQtdFaltando.AutoSize = true;
            this.lblQtdFaltando.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblQtdFaltando.Location = new System.Drawing.Point(79, 68);
            this.lblQtdFaltando.Name = "lblQtdFaltando";
            this.lblQtdFaltando.Size = new System.Drawing.Size(16, 17);
            this.lblQtdFaltando.TabIndex = 3;
            this.lblQtdFaltando.Text = "0";
            // 
            // lblQtdSobrando
            // 
            this.lblQtdSobrando.AutoSize = true;
            this.lblQtdSobrando.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblQtdSobrando.Location = new System.Drawing.Point(79, 42);
            this.lblQtdSobrando.Name = "lblQtdSobrando";
            this.lblQtdSobrando.Size = new System.Drawing.Size(16, 17);
            this.lblQtdSobrando.TabIndex = 3;
            this.lblQtdSobrando.Text = "0";
            // 
            // lnkSobrando
            // 
            this.lnkSobrando.AutoSize = true;
            this.lnkSobrando.Location = new System.Drawing.Point(117, 44);
            this.lnkSobrando.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.lnkSobrando.Name = "lnkSobrando";
            this.lnkSobrando.Size = new System.Drawing.Size(22, 13);
            this.lnkSobrando.TabIndex = 4;
            this.lnkSobrando.TabStop = true;
            this.lnkSobrando.Text = "ver";
            this.lnkSobrando.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.LnkSobrando_LinkClicked);
            // 
            // nudTamanho
            // 
            this.nudTamanho.Increment = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.nudTamanho.Location = new System.Drawing.Point(142, 10);
            this.nudTamanho.Margin = new System.Windows.Forms.Padding(2, 2, 2, 2);
            this.nudTamanho.Maximum = new decimal(new int[] {
            300,
            0,
            0,
            0});
            this.nudTamanho.Minimum = new decimal(new int[] {
            50,
            0,
            0,
            0});
            this.nudTamanho.Name = "nudTamanho";
            this.nudTamanho.Size = new System.Drawing.Size(56, 20);
            this.nudTamanho.TabIndex = 5;
            this.nudTamanho.Value = new decimal(new int[] {
            130,
            0,
            0,
            0});
            this.nudTamanho.ValueChanged += new System.EventHandler(this.NudTamanho_ValueChanged);
            // 
            // lnkFaltando
            // 
            this.lnkFaltando.AutoSize = true;
            this.lnkFaltando.Location = new System.Drawing.Point(117, 69);
            this.lnkFaltando.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.lnkFaltando.Name = "lnkFaltando";
            this.lnkFaltando.Size = new System.Drawing.Size(22, 13);
            this.lnkFaltando.TabIndex = 4;
            this.lnkFaltando.TabStop = true;
            this.lnkFaltando.Text = "ver";
            this.lnkFaltando.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.LnkFaltando_LinkClicked);
            // 
            // FormConfig
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(222, 106);
            this.Controls.Add(this.nudTamanho);
            this.Controls.Add(this.lnkFaltando);
            this.Controls.Add(this.lnkSobrando);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.lblQtdSobrando);
            this.Controls.Add(this.lblQtdFaltando);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "FormConfig";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Configuração";
            this.Load += new System.EventHandler(this.FormConfig_Load);
            ((System.ComponentModel.ISupportInitialize)(this.nudTamanho)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label lblQtdFaltando;
        private System.Windows.Forms.Label lblQtdSobrando;
        private System.Windows.Forms.LinkLabel lnkSobrando;
        private System.Windows.Forms.NumericUpDown nudTamanho;
        private System.Windows.Forms.LinkLabel lnkFaltando;
    }
}