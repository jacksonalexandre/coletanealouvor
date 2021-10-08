using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Windows.Forms;
using System.IO;

namespace LouvorJA
{
    public partial class FormPrincipal : Form
    {
        #region variáveis
        Louvor obj = new Louvor();
        PictureBox item = new PictureBox();
        List<Hino> lst = new List<Hino>();
        DataGridView _grd = null;
        Timer timer = new Timer();
        String ultimaBusca = "";
        Int32 ultimoFiltro = 0;
        Int32 tamanho = 130;
        Image img = null;
        #endregion

        public FormPrincipal()
        {
            InitializeComponent();

            img = this.BackgroundImage;
            this.Text += " " + Application.ProductVersion;
            _grd = grd;
            grd.Dock = DockStyle.Fill;
            grd.Visible = false;
            cboFiltro.SelectedIndex = 0;

            timer.Tick += T_Tick;

            AppDomain.CurrentDomain.AssemblyResolve += new ResolveEventHandler(CurrentDomain_AssemblyResolve);

            //if(!File.Exists("Dados.mdb"))
            File.WriteAllBytes("Dados.mdb", Properties.Resources.dados);
        }

        Assembly CurrentDomain_AssemblyResolve(object sender, ResolveEventArgs args)
        {
            String dllName = args.Name.Contains(',') ? args.Name.Substring(0, args.Name.IndexOf(',')) : args.Name.Replace(".dll", "");
            dllName = dllName.Replace(".", "_");
            if (dllName.EndsWith("_resources")) return null;
            System.Resources.ResourceManager rm = new System.Resources.ResourceManager(GetType().Namespace + ".Properties.Resources", System.Reflection.Assembly.GetExecutingAssembly());
            byte[] bytes = (byte[])rm.GetObject(dllName);
            return Assembly.Load(bytes);
        }

        #region eventos
        void FormPrincipal_Load(object sender, EventArgs e)
        {
            loadForm();
        }
        void lblPrincipal_Click(object sender, EventArgs e)
        {
            principal();
        }
        void lblJovens_Click(object sender, EventArgs e)
        {
            jovens(false);
        }
        void lblColetaneas_Click(object sender, EventArgs e)
        {
            coletaneas();
        }
        void lblIndividuais_Click(object sender, EventArgs e)
        {
            individuais();
        }
        void imgSorteio_Click(object sender, EventArgs e)
        {
            //new FormVideo().Show();
            FormSorteio.Abrir();
        }
        void imgCronometro_Click(object sender, EventArgs e)
        {
            new FormCronometro().Show();
        }
        void btnAbrirHASD_Click(object sender, EventArgs e)
        {
            abrir();
        }
        void lnkFacebook_Click(object sender, EventArgs e)
        {
            obj.abrirLink("http://fb.com/coletanealouvor");
        }
        void txtBusca_TextChanged(object sender, EventArgs e)
        {
            busca();
        }
        void atalhoBusca(object sender, KeyEventArgs e)
        {
            var g = grd;
            switch (e.KeyCode)
            {
                case Keys.Enter:
                    abrir();
                    break;
                case Keys.Up:
                    if (g.Rows.Count <= 1 || g.SelectedRows.Count == 0)
                        return;
                    var linha = g.SelectedRows[0].Index - 1;
                    if (linha >= 0)
                        g.Rows[linha].Selected = true;
                    e.SuppressKeyPress = true;
                    break;
                case Keys.Down:
                    if (g.Rows.Count <= 1 || g.SelectedRows.Count == 0)
                        return;
                    var linha2 = g.SelectedRows[0].Index + 1;
                    if (linha2 < g.Rows.Count)
                        g.Rows[linha2].Selected = true;
                    e.SuppressKeyPress = true;
                    break;
            }
        }
        void grd_CellMouseClick(object sender, DataGridViewCellMouseEventArgs e)
        {
            if(e.ColumnIndex == 4)
            {
                var item = true;
                if ((sender as DataGridView).CurrentCell.Value != null && (sender as DataGridView).CurrentCell.Value.ToString() == "True")
                    item = false;
                (sender as DataGridView).CurrentCell.Value = item;
                if(item)
                {
                    lst.Add((sender as DataGridView).CurrentRow.DataBoundItem as Hino);
                }
                else
                {
                    lst.Remove((sender as DataGridView).CurrentRow.DataBoundItem as Hino);
                    ultimaBusca = "[REMOVER]";
                    busca2();
                }
            }
            else
            {
                abrir();
            }
        }
        void grd_CellMouseEnter(object sender, DataGridViewCellEventArgs e)
        {
            mouseEnter(sender, e);
        }
        void grd_CellMouseLeave(object sender, DataGridViewCellEventArgs e)
        {
            mouseLeave(sender, e);
        }
        void lblInfantil_Click(object sender, EventArgs e)
        {
            infantil();
        }
        void grd_MouseClick(object sender, MouseEventArgs e)
        {
            txtBusca.Focus();
        }
        void lblPrograma_Click(object sender, EventArgs e)
        {
            programa();
        }
        void cboFiltro_SelectedIndexChanged(object sender, EventArgs e)
        {
            busca();
        }
        void T_Tick(object sender, EventArgs e)
        {
            if (timer.Tag.ToString() != txtBusca.Text)
                return;
            busca2();
        }
        void lnkSite_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            obj.abrirLink("http://coletanealouvor.com.br");
        }
        void lnkConfig_Click(object sender, EventArgs e)
        {
            var frm = new FormConfig(tamanho);
            frm.ShowDialog();
            tamanho = frm.tamanho;
            jovens(false);
        }
        void FormPrincipal_ResizeBegin(object sender, EventArgs e)
        {
            this.BackgroundImage = null;
        }
        void FormPrincipal_ResizeEnd(object sender, EventArgs e)
        {
            this.BackgroundImage = img;
        }
        #endregion

