namespace ColetaneaDeLouvor.Forms
{
    partial class FormPrincipal
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormPrincipal));
            this.panelEsquerda = new System.Windows.Forms.Panel();
            this.btnSobre = new System.Windows.Forms.Button();
            this.btnHinario = new System.Windows.Forms.Button();
            this.cboTela = new System.Windows.Forms.ComboBox();
            this.btnUtilitarios = new System.Windows.Forms.Button();
            this.btnJa = new System.Windows.Forms.Button();
            this.btnColetanea = new System.Windows.Forms.Button();
            this.btnDoxologia = new System.Windows.Forms.Button();
            this.btnLouvores = new System.Windows.Forms.Button();
            this.btnInfantil = new System.Windows.Forms.Button();
            this.panelCentral = new System.Windows.Forms.Panel();
            this.panelEncontradas = new System.Windows.Forms.Panel();
            this.txtInformacoes = new System.Windows.Forms.TextBox();
            this.txtBusca = new System.Windows.Forms.TextBox();
            this.timerFadeOut = new System.Windows.Forms.Timer(this.components);
            this.panelDireita = new System.Windows.Forms.FlowLayoutPanel();
            this.timerBuscaHino = new System.Windows.Forms.Timer(this.components);
            this.chkLetra = new System.Windows.Forms.CheckBox();
            this.panelEsquerda.SuspendLayout();
            this.panelCentral.SuspendLayout();
            this.SuspendLayout();
            // 
            // panelEsquerda
            // 
            this.panelEsquerda.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
            this.panelEsquerda.AutoScroll = true;
            this.panelEsquerda.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(39)))), ((int)(((byte)(44)))), ((int)(((byte)(51)))));
            this.panelEsquerda.Controls.Add(this.btnSobre);
            this.panelEsquerda.Controls.Add(this.btnHinario);
            this.panelEsquerda.Controls.Add(this.cboTela);
            this.panelEsquerda.Controls.Add(this.btnUtilitarios);
            this.panelEsquerda.Controls.Add(this.btnJa);
            this.panelEsquerda.Controls.Add(this.btnColetanea);
            this.panelEsquerda.Controls.Add(this.btnDoxologia);
            this.panelEsquerda.Controls.Add(this.btnLouvores);
            this.panelEsquerda.Controls.Add(this.btnInfantil);
            this.panelEsquerda.Location = new System.Drawing.Point(0, 0);
            this.panelEsquerda.Name = "panelEsquerda";
            this.panelEsquerda.Size = new System.Drawing.Size(90, 874);
            this.panelEsquerda.TabIndex = 0;
            // 
            // btnSobre
            // 
            this.btnSobre.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.btnSobre.AutoSize = true;
            this.btnSobre.BackColor = System.Drawing.Color.Transparent;
            this.btnSobre.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources._8_Sobre_cinza;
            this.btnSobre.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnSobre.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnSobre.FlatAppearance.BorderSize = 0;
            this.btnSobre.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnSobre.Location = new System.Drawing.Point(5, 740);
            this.btnSobre.Name = "btnSobre";
            this.btnSobre.Size = new System.Drawing.Size(80, 80);
            this.btnSobre.TabIndex = 16;
            this.btnSobre.UseVisualStyleBackColor = false;
            this.btnSobre.Click += new System.EventHandler(this.btnSobre_Click);
            // 
            // btnHinario
            // 
            this.btnHinario.AutoSize = true;
            this.btnHinario.BackColor = System.Drawing.Color.Transparent;
            this.btnHinario.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources._1_Hinario_cinza;
            this.btnHinario.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnHinario.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnHinario.FlatAppearance.BorderSize = 0;
            this.btnHinario.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnHinario.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Bold);
            this.btnHinario.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(63)))), ((int)(((byte)(70)))), ((int)(((byte)(82)))));
            this.btnHinario.Location = new System.Drawing.Point(5, 0);
            this.btnHinario.Name = "btnHinario";
            this.btnHinario.Size = new System.Drawing.Size(80, 80);
            this.btnHinario.TabIndex = 0;
            this.btnHinario.UseVisualStyleBackColor = false;
            this.btnHinario.Click += new System.EventHandler(this.btnHinario_Click);
            // 
            // cboTela
            // 
            this.cboTela.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.cboTela.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(80)))), ((int)(((byte)(80)))), ((int)(((byte)(80)))));
            this.cboTela.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboTela.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.cboTela.Font = new System.Drawing.Font("Microsoft Sans Serif", 6.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.cboTela.ForeColor = System.Drawing.Color.White;
            this.cboTela.FormattingEnabled = true;
            this.cboTela.Location = new System.Drawing.Point(8, 826);
            this.cboTela.Name = "cboTela";
            this.cboTela.Size = new System.Drawing.Size(77, 21);
            this.cboTela.TabIndex = 15;
            // 
            // btnUtilitarios
            // 
            this.btnUtilitarios.AutoSize = true;
            this.btnUtilitarios.BackColor = System.Drawing.Color.Transparent;
            this.btnUtilitarios.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources._7_Utilitarios_cinza;
            this.btnUtilitarios.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnUtilitarios.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnUtilitarios.FlatAppearance.BorderSize = 0;
            this.btnUtilitarios.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnUtilitarios.Location = new System.Drawing.Point(5, 480);
            this.btnUtilitarios.Name = "btnUtilitarios";
            this.btnUtilitarios.Size = new System.Drawing.Size(80, 80);
            this.btnUtilitarios.TabIndex = 6;
            this.btnUtilitarios.UseVisualStyleBackColor = false;
            this.btnUtilitarios.Click += new System.EventHandler(this.btnUtilitarios_Click);
            // 
            // btnJa
            // 
            this.btnJa.AutoSize = true;
            this.btnJa.BackColor = System.Drawing.Color.Transparent;
            this.btnJa.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources._2_LouvoresJA_cinza;
            this.btnJa.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnJa.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnJa.FlatAppearance.BorderSize = 0;
            this.btnJa.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnJa.Location = new System.Drawing.Point(5, 80);
            this.btnJa.Name = "btnJa";
            this.btnJa.Size = new System.Drawing.Size(80, 80);
            this.btnJa.TabIndex = 1;
            this.btnJa.UseVisualStyleBackColor = false;
            this.btnJa.Click += new System.EventHandler(this.btnJa_Click);
            // 
            // btnColetanea
            // 
            this.btnColetanea.AutoSize = true;
            this.btnColetanea.BackColor = System.Drawing.Color.Transparent;
            this.btnColetanea.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources._3_Coletanea_cinza;
            this.btnColetanea.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnColetanea.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnColetanea.FlatAppearance.BorderSize = 0;
            this.btnColetanea.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnColetanea.Location = new System.Drawing.Point(5, 160);
            this.btnColetanea.Name = "btnColetanea";
            this.btnColetanea.Size = new System.Drawing.Size(80, 80);
            this.btnColetanea.TabIndex = 2;
            this.btnColetanea.UseVisualStyleBackColor = false;
            this.btnColetanea.Click += new System.EventHandler(this.btnColetanea_Click);
            // 
            // btnDoxologia
            // 
            this.btnDoxologia.AutoSize = true;
            this.btnDoxologia.BackColor = System.Drawing.Color.Transparent;
            this.btnDoxologia.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources._5_Doxologia_cinza;
            this.btnDoxologia.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnDoxologia.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnDoxologia.FlatAppearance.BorderSize = 0;
            this.btnDoxologia.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnDoxologia.Location = new System.Drawing.Point(5, 320);
            this.btnDoxologia.Name = "btnDoxologia";
            this.btnDoxologia.Size = new System.Drawing.Size(80, 80);
            this.btnDoxologia.TabIndex = 4;
            this.btnDoxologia.UseVisualStyleBackColor = false;
            this.btnDoxologia.Click += new System.EventHandler(this.btnDoxologia_Click);
            // 
            // btnLouvores
            // 
            this.btnLouvores.AutoSize = true;
            this.btnLouvores.BackColor = System.Drawing.Color.Transparent;
            this.btnLouvores.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources._4_Louvores_cinza;
            this.btnLouvores.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnLouvores.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnLouvores.FlatAppearance.BorderSize = 0;
            this.btnLouvores.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnLouvores.Location = new System.Drawing.Point(5, 240);
            this.btnLouvores.Name = "btnLouvores";
            this.btnLouvores.Size = new System.Drawing.Size(80, 80);
            this.btnLouvores.TabIndex = 3;
            this.btnLouvores.UseVisualStyleBackColor = false;
            this.btnLouvores.Click += new System.EventHandler(this.btnLouvores_Click);
            // 
            // btnInfantil
            // 
            this.btnInfantil.AutoSize = true;
            this.btnInfantil.BackColor = System.Drawing.Color.Transparent;
            this.btnInfantil.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources._6_Infantil_cinza;
            this.btnInfantil.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnInfantil.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnInfantil.FlatAppearance.BorderSize = 0;
            this.btnInfantil.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnInfantil.Location = new System.Drawing.Point(5, 400);
            this.btnInfantil.Name = "btnInfantil";
            this.btnInfantil.Size = new System.Drawing.Size(80, 80);
            this.btnInfantil.TabIndex = 5;
            this.btnInfantil.UseVisualStyleBackColor = false;
            this.btnInfantil.Click += new System.EventHandler(this.btnInfantil_Click);
            // 
            // panelCentral
            // 
            this.panelCentral.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.panelCentral.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(63)))), ((int)(((byte)(70)))), ((int)(((byte)(82)))));
            this.panelCentral.Controls.Add(this.chkLetra);
            this.panelCentral.Controls.Add(this.panelEncontradas);
            this.panelCentral.Controls.Add(this.txtInformacoes);
            this.panelCentral.Controls.Add(this.txtBusca);
            this.panelCentral.Location = new System.Drawing.Point(86, -1);
            this.panelCentral.Name = "panelCentral";
            this.panelCentral.Size = new System.Drawing.Size(358, 861);
            this.panelCentral.TabIndex = 3;
            // 
            // panelEncontradas
            // 
            this.panelEncontradas.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
            this.panelEncontradas.AutoScroll = true;
            this.panelEncontradas.BackColor = System.Drawing.Color.Transparent;
            this.panelEncontradas.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources.logo_e_midias;
            this.panelEncontradas.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Center;
            this.panelEncontradas.ForeColor = System.Drawing.SystemColors.Window;
            this.panelEncontradas.Location = new System.Drawing.Point(7, 51);
            this.panelEncontradas.Name = "panelEncontradas";
            this.panelEncontradas.Size = new System.Drawing.Size(351, 653);
            this.panelEncontradas.TabIndex = 6;
            // 
            // txtInformacoes
            // 
            this.txtInformacoes.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.txtInformacoes.BackColor = System.Drawing.Color.White;
            this.txtInformacoes.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtInformacoes.ForeColor = System.Drawing.Color.Black;
            this.txtInformacoes.Location = new System.Drawing.Point(7, 710);
            this.txtInformacoes.Multiline = true;
            this.txtInformacoes.Name = "txtInformacoes";
            this.txtInformacoes.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtInformacoes.Size = new System.Drawing.Size(351, 138);
            this.txtInformacoes.TabIndex = 10;
            this.txtInformacoes.Text = "Anotações:";
            this.txtInformacoes.MouseClick += new System.Windows.Forms.MouseEventHandler(this.txtInformacoes_MouseClick);
            this.txtInformacoes.Leave += new System.EventHandler(this.txtInformacoes_Leave);
            // 
            // txtBusca
            // 
            this.txtBusca.Font = new System.Drawing.Font("Calibri", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtBusca.Location = new System.Drawing.Point(7, 6);
            this.txtBusca.Name = "txtBusca";
            this.txtBusca.Size = new System.Drawing.Size(348, 26);
            this.txtBusca.TabIndex = 8;
            this.txtBusca.TextChanged += new System.EventHandler(this.txtBusca_TextChanged);
            this.txtBusca.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.txtBusca_KeyPress);
            // 
            // panelDireita
            // 
            this.panelDireita.AllowDrop = true;
            this.panelDireita.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.panelDireita.AutoScroll = true;
            this.panelDireita.BackColor = System.Drawing.Color.White;
            this.panelDireita.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Center;
            this.panelDireita.Location = new System.Drawing.Point(450, -1);
            this.panelDireita.Name = "panelDireita";
            this.panelDireita.Size = new System.Drawing.Size(734, 858);
            this.panelDireita.TabIndex = 7;
            // 
            // chkLetra
            // 
            this.chkLetra.AutoSize = true;
            this.chkLetra.ForeColor = System.Drawing.Color.White;
            this.chkLetra.Location = new System.Drawing.Point(10, 32);
            this.chkLetra.Name = "chkLetra";
            this.chkLetra.Size = new System.Drawing.Size(191, 21);
            this.chkLetra.TabIndex = 0;
            this.chkLetra.Text = "Buscar na letra dos hinos";
            this.chkLetra.UseVisualStyleBackColor = true;
            this.chkLetra.CheckedChanged += new System.EventHandler(this.chkLetra_CheckedChanged);
            // 
            // FormPrincipal
            // 
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Inherit;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(1182, 853);
            this.Controls.Add(this.panelDireita);
            this.Controls.Add(this.panelEsquerda);
            this.Controls.Add(this.panelCentral);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MinimumSize = new System.Drawing.Size(800, 600);
            this.Name = "FormPrincipal";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Coletânea de Louvor";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.FormPrincipal_FormClosing);
            this.Load += new System.EventHandler(this.FormPrincipal_Load);
            this.panelEsquerda.ResumeLayout(false);
            this.panelEsquerda.PerformLayout();
            this.panelCentral.ResumeLayout(false);
            this.panelCentral.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panelEsquerda;
        private System.Windows.Forms.Button btnJa;
        private System.Windows.Forms.Button btnHinario;
        private System.Windows.Forms.Button btnLouvores;
        private System.Windows.Forms.Panel panelCentral;
        private System.Windows.Forms.Panel panelEncontradas;
        private System.Windows.Forms.TextBox txtBusca;
        private System.Windows.Forms.FlowLayoutPanel panelDireita;
        private System.Windows.Forms.Button btnColetanea;
        private System.Windows.Forms.Button btnUtilitarios;
        private System.Windows.Forms.Button btnInfantil;
        private System.Windows.Forms.Button btnDoxologia;
        private System.Windows.Forms.TextBox txtInformacoes;
        private System.Windows.Forms.ComboBox cboTela;
        private System.Windows.Forms.Timer timerFadeOut;
        private System.Windows.Forms.Button btnSobre;
        private System.Windows.Forms.Timer timerBuscaHino;
        private System.Windows.Forms.CheckBox chkLetra;
    }
}