namespace LouvorJA
{
    partial class FormVideo
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormVideo));
            this.ax = new AxWMPLib.AxWindowsMediaPlayer();
            ((System.ComponentModel.ISupportInitialize)(this.ax)).BeginInit();
            this.SuspendLayout();
            // 
            // ax
            // 
            this.ax.Dock = System.Windows.Forms.DockStyle.Fill;
            this.ax.Enabled = true;
            this.ax.Location = new System.Drawing.Point(0, 0);
            this.ax.Name = "ax";
            this.ax.OcxState = ((System.Windows.Forms.AxHost.State)(resources.GetObject("ax.OcxState")));
            this.ax.Size = new System.Drawing.Size(284, 261);
            this.ax.TabIndex = 0;
            this.ax.PlayStateChange += new AxWMPLib._WMPOCXEvents_PlayStateChangeEventHandler(this.ax_PlayStateChange);
            this.ax.KeyDownEvent += new AxWMPLib._WMPOCXEvents_KeyDownEventHandler(this.ax_KeyDownEvent);
            // 
            // FormVideo
            // 
            this.ClientSize = new System.Drawing.Size(284, 261);
            this.Controls.Add(this.ax);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.Name = "FormVideo";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.FormVideo_FormClosing);
            ((System.ComponentModel.ISupportInitialize)(this.ax)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private AxWMPLib.AxWindowsMediaPlayer ax;
    }
}