        #region conteúdo
        void principal()
        {
            setPnl(lblPrincipal);
            txtBusca.Focus();
        }
        void programa()
        {
            setPnl(lblDoxologia);

            addItem(Properties.Resources.CultoAbertura, @"Doxologia\Abertura.mp4");
            addItem(Properties.Resources.AdoracaoInfantilEntrada, @"Doxologia\Adoração-Infantil-Entrada.mp4");
            addItem(Properties.Resources.AdoracaoInfantilSaida, @"Doxologia\Adoração-Infantil-Saída.mp4");
            addItem(Properties.Resources.Ofertorio_exe, @"Doxologia\Ofertorio.mp4");
            addItem(Properties.Resources.Despedida, @"Doxologia\Despedida.mp4");
            addItem(Properties.Resources.Cronômetro, imgCronometro_Click);
            addItem(Properties.Resources.Sorteio, imgSorteio_Click);
            // addItem(Properties.Resources.Escola_Sabatina, @"Doxologia\EncerramentoDaLicao.exe");
            // addItem(Properties.Resources.Escola_Sabatina, @"Outros\Hino-Desbravadores.mp4");
            // addItem(Properties.Resources.Escola_Sabatina, @"Outros\Hino-Aventureiros.mp4");
        }
        void jovens(Boolean inicial)
        {
            if(!inicial)
                setPnl(lblJovens);

            // addItem(Properties.Resources.AcusticoNT, delegate { new FormAcusticoNT().Show(); });
            // addItem(Properties.Resources.CelebraSP2, delegate { new FormCelebraSP2().Show(); });
            // addItem(Properties.Resources.CelebraSP1, delegate { new FormCelebraSP().Show(); });
            // addItem(Properties.Resources.DanielLudtkeSalmos2, delegate { new FormSalmos2().Show(); });
            addItem(Properties.Resources.DanielLudtkeDiferente, "Diferente.exe");
            addItem(Properties.Resources.DanielLudtkeJesusLuz, "Jesus Luz do Mundo.exe");
            addItem(Properties.Resources.DanielLudtkeFilhosDeIsrael, "Filhos de Israel.exe");
            addItem(Properties.Resources.DanielLudtkeSalmos1, "Salmos.exe");
            addItem(Properties.Resources.Ministerio_Louvor_Vol_2, "Ministério de Louvor.exe");
            addItem(Properties.Resources.Ministerio_Louvor_Vol_1, "Ministério de Louvor Vol.1.exe");
            // addItem(Properties.Resources.EuCreio, delegate { new FormEuCreio().Show(); });
            // addItem(Properties.Resources.Adoradores3, delegate { new FormAdoradores3().Show(); });
            addItem(Properties.Resources.ja_2016, "JA 2016.exe");
            addItem(Properties.Resources.Adoradores1, "Adoradores.exe");
            addItem(Properties.Resources.ja_2015, "JA 2015.exe");
            addItem(Properties.Resources.ja_2014, "JA 2014.exe");
            addItem(Properties.Resources.ja_2013, "JA 2013.exe");
            addItem(Properties.Resources.ja_2012, "JA 2012.exe");
            // addItem(Properties.Resources.ja_2011, delegate { new FormJA2011().Show(); });
            addItem(Properties.Resources.ja_2010, "JA 2010.exe");
            addItem(Properties.Resources.ja_2009, "JA 2009.exe");
            addItem(Properties.Resources.ja_2008, "JA 2008.exe");
            addItem(Properties.Resources.ja_2007, "JA 2007.exe");
            addItem(Properties.Resources.ja_2006, "JA 2006.exe");
            addItem(Properties.Resources.ja_2005, "JA 2005.exe");
            addItem(Properties.Resources.ja_2004, "JA 2004.exe");
            addItem(Properties.Resources.ja_2003, "JA 2003.exe");
            addItem(Properties.Resources.ja_2002, "JA 2002.exe");
            addItem(Properties.Resources.ja_2001, "JA 2001.exe");
            addItem(Properties.Resources.ja_2000, "JA 2000.exe");
            addItem(Properties.Resources.ja_1999, "JA 1999.exe");
            addItem(Properties.Resources.ja_1998, "JA 1998.exe");
            addItem(Properties.Resources.ja_1997, "JA 1997.exe");
            addItem(Properties.Resources.ja_1996, "JA 1996.exe");
            addItem(Properties.Resources.ja_1995, "JA 1995.exe");
            addItem(Properties.Resources.ja_1994, "JA 1994.exe");
            addItem(Properties.Resources.ja_1993, "JA 1993.exe");
            addItem(Properties.Resources.ja_1992, "JA 1992.exe");
        }
        void coletaneas()
        {
            setPnl(lblColetaneas);

            addItem(Properties.Resources.Ministerio_Louvor_NT, "Ministério de Louvor Novo Tempo.exe");
            addItem(Properties.Resources.novo_sentido, "Novo Sentido.exe");
            addItem(Properties.Resources.NovaVoz_CreioEmTi, "Nova Voz.exe");
            addItem(Properties.Resources.AEsperancaEJesus, "a_esperanca_e_jesus_pg.exe");
            addItem(Properties.Resources.Amizade, "Amizade.exe");
            addItem(Properties.Resources.diga_ao_mundo, "Diga ao Mundo.exe");
            addItem(Properties.Resources.restaurando_vidas, "Restaurando Vidas.exe");
            addItem(Properties.Resources.escolhidos_para_brilhar, "Escolhidos Para Brilhar.exe");
            addItem(Properties.Resources.vamos_louvar_nosso_rei, "Vamos Louvar.exe");
            addItem(Properties.Resources.louve_ao_senhor, "Louve ao Senhor.exe");
            addItem(Properties.Resources.em_comunhao, "Em Comunhão.exe");
            addItem(Properties.Resources.e_recebereis_poder, "E Recebereis Poder.exe");
            addItem(Properties.Resources.e_so_louvor, "É Só Louvor.exe");
            addItem(Properties.Resources.na_trilha_da_conquista, "Na Trilha da Conquista.exe");
            addItem(Properties.Resources.evangelismo_integrado, "Evangelismo Integrado.exe");
            addItem(Properties.Resources.e_hora_de_viver, "É Hora de Viver.exe");
            addItem(Properties.Resources.escolhidos_por_jesus, "Escolhidos por Jesus.exe");
            addItem(Properties.Resources.impacto_esperanca, "Impacto Esperança.exe");
            addItem(Properties.Resources.Colheita2006, "Colheita 2006.exe");
            addItem(Properties.Resources.Superacao, "Superação.exe");
            addItem(Properties.Resources.quero_te_ver, "Quero Te Ver.exe");
            addItem(Properties.Resources.melhore_o_mundo, @"Melhore o Mundo.exe");
            addItem(Properties.Resources.na_presenca_de_deus, @"Na Presença de Deus.exe");
            addItem(Properties.Resources.pra_ser_feliz, @"Pra Ser Feliz.exe");
            addItem(Properties.Resources.mensageiros_da_esperanca, @"Mensageiros da Esperança.exe");
            addItem(Properties.Resources.amigos_da_esperanca, @"Amigos da Esperança.exe");
            addItem(Properties.Resources.CristoVolteVolteJa, @"Cristo Volte, Volte Já.exe");
            addItem(Properties.Resources.familia_por_familias, "Familia por Familias.exe");
            addItem(Properties.Resources.louvor_2005, "Louvor 2005.exe");
            addItem(Properties.Resources.CamporiAamar, "Campori AAMAR.exe");
            addItem(Properties.Resources.CamporiAceam, "Campori ACeAM.exe");
            addItem(Properties.Resources.nova_descoberta, "Nova_Descoberta.exe");
            addItem(Properties.Resources.vida_plena, "Vida_Plena.exe");
            // addItem(Properties.Resources.Evangelizando_com_Esperança, "Evangelizando_com_Esperança.exe");
            addItem(Properties.Resources.AmizadeEPraSempre, "Amizade É Pra Sempre.exe");

            addItem(Properties.Resources.Songs, "Songs.exe");
            addItem(Properties.Resources.ministerio_da_mulher, @"Ministério da Mulher.exe");
            // addItem(Properties.Resources.Escolhas, "Escolhas.exe");
            addItem(Properties.Resources.instrumental, "Instrumental.exe");
        }
        void individuais()
        {
            setPnl(lblLouvor);

            #region Doxologia
            addItem(Properties.Resources.ToqueDePoder_exe, @"Doxologia\ToqueDePoder.exe");
            addItem(Properties.Resources.Em_Paz_eu_Vou, @"Doxologia\Em Paz eu Vou.exe");
            #endregion

            #region Louvores
            addItem(Properties.Resources.DeVoltaAoJardimDoÉden, @"Outros\De Volta ao Jardim do Éden.exe");
            addItem(Properties.Resources.Desculpas, @"Outros\Desculpas.exe");
            addItem(Properties.Resources.Vaso_de_Alabastro_exe, @"Outros\Vaso de Alabastro.exe");
            addItem(Properties.Resources.CadaPasso, @"Outros\Cada passo.exe");
            addItem(Properties.Resources.Doce_Como_Mel_exe, @"Outros\Doce Como Mel.exe");
            addItem(Properties.Resources.Quebrando_o_silêncio_exe, @"Outros\Quebrando o silêncio.exe");

            addItem(Properties.Resources.Pais_de_Esperança_exe, @"Outros\Pais de Esperança.exe");
            addItem(Properties.Resources.Nos_braços_de_Jesus_exe, @"Outros\Nos braços de Jesus.exe");
            addItem(Properties.Resources.Família_exe, @"Outros\Família.exe");

            addItem(Properties.Resources.Quando_me_chamar_exe, @"Outros\Quando me chamar.exe");
            addItem(Properties.Resources.Shekinah_exe, @"Outros\Shekinah.exe");
            addItem(Properties.Resources.Reina_em_Mim_exe, @"Outros\Reina em Mim.exe");
            addItem(Properties.Resources.Jovens_Por_Uma_Paixão_exe, @"Outros\Jovens Por Uma Paixão.exe");
            addItem(Properties.Resources.Vim_para_Adorar_Te_exe, @"Outros\Vim para Adorar-Te.exe");
            addItem(Properties.Resources.Amigos_Vamos_Ser_exe, @"Outros\Amigos Vamos Ser.exe");
            addItem(Properties.Resources.Te_Agradeço, @"Outros\Te Agradeço.exe");
            addItem(Properties.Resources.Unidos_na_Esperança_exe, @"Outros\Unidos na Esperança.exe");
            /*
            addItem(Properties.Resources.Toque_Minhas_Mãos, @"Outros\Toque Minhas Mãos.exe");
            addItem(Properties.Resources.Gente_Como_Jesus, @"Outros\Gente como Jesus.exe");
            addItem(Properties.Resources.Amigos_da_Esperança, @"Outros\Amigos da Esperança.exe");
            addItem(Properties.Resources.Jesus_é_Meu_Capitão, @"Outros\Jesus é meu capitão.exe");
            addItem(Properties.Resources.Meu_FIlho_Vem, @"Outros\Meu Filho Vem.exe");
            addItem(Properties.Resources.Ele_Virá, @"Outros\Ele Virá.exe");
            addItem(Properties.Resources.Na_Contramão_do_Mundo, @"Outros\Na Contramão do Mundo.exe");
            addItem(Properties.Resources.Nos_Átrios_de_Deus, @"Outros\Nos Átrios de Deus.exe");
            addItem(Properties.Resources.Eu_Tenho_Que_Orar, @"Outros\Eu Tenho Que Orar.exe");
            addItem(Properties.Resources.Minha_Permissão, @"Outros\Minha Permissão.exe");
            addItem(Properties.Resources.Toma_Meu_Coração, @"Outros\Toma meu coração.exe");
            addItem(Properties.Resources.Venha_Espírito_Santo, @"Outros\Venha Espírito Santo.exe");
            addItem(Properties.Resources.Os_Sonhos_de_Deus, @"Outros\Os_sonhos_de_Deus.exe");
            addItem(Properties.Resources.Meu_Universo, @"Outros\Meu Universo.exe");
            addItem(Properties.Resources.Quebrantado, @"Outros\Quebrantado.exe");
            addItem(Properties.Resources.Quem_Irá, @"Outros\Quem Irá.exe");
            addItem(Properties.Resources.Primeiro_Deus, @"Outros\Primeiro-Deus.mp4");
            */
            #endregion
        }
        void infantil()
        {
            setPnl(lblInfantil);

            addItem(Properties.Resources.A_vida_é_tão_boa, @"Infantil\A_vida_é_tão_boa.mp4");
            addItem(Properties.Resources.Adão, @"Infantil\Adão.mp4");
            addItem(Properties.Resources.Armadura_do_Cristão, @"Infantil\Armadura_do_Cristão.mp4");
            addItem(Properties.Resources.Auê, @"Infantil\Auê.mp4");
            addItem(Properties.Resources.Bebê_Jesus, @"Infantil\Bebê Jesus.mp4");
            addItem(Properties.Resources.Daniel, @"Infantil\Daniel.mp4");
            addItem(Properties.Resources.Deus_te_fez_para_sorrir, @"Infantil\Deus Te Fez para Sorrir.mp4");
            addItem(Properties.Resources.Estrela, @"Infantil\Estrela.mp4");
            addItem(Properties.Resources.Fortao_do_Cabelão, @"Infantil\Fortão do Cabelão.mp4");
            addItem(Properties.Resources.Gigante_Davi, @"Infantil\Gigante Davi.mp4");
            addItem(Properties.Resources.Herói, @"Infantil\Herói.mp4");
            addItem(Properties.Resources.I_Corintios_12, @"Infantil\I_Corintios_12.mp4");
            addItem(Properties.Resources.Instrumentos, @"Infantil\Instrumentos.mp4");
            addItem(Properties.Resources.Jesus_Pode_Tudo, @"Infantil\Jesus Pode Tudo.mp4");
            addItem(Properties.Resources.Mãe__eu_amo_você, @"Infantil\Mãe, eu amo você.mp4");
            addItem(Properties.Resources.O_menino_Sonhador, @"Infantil\Menino Sonhador.mp4");
            addItem(Properties.Resources.Milagres_no_Deserto, @"Infantil\Milagres no deserto.mp4");
            addItem(Properties.Resources.Minha_vida_é_uma_viagem, @"Infantil\Minha vida é uma viagem.mp4");
            addItem(Properties.Resources.Muito_bom, @"Infantil\Muito_bom.mp4");
            addItem(Properties.Resources.Naamã, @"Infantil\Naamã.mp4");
            addItem(Properties.Resources.O_Cordeiro, @"Infantil\O Cordeiro.mp4");
            addItem(Properties.Resources.O_que_é_que_tem_na_arca_de_Noé, @"Infantil\O que é que tem na arca de Noé.mp4");
            addItem(Properties.Resources.Onde_é_que_tá, @"Infantil\Onde_é_que_tá.mp4");
            addItem(Properties.Resources.Pai_da_Fé, @"Infantil\Pai da fé.mp4");
            addItem(Properties.Resources.Peixes, @"Infantil\Peixes.mp4");
            addItem(Properties.Resources.Seu_balaão, @"Infantil\Seu Balaão.mp4");
            addItem(Properties.Resources.TCHIBUM, @"Infantil\TCHIBUM.mp4");
            addItem(Properties.Resources.Zaqueu, @"Infantil\Zaqueu.mp4");

            addItem(Properties.Resources.infantil_cantando1, @"Cantando com Jesus 1.exe");
            addItem(Properties.Resources.infantil_cantando2, @"Cantando com Jesus 2.exe");
            addItem(Properties.Resources.infantil_ministerio_da_crianca1, "Ministério da Criança 1.exe");
            addItem(Properties.Resources.infantil_louvorinfantil2, "Louvor Infantil II.exe");
            addItem(Properties.Resources.infantil_prisma_teen, "Prisma Teen.exe");
            addItem(Properties.Resources.AdoracaoInfantil, @"Doxologia\AdoracaoInfantil.exe");
        }
        #endregion

