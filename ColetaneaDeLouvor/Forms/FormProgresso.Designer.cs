namespace ColetaneaDeLouvor.Forms
{
    partial class FormProgresso
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormProgresso));
            this.btnCancelar = new System.Windows.Forms.Button();
            this.lblArquivo = new System.Windows.Forms.Label();
            this.barProgresso = new System.Windows.Forms.ProgressBar();
            this.SuspendLayout();
            // 
            // btnCancelar
            // 
            this.btnCancelar.Location = new System.Drawing.Point(475, 56);
            this.btnCancelar.Name = "btnCancelar";
            this.btnCancelar.Size = new System.Drawing.Size(75, 28);
            this.btnCancelar.TabIndex = 5;
            this.btnCancelar.Text = "Cancelar";
            this.btnCancelar.UseVisualStyleBackColor = true;
            this.btnCancelar.Click += new System.EventHandler(this.btnCancelar_Click);
            // 
            // lblArquivo
            // 
            this.lblArquivo.AutoSize = true;
            this.lblArquivo.Location = new System.Drawing.Point(12, 10);
            this.lblArquivo.Name = "lblArquivo";
            this.lblArquivo.Size = new System.Drawing.Size(43, 13);
            this.lblArquivo.TabIndex = 4;
            this.lblArquivo.Text = "Arquivo";
            // 
            // barProgresso
            // 
            this.barProgresso.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right)));
            this.barProgresso.Location = new System.Drawing.Point(12, 26);
            this.barProgresso.Name = "barProgresso";
            this.barProgresso.Size = new System.Drawing.Size(538, 23);
            this.barProgresso.TabIndex = 3;
            // 
            // FormProgresso
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(562, 95);
            this.Controls.Add(this.btnCancelar);
            this.Controls.Add(this.lblArquivo);
            this.Controls.Add(this.barProgresso);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "FormProgresso";
            this.ShowIcon = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Progresso";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnCancelar;
        private System.Windows.Forms.Label lblArquivo;
        private System.Windows.Forms.ProgressBar barProgresso;
    }
}