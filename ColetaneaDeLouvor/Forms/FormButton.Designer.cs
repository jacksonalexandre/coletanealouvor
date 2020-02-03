namespace ColetaneaDeLouvor.Forms
{
    partial class FormButton
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormButton));
            this.panel1 = new System.Windows.Forms.Panel();
            this.pbCapa = new System.Windows.Forms.PictureBox();
            this.pbFechar = new System.Windows.Forms.PictureBox();
            this.pbMinimizar = new System.Windows.Forms.PictureBox();
            ((System.ComponentModel.ISupportInitialize)(this.pbCapa)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbFechar)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbMinimizar)).BeginInit();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.AutoScroll = true;
            this.panel1.AutoScrollMargin = new System.Drawing.Size(5, 5);
            this.panel1.AutoScrollMinSize = new System.Drawing.Size(5, 5);
            this.panel1.BackColor = System.Drawing.Color.Transparent;
            this.panel1.Location = new System.Drawing.Point(687, 70);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(581, 638);
            this.panel1.TabIndex = 0;
            // 
            // pbCapa
            // 
            this.pbCapa.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.pbCapa.BackColor = System.Drawing.Color.Transparent;
            this.pbCapa.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.pbCapa.Location = new System.Drawing.Point(65, 94);
            this.pbCapa.Name = "pbCapa";
            this.pbCapa.Size = new System.Drawing.Size(550, 550);
            this.pbCapa.TabIndex = 1;
            this.pbCapa.TabStop = false;
            // 
            // pbFechar
            // 
            this.pbFechar.BackColor = System.Drawing.Color.Transparent;
            this.pbFechar.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources.fechar;
            this.pbFechar.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.pbFechar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.pbFechar.Location = new System.Drawing.Point(1228, 12);
            this.pbFechar.Name = "pbFechar";
            this.pbFechar.Size = new System.Drawing.Size(40, 40);
            this.pbFechar.TabIndex = 2;
            this.pbFechar.TabStop = false;
            this.pbFechar.Click += new System.EventHandler(this.pbFechar_Click);
            // 
            // pbMinimizar
            // 
            this.pbMinimizar.BackColor = System.Drawing.Color.Transparent;
            this.pbMinimizar.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources.minimizar;
            this.pbMinimizar.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.pbMinimizar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.pbMinimizar.Location = new System.Drawing.Point(1182, 12);
            this.pbMinimizar.Name = "pbMinimizar";
            this.pbMinimizar.Size = new System.Drawing.Size(40, 40);
            this.pbMinimizar.TabIndex = 3;
            this.pbMinimizar.TabStop = false;
            this.pbMinimizar.Click += new System.EventHandler(this.pbMinimizar_Click);
            // 
            // FormButton
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(39)))), ((int)(((byte)(44)))), ((int)(((byte)(51)))));
            this.ClientSize = new System.Drawing.Size(1280, 720);
            this.Controls.Add(this.pbMinimizar);
            this.Controls.Add(this.pbFechar);
            this.Controls.Add(this.pbCapa);
            this.Controls.Add(this.panel1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.KeyPreview = true;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "FormButton";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Load += new System.EventHandler(this.FormButton_Load);
            this.KeyDown += new System.Windows.Forms.KeyEventHandler(this.FormButton_KeyDown);
            ((System.ComponentModel.ISupportInitialize)(this.pbCapa)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbFechar)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbMinimizar)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.PictureBox pbCapa;
        private System.Windows.Forms.PictureBox pbFechar;
        private System.Windows.Forms.PictureBox pbMinimizar;
    }
}