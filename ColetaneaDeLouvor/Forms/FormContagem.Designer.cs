namespace ColetaneaDeLouvor.Forms
{
    partial class FormContagem
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormContagem));
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.txtTempo = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // timer1
            // 
            this.timer1.Enabled = true;
            this.timer1.Interval = 1000;
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // txtTempo
            // 
            this.txtTempo.BackColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.txtTempo.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txtTempo.Cursor = System.Windows.Forms.Cursors.Arrow;
            this.txtTempo.Font = new System.Drawing.Font("Microsoft Sans Serif", 129.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtTempo.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.txtTempo.HideSelection = false;
            this.txtTempo.Location = new System.Drawing.Point(-2, 12);
            this.txtTempo.Name = "txtTempo";
            this.txtTempo.ReadOnly = true;
            this.txtTempo.Size = new System.Drawing.Size(1012, 196);
            this.txtTempo.TabIndex = 2;
            this.txtTempo.TabStop = false;
            this.txtTempo.Text = "00:00:00";
            this.txtTempo.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.txtTempo.WordWrap = false;
            this.txtTempo.KeyDown += new System.Windows.Forms.KeyEventHandler(this.txtTempo_KeyDown);
            // 
            // FormContagem
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Black;
            this.ClientSize = new System.Drawing.Size(1008, 729);
            this.Controls.Add(this.txtTempo);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MinimizeBox = false;
            this.Name = "FormContagem";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Load += new System.EventHandler(this.FormContagem_Load);
            this.KeyDown += new System.Windows.Forms.KeyEventHandler(this.FormContagem_KeyDown);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Timer timer1;
        private System.Windows.Forms.TextBox txtTempo;
    }
}