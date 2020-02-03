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
            this.label2 = new System.Windows.Forms.Label();
            this.btnSobre = new System.Windows.Forms.Button();
            this.btnHinario = new System.Windows.Forms.Button();
            this.comboScreen = new System.Windows.Forms.ComboBox();
            this.btnUtilitarios = new System.Windows.Forms.Button();
            this.btnJa = new System.Windows.Forms.Button();
            this.btnColetanea = new System.Windows.Forms.Button();
            this.btnDoxologia = new System.Windows.Forms.Button();
            this.btnLouvores = new System.Windows.Forms.Button();
            this.btnInfantil = new System.Windows.Forms.Button();
            this.panelCentral = new System.Windows.Forms.Panel();
            this.panelEncontradas = new System.Windows.Forms.Panel();
            this.txtInformacoes = new System.Windows.Forms.TextBox();
            this.btnBusca = new System.Windows.Forms.Button();
            this.txtBusca = new System.Windows.Forms.TextBox();
            this.timerFadeOut = new System.Windows.Forms.Timer(this.components);
            this.panelDireita = new System.Windows.Forms.FlowLayoutPanel();
            this.timerBuscaHino = new System.Windows.Forms.Timer(this.components);
            this.panelSuperior = new ColetaneaDeLouvor.DAO.GradientPanel();
            this.panel1 = new System.Windows.Forms.Panel();
            this.pbMinimizar = new System.Windows.Forms.PictureBox();
            this.pbMaximizar = new System.Windows.Forms.PictureBox();
            this.pbFechar = new System.Windows.Forms.PictureBox();
            this.pictureBox3 = new System.Windows.Forms.PictureBox();
            this.panelEsquerda.SuspendLayout();
            this.panelCentral.SuspendLayout();
            this.panelSuperior.SuspendLayout();
            this.panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pbMinimizar)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbMaximizar)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbFechar)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox3)).BeginInit();
            this.SuspendLayout();
            // 
            // panelEsquerda
            // 
            this.panelEsquerda.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
            this.panelEsquerda.AutoScroll = true;
            this.panelEsquerda.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(39)))), ((int)(((byte)(44)))), ((int)(((byte)(51)))));
            this.panelEsquerda.Controls.Add(this.label2);
            this.panelEsquerda.Controls.Add(this.btnSobre);
            this.panelEsquerda.Controls.Add(this.btnHinario);
            this.panelEsquerda.Controls.Add(this.comboScreen);
            this.panelEsquerda.Controls.Add(this.btnUtilitarios);
            this.panelEsquerda.Controls.Add(this.btnJa);
            this.panelEsquerda.Controls.Add(this.btnColetanea);
            this.panelEsquerda.Controls.Add(this.btnDoxologia);
            this.panelEsquerda.Controls.Add(this.btnLouvores);
            this.panelEsquerda.Controls.Add(this.btnInfantil);
            this.panelEsquerda.Location = new System.Drawing.Point(0, 86);
            this.panelEsquerda.Name = "panelEsquerda";
            this.panelEsquerda.Size = new System.Drawing.Size(87, 650);
            this.panelEsquerda.TabIndex = 0;
            // 
            // label2
            // 
            this.label2.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.label2.AutoSize = true;
            this.label2.Cursor = System.Windows.Forms.Cursors.Hand;
            this.label2.Font = new System.Drawing.Font("Calibri", 8.25F, ((System.Drawing.FontStyle)((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Italic))), System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.ForeColor = System.Drawing.SystemColors.ButtonFace;
            this.label2.Location = new System.Drawing.Point(5, 587);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(76, 26);
            this.label2.TabIndex = 17;
            this.label2.Text = "Selecione a\r\ntela extendida:";
            this.label2.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // btnSobre
            // 
            this.btnSobre.AutoSize = true;
            this.btnSobre.BackColor = System.Drawing.Color.Transparent;
            this.btnSobre.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources._8_Sobre_cinza;
            this.btnSobre.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnSobre.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnSobre.FlatAppearance.BorderSize = 0;
            this.btnSobre.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnSobre.Location = new System.Drawing.Point(0, 506);
            this.btnSobre.Name = "btnSobre";
            this.btnSobre.Size = new System.Drawing.Size(87, 65);
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
            this.btnHinario.Location = new System.Drawing.Point(0, 9);
            this.btnHinario.Name = "btnHinario";
            this.btnHinario.Size = new System.Drawing.Size(87, 65);
            this.btnHinario.TabIndex = 0;
            this.btnHinario.UseVisualStyleBackColor = false;
            this.btnHinario.Click += new System.EventHandler(this.btnHinario_Click);
            // 
            // comboScreen
            // 
            this.comboScreen.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.comboScreen.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(80)))), ((int)(((byte)(80)))), ((int)(((byte)(80)))));
            this.comboScreen.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.comboScreen.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.comboScreen.Font = new System.Drawing.Font("Microsoft Sans Serif", 6.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.comboScreen.ForeColor = System.Drawing.Color.White;
            this.comboScreen.FormattingEnabled = true;
            this.comboScreen.Location = new System.Drawing.Point(0, 616);
            this.comboScreen.Name = "comboScreen";
            this.comboScreen.Size = new System.Drawing.Size(87, 20);
            this.comboScreen.TabIndex = 15;
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
            this.btnUtilitarios.Location = new System.Drawing.Point(0, 435);
            this.btnUtilitarios.Name = "btnUtilitarios";
            this.btnUtilitarios.Size = new System.Drawing.Size(87, 65);
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
            this.btnJa.Location = new System.Drawing.Point(0, 80);
            this.btnJa.Name = "btnJa";
            this.btnJa.Size = new System.Drawing.Size(87, 65);
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
            this.btnColetanea.Location = new System.Drawing.Point(0, 151);
            this.btnColetanea.Name = "btnColetanea";
            this.btnColetanea.Size = new System.Drawing.Size(87, 65);
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
            this.btnDoxologia.Location = new System.Drawing.Point(0, 293);
            this.btnDoxologia.Name = "btnDoxologia";
            this.btnDoxologia.Size = new System.Drawing.Size(87, 65);
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
            this.btnLouvores.Location = new System.Drawing.Point(0, 222);
            this.btnLouvores.Name = "btnLouvores";
            this.btnLouvores.Size = new System.Drawing.Size(87, 65);
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
            this.btnInfantil.Location = new System.Drawing.Point(0, 364);
            this.btnInfantil.Name = "btnInfantil";
            this.btnInfantil.Size = new System.Drawing.Size(87, 65);
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
            this.panelCentral.Controls.Add(this.panelEncontradas);
            this.panelCentral.Controls.Add(this.txtInformacoes);
            this.panelCentral.Controls.Add(this.btnBusca);
            this.panelCentral.Controls.Add(this.txtBusca);
            this.panelCentral.Location = new System.Drawing.Point(86, 86);
            this.panelCentral.Name = "panelCentral";
            this.panelCentral.Size = new System.Drawing.Size(366, 650);
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
            this.panelEncontradas.Location = new System.Drawing.Point(7, 34);
            this.panelEncontradas.Name = "panelEncontradas";
            this.panelEncontradas.Size = new System.Drawing.Size(351, 395);
            this.panelEncontradas.TabIndex = 6;
            // 
            // txtInformacoes
            // 
            this.txtInformacoes.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.txtInformacoes.BackColor = System.Drawing.Color.White;
            this.txtInformacoes.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtInformacoes.ForeColor = System.Drawing.Color.Black;
            this.txtInformacoes.Location = new System.Drawing.Point(7, 441);
            this.txtInformacoes.Multiline = true;
            this.txtInformacoes.Name = "txtInformacoes";
            this.txtInformacoes.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtInformacoes.Size = new System.Drawing.Size(351, 196);
            this.txtInformacoes.TabIndex = 10;
            this.txtInformacoes.Text = "Anotações:";
            this.txtInformacoes.MouseClick += new System.Windows.Forms.MouseEventHandler(this.txtInformacoes_MouseClick);
            this.txtInformacoes.Leave += new System.EventHandler(this.txtInformacoes_Leave);
            // 
            // btnBusca
            // 
            this.btnBusca.BackColor = System.Drawing.SystemColors.Window;
            this.btnBusca.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources._10_LUPA;
            this.btnBusca.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.btnBusca.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnBusca.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnBusca.ForeColor = System.Drawing.SystemColors.Window;
            this.btnBusca.Location = new System.Drawing.Point(331, 8);
            this.btnBusca.Name = "btnBusca";
            this.btnBusca.Size = new System.Drawing.Size(18, 18);
            this.btnBusca.TabIndex = 9;
            this.btnBusca.UseVisualStyleBackColor = false;
            this.btnBusca.Click += new System.EventHandler(this.btnBusca_Click);
            // 
            // txtBusca
            // 
            this.txtBusca.Font = new System.Drawing.Font("Calibri", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtBusca.ForeColor = System.Drawing.Color.Silver;
            this.txtBusca.Location = new System.Drawing.Point(7, 6);
            this.txtBusca.Name = "txtBusca";
            this.txtBusca.Size = new System.Drawing.Size(351, 22);
            this.txtBusca.TabIndex = 8;
            this.txtBusca.Text = "Busque o Hino...";
            this.txtBusca.MouseClick += new System.Windows.Forms.MouseEventHandler(this.txtBusca_MouseClick);
            this.txtBusca.TextChanged += new System.EventHandler(this.txtBusca_TextChanged);
            this.txtBusca.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.txtBusca_KeyPress);
            this.txtBusca.Leave += new System.EventHandler(this.txtBusca_Leave);
            // 
            // timerFadeOut
            // 
            this.timerFadeOut.Tick += new System.EventHandler(this.timerFadeOut_Tick);
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
            this.panelDireita.Location = new System.Drawing.Point(450, 86);
            this.panelDireita.Name = "panelDireita";
            this.panelDireita.Size = new System.Drawing.Size(816, 647);
            this.panelDireita.TabIndex = 7;
            // 
            // timerBuscaHino
            // 
            this.timerBuscaHino.Tick += new System.EventHandler(this.timerBuscaHino_Tick);
            // 
            // panelSuperior
            // 
            this.panelSuperior.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.panelSuperior.Angle = 45F;
            this.panelSuperior.BackColor = System.Drawing.Color.Transparent;
            this.panelSuperior.ColorBottom = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(105)))), ((int)(((byte)(191)))));
            this.panelSuperior.ColorTop = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(196)))), ((int)(((byte)(204)))));
            this.panelSuperior.Controls.Add(this.panel1);
            this.panelSuperior.Controls.Add(this.pictureBox3);
            this.panelSuperior.Location = new System.Drawing.Point(0, 0);
            this.panelSuperior.Name = "panelSuperior";
            this.panelSuperior.Size = new System.Drawing.Size(1266, 86);
            this.panelSuperior.TabIndex = 8;
            // 
            // panel1
            // 
            this.panel1.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.panel1.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(84)))), ((int)(((byte)(153)))));
            this.panel1.Controls.Add(this.pbMinimizar);
            this.panel1.Controls.Add(this.pbMaximizar);
            this.panel1.Controls.Add(this.pbFechar);
            this.panel1.Location = new System.Drawing.Point(1172, 1);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(96, 30);
            this.panel1.TabIndex = 14;
            this.panel1.Visible = false;
            // 
            // pbMinimizar
            // 
            this.pbMinimizar.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources.minimizar;
            this.pbMinimizar.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.pbMinimizar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.pbMinimizar.Location = new System.Drawing.Point(3, 3);
            this.pbMinimizar.Name = "pbMinimizar";
            this.pbMinimizar.Size = new System.Drawing.Size(25, 25);
            this.pbMinimizar.TabIndex = 2;
            this.pbMinimizar.TabStop = false;
            this.pbMinimizar.Click += new System.EventHandler(this.pbMinimizar_Click);
            // 
            // pbMaximizar
            // 
            this.pbMaximizar.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources.Maximize;
            this.pbMaximizar.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.pbMaximizar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.pbMaximizar.Location = new System.Drawing.Point(34, 3);
            this.pbMaximizar.Name = "pbMaximizar";
            this.pbMaximizar.Size = new System.Drawing.Size(25, 25);
            this.pbMaximizar.TabIndex = 1;
            this.pbMaximizar.TabStop = false;
            this.pbMaximizar.Click += new System.EventHandler(this.pbMaximizar_Click);
            // 
            // pbFechar
            // 
            this.pbFechar.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources.fechar;
            this.pbFechar.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.pbFechar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.pbFechar.Location = new System.Drawing.Point(65, 3);
            this.pbFechar.Name = "pbFechar";
            this.pbFechar.Size = new System.Drawing.Size(25, 25);
            this.pbFechar.TabIndex = 0;
            this.pbFechar.TabStop = false;
            this.pbFechar.Click += new System.EventHandler(this.pbFechar_Click);
            // 
            // pictureBox3
            // 
            this.pictureBox3.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.pictureBox3.BackColor = System.Drawing.Color.Transparent;
            this.pictureBox3.BackgroundImage = global::ColetaneaDeLouvor.Properties.Resources._9_LEGENDA_SUPERIOR;
            this.pictureBox3.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.pictureBox3.Location = new System.Drawing.Point(461, 13);
            this.pictureBox3.Name = "pictureBox3";
            this.pictureBox3.Size = new System.Drawing.Size(344, 60);
            this.pictureBox3.TabIndex = 13;
            this.pictureBox3.TabStop = false;
            // 
            // FormPrincipal
            // 
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Inherit;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(1264, 729);
            this.Controls.Add(this.panelSuperior);
            this.Controls.Add(this.panelDireita);
            this.Controls.Add(this.panelEsquerda);
            this.Controls.Add(this.panelCentral);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
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
            this.panelSuperior.ResumeLayout(false);
            this.panel1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.pbMinimizar)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbMaximizar)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbFechar)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox3)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panelEsquerda;
        private System.Windows.Forms.Button btnJa;
        private System.Windows.Forms.Button btnHinario;
        private System.Windows.Forms.Button btnLouvores;
        private System.Windows.Forms.Panel panelCentral;
        private System.Windows.Forms.Panel panelEncontradas;
        private System.Windows.Forms.Button btnBusca;
        private System.Windows.Forms.TextBox txtBusca;
        private System.Windows.Forms.FlowLayoutPanel panelDireita;
        private System.Windows.Forms.Button btnColetanea;
        private System.Windows.Forms.Button btnUtilitarios;
        private System.Windows.Forms.Button btnInfantil;
        private System.Windows.Forms.Button btnDoxologia;
        private System.Windows.Forms.TextBox txtInformacoes;
        private System.Windows.Forms.ComboBox comboScreen;
        private System.Windows.Forms.Timer timerFadeOut;
        private DAO.GradientPanel panelSuperior;
        private System.Windows.Forms.Button btnSobre;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.PictureBox pictureBox3;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.PictureBox pbFechar;
        private System.Windows.Forms.PictureBox pbMinimizar;
        private System.Windows.Forms.PictureBox pbMaximizar;
        private System.Windows.Forms.Timer timerBuscaHino;
    }
}