        #region métodos
        void loadForm()
        {
            txtBusca.Focus();
            txtBusca.SelectAll();
            jovens(true);
        }
        void addItem(Bitmap imagem, String arquivo)
        {
            addItem(imagem, delegate { obj.abrir(arquivo); });
        }
        void addItem(Bitmap imagem, MouseEventHandler click)
        {
            var obj = new PictureBox
            {
                Margin = new Padding(0),
                Image = imagem
            };
            obj.MouseClick += click;
            obj.MouseEnter += mouseEnter;
            obj.MouseLeave += mouseLeave;
            obj.SizeMode = PictureBoxSizeMode.StretchImage;

            Int32 largura = tamanho;
            Int32 altura = tamanho * 150 / 130;

            obj.MinimumSize = obj.MaximumSize = obj.Size = new Size(largura, altura);
            pnl2.Controls.Add(obj);
        }
        void mouseEnter(object sender, EventArgs e)
        {
            Cursor = Cursors.Hand;
        }
        void mouseLeave(object sender, EventArgs e)
        {
            Cursor = Cursors.Default;
        }
        void setPnl(Label lbl)
        {
            grd.Visible = (lbl.Name == "lblPrincipal" && (grd.DataSource != null && ((List<Hino>)grd.DataSource).Count > 0));
            pnl2.Visible = lbl.Name != "lblPrincipal";
            this.BackgroundImage = null;
            pnl2.Controls.Clear();
            this.BackgroundImage = img;
            pnlMarcador.Location = new Point(pnlMarcador.Location.X, lbl.Location.Y - 5);
        }
        Int32 getHino()
        {
            if (String.IsNullOrEmpty(txtBusca.Text))
                return 0;

            try
            {
                Int32 hino = Convert.ToInt32(txtBusca.Text);
                return hino;
            }
            catch (Exception)
            {
                return 0;
            }
        }
        String removeAcentos(String str)
        {
            if (String.IsNullOrEmpty(str))
                return str;

            str = str.ToLower();
            String lst1 = "áéíóúàèìòùäëïöüãõâêîôûç";
            String lst2 = "aeiouaeiouaeiouaoaeiouc";
            return replaceAll(str, lst1.ToCharArray().ToList(), lst2.ToCharArray().ToList());
        }
        String replaceAll(String str, List<Char> oldChars, List<Char> newChars)
        {
            if (String.IsNullOrEmpty(str) || oldChars == null || newChars == null)
                return str;
            var builder = new StringBuilder(str);
            foreach (var c in oldChars)
                builder.Replace(c, newChars[oldChars.FindIndex(cc => cc == c)]);
            return builder.ToString();
        }
        void busca()
        {
            timer.Stop();

            timer.Interval = 500;
            timer.Tag = txtBusca.Text;
            timer.Start();
        }
        void busca2()
        {
            if (ultimaBusca == txtBusca.Text && (ultimoFiltro == cboFiltro.SelectedIndex || cboFiltro.Focused))
                return;

            var busca = txtBusca.Text;
            ultimaBusca = busca;
            ultimoFiltro = cboFiltro.SelectedIndex;

            if (String.IsNullOrEmpty(busca) && lst.Count == 0)
            {
                grd.DataSource = new List<Hino>();
                grd.Visible = false;
                return;
            }
            principal();

            //var where = "replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(";
            var where = "(titulo ";
            //where += "'á', 'a'), 'ã', 'a'), 'â', 'a'), 'é', 'e'), 'ê', 'e'), 'í', 'i'), 'ó', 'o'), 'õ', 'o'), 'ô', 'o'), 'ú', 'u'), 'ç', 'c') ";
            where += "LIKE ";
            //where += "'%" + removeAcentos(hino) + "%' ";
            where += "'%" + busca + "%' ";
            if (cboFiltro.SelectedIndex != 0)
                where += "or letra like '%" + busca + "%' ";
            var numero = getHino();
            if (busca.Length <= 4 && numero != 0)
                where += "or (id=" + numero + ") ";
            where += ") ";
            if (cboFiltro.SelectedIndex == 2 || cboFiltro.SelectedIndex == 3)
                where += "and (album='HASD') ";

            var dt = new DataTable();

            //Console.WriteLine(where);

            var adapter = new OleDbDataAdapter("select * from dados where " + where, "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=dados.mdb");
            if (!String.IsNullOrEmpty(busca))
                adapter.Fill(dt);

            var lst2 = new List<Hino>();
            foreach (Hino h in lst)
            {
                h.Favorito = true;
                lst2.Add(h);
            }
            foreach (DataRow r in dt.Rows)
            {
                if(!lst.Any(o => o.ID == r["id"].ToString()))
                    lst2.Add(new Hino() { ID = r["id"].ToString(), Titulo = r["titulo"].ToString(), Caminho = r["caminho"].ToString(), Album = r["album"].ToString() });
            }

            grd.DataSource = lst2;
            grd.Visible = lst2.Count != 0;
        }
        void abrir()
        {
            if (grd.SelectedRows.Count == 0)
                return;
            Cursor = Cursors.AppStarting;
            var caminho = grd.SelectedRows[0].Cells["caminho"].Value.ToString();
            obj.abrir(caminho);
            txtBusca.Text = "";
            Cursor = Cursors.Default;
        }
        #endregion
    }
}