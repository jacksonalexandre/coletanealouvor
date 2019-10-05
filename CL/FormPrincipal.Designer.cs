namespace LouvorJA
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
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormPrincipal));
            this.pnl1 = new System.Windows.Forms.Panel();
            this.lnkConfig = new System.Windows.Forms.LinkLabel();
            this.lnkSite = new System.Windows.Forms.LinkLabel();
            this.lnkFacebook = new System.Windows.Forms.LinkLabel();
            this.pictureBox2 = new System.Windows.Forms.PictureBox();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.imgFacebook = new System.Windows.Forms.PictureBox();
            this.lblInfantil = new System.Windows.Forms.Label();
            this.lblLouvor = new System.Windows.Forms.Label();
            this.lblColetaneas = new System.Windows.Forms.Label();
            this.lblDoxologia = new System.Windows.Forms.Label();
            this.lblJovens = new System.Windows.Forms.Label();
            this.lblPrincipal = new System.Windows.Forms.Label();
            this.pnlMarcador = new System.Windows.Forms.Panel();
            this.pnl2 = new System.Windows.Forms.FlowLayoutPanel();
            this.grd = new System.Windows.Forms.DataGridView();
            this.Favorito = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.Titulo = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Album = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ID = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Caminho = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.btnAbrirHASD = new System.Windows.Forms.Button();
            this.txtBusca = new System.Windows.Forms.TextBox();
            this.pnlBusca = new System.Windows.Forms.Panel();
            this.cboFiltro = new System.Windows.Forms.ComboBox();
            this.mnu = new System.Windows.Forms.MenuStrip();
            this.mnuPrincipal = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuDoxologia = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuJovens = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuColetaneas = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuLouvor = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuInfantil = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripContainer1 = new System.Windows.Forms.ToolStripContainer();
            this.pnl1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox2)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.imgFacebook)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.grd)).BeginInit();
            this.pnlBusca.SuspendLayout();
            this.mnu.SuspendLayout();
            this.toolStripContainer1.TopToolStripPanel.SuspendLayout();
            this.toolStripContainer1.SuspendLayout();
            this.SuspendLayout();
            // 
            // pnl1
            // 
            this.pnl1.BackColor = System.Drawing.Color.Transparent;
            this.pnl1.Controls.Add(this.toolStripContainer1);
            this.pnl1.Controls.Add(this.lnkConfig);
            this.pnl1.Controls.Add(this.lnkSite);
            this.pnl1.Controls.Add(this.lnkFacebook);
            this.pnl1.Controls.Add(this.pictureBox2);
            this.pnl1.Controls.Add(this.pictureBox1);
            this.pnl1.Controls.Add(this.imgFacebook);
            this.pnl1.Controls.Add(this.lblInfantil);
            this.pnl1.Controls.Add(this.lblLouvor);
            this.pnl1.Controls.Add(this.lblColetaneas);
            this.pnl1.Controls.Add(this.lblDoxologia);
            this.pnl1.Controls.Add(this.lblJovens);
            this.pnl1.Controls.Add(this.lblPrincipal);
            this.pnl1.Controls.Add(this.pnlMarcador);
            this.pnl1.Dock = System.Windows.Forms.DockStyle.Left;
            this.pnl1.Location = new System.Drawing.Point(0, 0);
            this.pnl1.MaximumSize = new System.Drawing.Size(233, 900);
            this.pnl1.MinimumSize = new System.Drawing.Size(233, 320);
            this.pnl1.Name = "pnl1";
            this.pnl1.Size = new System.Drawing.Size(233, 561);
            this.pnl1.TabIndex = 0;
            // 
            // lnkConfig
            // 
            this.lnkConfig.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.lnkConfig.AutoSize = true;
            this.lnkConfig.Location = new System.Drawing.Point(63, 450);
            this.lnkConfig.Name = "lnkConfig";
            this.lnkConfig.Size = new System.Drawing.Size(83, 13);
            this.lnkConfig.TabIndex = 5;
            this.lnkConfig.TabStop = true;
            this.lnkConfig.Text = "Configuração";
            this.lnkConfig.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.lnkSite_LinkClicked);
            this.lnkConfig.Click += new System.EventHandler(this.lnkConfig_Click);
            // 
            // lnkSite
            // 
            this.lnkSite.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.lnkSite.AutoSize = true;
            this.lnkSite.Location = new System.Drawing.Point(62, 486);
            this.lnkSite.Name = "lnkSite";
            this.lnkSite.Size = new System.Drawing.Size(140, 13);
            this.lnkSite.TabIndex = 5;
            this.lnkSite.TabStop = true;
            this.lnkSite.Text = "coletanealouvor.com.br";
            this.lnkSite.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.lnkSite_LinkClicked);
            this.lnkSite.Click += new System.EventHandler(this.lnkFacebook_Click);
            // 
            // lnkFacebook
            // 
            this.lnkFacebook.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.lnkFacebook.AutoSize = true;
            this.lnkFacebook.Location = new System.Drawing.Point(61, 524);
            this.lnkFacebook.Name = "lnkFacebook";
            this.lnkFacebook.Size = new System.Drawing.Size(142, 13);
            this.lnkFacebook.TabIndex = 5;
            this.lnkFacebook.TabStop = true;
            this.lnkFacebook.Text = "fb.com/coletanealouvor";
            this.lnkFacebook.Click += new System.EventHandler(this.lnkFacebook_Click);
            // 
            // pictureBox2
            // 
            this.pictureBox2.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.pictureBox2.BackColor = System.Drawing.Color.White;
            this.pictureBox2.Image = global::LouvorJA.Properties.Resources.config;
            this.pictureBox2.Location = new System.Drawing.Point(24, 441);
            this.pictureBox2.Name = "pictureBox2";
            this.pictureBox2.Size = new System.Drawing.Size(37, 32);
            this.pictureBox2.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.pictureBox2.TabIndex = 8;
            this.pictureBox2.TabStop = false;
            // 
            // pictureBox1
            // 
            this.pictureBox1.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.pictureBox1.BackColor = System.Drawing.Color.White;
            this.pictureBox1.Image = global::LouvorJA.Properties.Resources.CL;
            this.pictureBox1.Location = new System.Drawing.Point(24, 479);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(32, 32);
            this.pictureBox1.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.pictureBox1.TabIndex = 8;
            this.pictureBox1.TabStop = false;
            // 
            // imgFacebook
            // 
            this.imgFacebook.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.imgFacebook.Image = global::LouvorJA.Properties.Resources.Facebook;
            this.imgFacebook.Location = new System.Drawing.Point(24, 517);
            this.imgFacebook.Name = "imgFacebook";
            this.imgFacebook.Size = new System.Drawing.Size(37, 32);
            this.imgFacebook.TabIndex = 8;
            this.imgFacebook.TabStop = false;
            // 
            // lblInfantil
            // 
            this.lblInfantil.Font = new System.Drawing.Font("Arial Black", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblInfantil.ForeColor = System.Drawing.Color.Black;
            this.lblInfantil.Location = new System.Drawing.Point(23, 340);
            this.lblInfantil.Name = "lblInfantil";
            this.lblInfantil.Size = new System.Drawing.Size(187, 33);
            this.lblInfantil.TabIndex = 0;
            this.lblInfantil.Text = "Infantil";
            this.lblInfantil.Click += new System.EventHandler(this.lblInfantil_Click);
            this.lblInfantil.MouseEnter += new System.EventHandler(this.mouseEnter);
            this.lblInfantil.MouseLeave += new System.EventHandler(this.mouseLeave);
            // 
            // lblLouvor
            // 
            this.lblLouvor.Font = new System.Drawing.Font("Arial Black", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblLouvor.ForeColor = System.Drawing.Color.Black;
            this.lblLouvor.Location = new System.Drawing.Point(23, 280);
            this.lblLouvor.Name = "lblLouvor";
            this.lblLouvor.Size = new System.Drawing.Size(187, 33);
            this.lblLouvor.TabIndex = 0;
            this.lblLouvor.Text = "Louvor";
            this.lblLouvor.Click += new System.EventHandler(this.lblIndividuais_Click);
            this.lblLouvor.MouseEnter += new System.EventHandler(this.mouseEnter);
            this.lblLouvor.MouseLeave += new System.EventHandler(this.mouseLeave);
            // 
            // lblColetaneas
            // 
            this.lblColetaneas.Font = new System.Drawing.Font("Arial Black", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblColetaneas.ForeColor = System.Drawing.Color.Black;
            this.lblColetaneas.Location = new System.Drawing.Point(23, 220);
            this.lblColetaneas.Name = "lblColetaneas";
            this.lblColetaneas.Size = new System.Drawing.Size(187, 33);
            this.lblColetaneas.TabIndex = 0;
            this.lblColetaneas.Text = "Coletâneas";
            this.lblColetaneas.Click += new System.EventHandler(this.lblColetaneas_Click);
            this.lblColetaneas.MouseEnter += new System.EventHandler(this.mouseEnter);
            this.lblColetaneas.MouseLeave += new System.EventHandler(this.mouseLeave);
            // 
            // lblDoxologia
            // 
            this.lblDoxologia.Font = new System.Drawing.Font("Arial Black", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblDoxologia.ForeColor = System.Drawing.Color.Black;
            this.lblDoxologia.Location = new System.Drawing.Point(23, 100);
            this.lblDoxologia.Name = "lblDoxologia";
            this.lblDoxologia.Size = new System.Drawing.Size(187, 33);
            this.lblDoxologia.TabIndex = 0;
            this.lblDoxologia.Text = "Doxologia";
            this.lblDoxologia.Click += new System.EventHandler(this.lblPrograma_Click);
            this.lblDoxologia.MouseEnter += new System.EventHandler(this.mouseEnter);
            this.lblDoxologia.MouseLeave += new System.EventHandler(this.mouseLeave);
            // 
            // lblJovens
            // 
            this.lblJovens.Font = new System.Drawing.Font("Arial Black", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblJovens.ForeColor = System.Drawing.Color.Black;
            this.lblJovens.Location = new System.Drawing.Point(23, 160);
            this.lblJovens.Name = "lblJovens";
            this.lblJovens.Size = new System.Drawing.Size(187, 33);
            this.lblJovens.TabIndex = 0;
            this.lblJovens.Text = "Jovens";
            this.lblJovens.Click += new System.EventHandler(this.lblJovens_Click);
            this.lblJovens.MouseEnter += new System.EventHandler(this.mouseEnter);
            this.lblJovens.MouseLeave += new System.EventHandler(this.mouseLeave);
            // 
            // lblPrincipal
            // 
            this.lblPrincipal.Font = new System.Drawing.Font("Arial Black", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblPrincipal.ForeColor = System.Drawing.Color.Black;
            this.lblPrincipal.Location = new System.Drawing.Point(23, 40);
            this.lblPrincipal.Name = "lblPrincipal";
            this.lblPrincipal.Size = new System.Drawing.Size(187, 33);
            this.lblPrincipal.TabIndex = 0;
            this.lblPrincipal.Text = "Principal";
            this.lblPrincipal.Click += new System.EventHandler(this.lblPrincipal_Click);
            this.lblPrincipal.MouseEnter += new System.EventHandler(this.mouseEnter);
            this.lblPrincipal.MouseLeave += new System.EventHandler(this.mouseLeave);
            // 
            // pnlMarcador
            // 
            this.pnlMarcador.BackColor = System.Drawing.Color.DarkBlue;
            this.pnlMarcador.Location = new System.Drawing.Point(0, 155);
            this.pnlMarcador.Name = "pnlMarcador";
            this.pnlMarcador.Size = new System.Drawing.Size(17, 43);
            this.pnlMarcador.TabIndex = 1;
            // 
            // pnl2
            // 
            this.pnl2.AutoScroll = true;
            this.pnl2.BackColor = System.Drawing.Color.Transparent;
            this.pnl2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnl2.Location = new System.Drawing.Point(233, 60);
            this.pnl2.Name = "pnl2";
            this.pnl2.Size = new System.Drawing.Size(892, 501);
            this.pnl2.TabIndex = 1;
            // 
            // grd
            // 
            this.grd.AllowUserToAddRows = false;
            this.grd.AllowUserToDeleteRows = false;
            this.grd.AllowUserToResizeColumns = false;
            this.grd.AllowUserToResizeRows = false;
            dataGridViewCellStyle1.BackColor = System.Drawing.Color.LightSteelBlue;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("Verdana", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle1.ForeColor = System.Drawing.Color.Black;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.Color.CornflowerBlue;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.Color.Black;
            this.grd.AlternatingRowsDefaultCellStyle = dataGridViewCellStyle1;
            this.grd.BackgroundColor = System.Drawing.Color.SteelBlue;
            this.grd.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.grd.ColumnHeadersVisible = false;
            this.grd.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.Favorito,
            this.Titulo,
            this.Album,
            this.ID,
            this.Caminho});
            this.grd.Dock = System.Windows.Forms.DockStyle.Fill;
            this.grd.Location = new System.Drawing.Point(233, 60);
            this.grd.MultiSelect = false;
            this.grd.Name = "grd";
            this.grd.ReadOnly = true;
            this.grd.RowHeadersVisible = false;
            dataGridViewCellStyle2.BackColor = System.Drawing.Color.LightSteelBlue;
            dataGridViewCellStyle2.Font = new System.Drawing.Font("Verdana", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle2.ForeColor = System.Drawing.Color.Black;
            dataGridViewCellStyle2.SelectionBackColor = System.Drawing.Color.CornflowerBlue;
            dataGridViewCellStyle2.SelectionForeColor = System.Drawing.Color.Black;
            this.grd.RowsDefaultCellStyle = dataGridViewCellStyle2;
            this.grd.RowTemplate.Height = 40;
            this.grd.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.grd.ShowCellErrors = false;
            this.grd.ShowCellToolTips = false;
            this.grd.ShowEditingIcon = false;
            this.grd.ShowRowErrors = false;
            this.grd.Size = new System.Drawing.Size(892, 501);
            this.grd.TabIndex = 19;
            this.grd.Visible = false;
            this.grd.CellMouseClick += new System.Windows.Forms.DataGridViewCellMouseEventHandler(this.grd_CellMouseClick);
            this.grd.CellMouseEnter += new System.Windows.Forms.DataGridViewCellEventHandler(this.grd_CellMouseEnter);
            this.grd.CellMouseLeave += new System.Windows.Forms.DataGridViewCellEventHandler(this.grd_CellMouseLeave);
            this.grd.KeyDown += new System.Windows.Forms.KeyEventHandler(this.atalhoBusca);
            this.grd.MouseClick += new System.Windows.Forms.MouseEventHandler(this.grd_MouseClick);
            // 
            // Favorito
            // 
            this.Favorito.DataPropertyName = "Favorito";
            this.Favorito.HeaderText = "Favorito";
            this.Favorito.Name = "Favorito";
            this.Favorito.ReadOnly = true;
            this.Favorito.Width = 20;
            // 
            // Titulo
            // 
            this.Titulo.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.Titulo.DataPropertyName = "Titulo";
            this.Titulo.FillWeight = 55F;
            this.Titulo.HeaderText = "Titulo";
            this.Titulo.Name = "Titulo";
            this.Titulo.ReadOnly = true;
            // 
            // Album
            // 
            this.Album.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.Album.DataPropertyName = "Album";
            this.Album.FillWeight = 40F;
            this.Album.HeaderText = "Álbum";
            this.Album.Name = "Album";
            this.Album.ReadOnly = true;
            // 
            // ID
            // 
            this.ID.DataPropertyName = "ID";
            this.ID.HeaderText = "Nº";
            this.ID.Name = "ID";
            this.ID.ReadOnly = true;
            // 
            // Caminho
            // 
            this.Caminho.DataPropertyName = "Caminho";
            this.Caminho.HeaderText = "Caminho";
            this.Caminho.Name = "Caminho";
            this.Caminho.ReadOnly = true;
            this.Caminho.Visible = false;
            // 
            // btnAbrirHASD
            // 
            this.btnAbrirHASD.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnAbrirHASD.Font = new System.Drawing.Font("Verdana", 18F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnAbrirHASD.ForeColor = System.Drawing.Color.Black;
            this.btnAbrirHASD.Location = new System.Drawing.Point(706, 11);
            this.btnAbrirHASD.Name = "btnAbrirHASD";
            this.btnAbrirHASD.Size = new System.Drawing.Size(172, 38);
            this.btnAbrirHASD.TabIndex = 14;
            this.btnAbrirHASD.Text = "&Abrir (Enter)";
            this.btnAbrirHASD.UseVisualStyleBackColor = true;
            this.btnAbrirHASD.Click += new System.EventHandler(this.btnAbrirHASD_Click);
            // 
            // txtBusca
            // 
            this.txtBusca.AccessibleDescription = "";
            this.txtBusca.AccessibleName = "";
            this.txtBusca.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtBusca.BackColor = System.Drawing.Color.White;
            this.txtBusca.Font = new System.Drawing.Font("Verdana", 18F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtBusca.Location = new System.Drawing.Point(123, 11);
            this.txtBusca.Name = "txtBusca";
            this.txtBusca.Size = new System.Drawing.Size(577, 37);
            this.txtBusca.TabIndex = 17;
            this.txtBusca.TextChanged += new System.EventHandler(this.txtBusca_TextChanged);
            this.txtBusca.KeyDown += new System.Windows.Forms.KeyEventHandler(this.atalhoBusca);
            // 
            // pnlBusca
            // 
            this.pnlBusca.BackColor = System.Drawing.Color.Transparent;
            this.pnlBusca.Controls.Add(this.cboFiltro);
            this.pnlBusca.Controls.Add(this.txtBusca);
            this.pnlBusca.Controls.Add(this.btnAbrirHASD);
            this.pnlBusca.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlBusca.Location = new System.Drawing.Point(233, 0);
            this.pnlBusca.Name = "pnlBusca";
            this.pnlBusca.Size = new System.Drawing.Size(892, 60);
            this.pnlBusca.TabIndex = 20;
            // 
            // cboFiltro
            // 
            this.cboFiltro.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboFiltro.Font = new System.Drawing.Font("Verdana", 18F);
            this.cboFiltro.FormattingEnabled = true;
            this.cboFiltro.Items.AddRange(new object[] {
            "Título",
            "Letra",
            "Hinário",
            "H. PPS"});
            this.cboFiltro.Location = new System.Drawing.Point(3, 11);
            this.cboFiltro.Name = "cboFiltro";
            this.cboFiltro.Size = new System.Drawing.Size(111, 37);
            this.cboFiltro.TabIndex = 18;
            this.cboFiltro.SelectedIndexChanged += new System.EventHandler(this.cboFiltro_SelectedIndexChanged);
            // 
            // mnu
            // 
            this.mnu.Dock = System.Windows.Forms.DockStyle.None;
            this.mnu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.mnuPrincipal,
            this.mnuDoxologia,
            this.mnuJovens,
            this.mnuColetaneas,
            this.mnuLouvor,
            this.mnuInfantil});
            this.mnu.Location = new System.Drawing.Point(0, 0);
            this.mnu.Name = "mnu";
            this.mnu.Size = new System.Drawing.Size(150, 24);
            this.mnu.TabIndex = 0;
            this.mnu.Text = "menuStrip1";
            this.mnu.Visible = false;
            // 
            // mnuPrincipal
            // 
            this.mnuPrincipal.Name = "mnuPrincipal";
            this.mnuPrincipal.ShortcutKeyDisplayString = "";
            this.mnuPrincipal.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Alt | System.Windows.Forms.Keys.P)));
            this.mnuPrincipal.Size = new System.Drawing.Size(65, 20);
            this.mnuPrincipal.Text = "Principal";
            this.mnuPrincipal.Click += new System.EventHandler(this.lblPrincipal_Click);
            // 
            // mnuDoxologia
            // 
            this.mnuDoxologia.Name = "mnuDoxologia";
            this.mnuDoxologia.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Alt | System.Windows.Forms.Keys.D)));
            this.mnuDoxologia.Size = new System.Drawing.Size(73, 20);
            this.mnuDoxologia.Text = "Doxologia";
            this.mnuDoxologia.Click += new System.EventHandler(this.lblPrograma_Click);
            // 
            // mnuJovens
            // 
            this.mnuJovens.Name = "mnuJovens";
            this.mnuJovens.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Alt | System.Windows.Forms.Keys.J)));
            this.mnuJovens.Size = new System.Drawing.Size(54, 20);
            this.mnuJovens.Text = "Jovens";
            this.mnuJovens.Click += new System.EventHandler(this.lblJovens_Click);
            // 
            // mnuColetaneas
            // 
            this.mnuColetaneas.Name = "mnuColetaneas";
            this.mnuColetaneas.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Alt | System.Windows.Forms.Keys.C)));
            this.mnuColetaneas.Size = new System.Drawing.Size(77, 20);
            this.mnuColetaneas.Text = "Coletâneas";
            this.mnuColetaneas.Click += new System.EventHandler(this.lblColetaneas_Click);
            // 
            // mnuLouvor
            // 
            this.mnuLouvor.Name = "mnuLouvor";
            this.mnuLouvor.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Alt | System.Windows.Forms.Keys.L)));
            this.mnuLouvor.Size = new System.Drawing.Size(56, 20);
            this.mnuLouvor.Text = "Louvor";
            this.mnuLouvor.Click += new System.EventHandler(this.lblIndividuais_Click);
            // 
            // mnuInfantil
            // 
            this.mnuInfantil.Name = "mnuInfantil";
            this.mnuInfantil.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Alt | System.Windows.Forms.Keys.I)));
            this.mnuInfantil.Size = new System.Drawing.Size(56, 20);
            this.mnuInfantil.Text = "Infantil";
            this.mnuInfantil.Click += new System.EventHandler(this.lblInfantil_Click);
            // 
            // toolStripContainer1
            // 
            // 
            // toolStripContainer1.ContentPanel
            // 
            this.toolStripContainer1.ContentPanel.Size = new System.Drawing.Size(230, 34);
            this.toolStripContainer1.Location = new System.Drawing.Point(0, 3);
            this.toolStripContainer1.Name = "toolStripContainer1";
            this.toolStripContainer1.Size = new System.Drawing.Size(230, 34);
            this.toolStripContainer1.TabIndex = 21;
            this.toolStripContainer1.Text = "toolStripContainer1";
            // 
            // toolStripContainer1.TopToolStripPanel
            // 
            this.toolStripContainer1.TopToolStripPanel.Controls.Add(this.mnu);
            // 
            // FormPrincipal
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.SteelBlue;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(1125, 561);
            this.Controls.Add(this.grd);
            this.Controls.Add(this.pnl2);
            this.Controls.Add(this.pnlBusca);
            this.Controls.Add(this.pnl1);
            this.Font = new System.Drawing.Font("Verdana", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.mnu;
            this.MinimumSize = new System.Drawing.Size(700, 600);
            this.Name = "FormPrincipal";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Coletânea de Louvor";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.Load += new System.EventHandler(this.FormPrincipal_Load);
            this.ResizeBegin += new System.EventHandler(this.FormPrincipal_ResizeBegin);
            this.ResizeEnd += new System.EventHandler(this.FormPrincipal_ResizeEnd);
            this.pnl1.ResumeLayout(false);
            this.pnl1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox2)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.imgFacebook)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.grd)).EndInit();
            this.pnlBusca.ResumeLayout(false);
            this.pnlBusca.PerformLayout();
            this.mnu.ResumeLayout(false);
            this.mnu.PerformLayout();
            this.toolStripContainer1.TopToolStripPanel.ResumeLayout(false);
            this.toolStripContainer1.TopToolStripPanel.PerformLayout();
            this.toolStripContainer1.ResumeLayout(false);
            this.toolStripContainer1.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel pnl1;
        private System.Windows.Forms.Label lblPrincipal;
        private System.Windows.Forms.Label lblLouvor;
        private System.Windows.Forms.Label lblColetaneas;
        private System.Windows.Forms.Label lblJovens;
        private System.Windows.Forms.FlowLayoutPanel pnl2;
        private System.Windows.Forms.Panel pnlMarcador;
        private System.Windows.Forms.LinkLabel lnkFacebook;
        private System.Windows.Forms.PictureBox imgFacebook;
        private System.Windows.Forms.Label lblInfantil;
        private System.Windows.Forms.Button btnAbrirHASD;
        private System.Windows.Forms.TextBox txtBusca;
        private System.Windows.Forms.DataGridView grd;
        private System.Windows.Forms.Panel pnlBusca;
        private System.Windows.Forms.Label lblDoxologia;
        private System.Windows.Forms.ComboBox cboFiltro;
        private System.Windows.Forms.DataGridViewCheckBoxColumn Favorito;
        private System.Windows.Forms.DataGridViewTextBoxColumn Titulo;
        private System.Windows.Forms.DataGridViewTextBoxColumn Album;
        private System.Windows.Forms.DataGridViewTextBoxColumn ID;
        private System.Windows.Forms.DataGridViewTextBoxColumn Caminho;
        private System.Windows.Forms.LinkLabel lnkSite;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.LinkLabel lnkConfig;
        private System.Windows.Forms.PictureBox pictureBox2;
        private System.Windows.Forms.MenuStrip mnu;
        private System.Windows.Forms.ToolStripMenuItem mnuPrincipal;
        private System.Windows.Forms.ToolStripMenuItem mnuDoxologia;
        private System.Windows.Forms.ToolStripMenuItem mnuJovens;
        private System.Windows.Forms.ToolStripMenuItem mnuColetaneas;
        private System.Windows.Forms.ToolStripMenuItem mnuLouvor;
        private System.Windows.Forms.ToolStripMenuItem mnuInfantil;
        private System.Windows.Forms.ToolStripContainer toolStripContainer1;
    }
}