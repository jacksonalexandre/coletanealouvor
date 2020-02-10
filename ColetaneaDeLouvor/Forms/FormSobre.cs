using ColetaneaDeLouvor.DAO;
using ColetaneaDeLouvor.Database;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.OleDb;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml;

namespace ColetaneaDeLouvor.Forms
{
    public partial class FormSobre : Form
    {
        public FormSobre()
        {
            InitializeComponent();
        }

        //LINK DO BOTÃO ATUALIZAR O SISTEMA NA TELA SOBRE
        private void linkVerificar_Click(object sender, EventArgs e)
        {
            //Primeiro faz um teste se existe conexão com a internet, se existir o sistema verificará se existe atualização
            int fail = TestarConexao.IsConnected();
            if (fail == 0)
            {
                string versao_local = this.ProductVersion; //pega a versão do app local
                string versao_servidor = string.Empty; //variável para pegar a versão do app na web
                string updater_local = Path.GetFileName(@"\\updater.exe"); //variável para pegar a versão do updater local
                string updater_servidor = string.Empty; //variável para pegar a versão do updater na web

                bool baixarAtualizador = false;

                #region leitura do xml do autoupdate
                XmlDocument doc1 = new XmlDocument();
                doc1.Load(DadosAccess.LinkServidor() + "autoupdate.xml");
                XmlNodeList nodes = doc1.SelectNodes("//update/coletanea");
                foreach (XmlNode node in nodes)
                {
                    versao_servidor = node["versao_servidor"].InnerText;
                    updater_servidor = node["updater_servidor"].InnerText;
                }
                #endregion

                if (!versao_local.Equals(versao_servidor)) //SE A VERSÃO DO APP LOCAL FOR DIFERENTE DA VERSÃO DO APP NA WEB
                {
                    if (File.Exists(updater_local)) //SE O APP UPDATER EXISTIR NA MÁQUINA LOCAL
                    {
                        updater_local = FileVersionInfo.GetVersionInfo(updater_local).ProductVersion;//variável recebe a versão do updater local
                        if (updater_local.Equals(updater_servidor)) //SE A VERSÃO DO UPDATER LOCAL FOR IGUAL DA VERSÃO DO UPDATER NA WEB
                        {
                            Process.Start(@"updater.exe"); //abre o software de atualização do sistema
                        }
                        else //SE A VERSÃO DO UPDATER LOCAL FOR DIFERENTE
                        {
                            File.Delete(Path.GetFileName(@"updater.exe"));
                            baixarAtualizador = true;
                        }

                    }
                    else //SE O APP UPDATER NÃO EXISTIR NA MÁQUINA LOCAL
                        baixarAtualizador = true;
                }
                else //SE A VERSÃO DO APP LOCAL FOR IGUAL A DO APP NA WEB
                    MessageBox.Show("Não se preocupe a sua Coletânea de Louvor já está atualizada.", "Coletânea já atualizada!", MessageBoxButtons.OK);

                if (baixarAtualizador == true)
                {
                    Download download = new Download();
                    download.abrir(Path.GetFileName(@"updater.exe"));
                }
            }
        }

        private void FormSobre_Load(object sender, EventArgs e)
        {
            lblVersao.Text = this.ProductVersion;
        }

        private void pnlLinkSite_Click(object sender, EventArgs e)
        {
            abrirLink("www.coletanealouvor.com.br");
        }

        public void abrirLink(String link)
        {
            Process.Start(link);
        }

        void ajustar()
        {
            var lstNaoEncontradosFaltando = new List<String>();
            var lstNaoEncontradosSobrando = new List<String>();

            var pastaRaiz = Application.StartupPath.ToLower() + @"\arquivos\coletaneas";
            moverPasta(pastaRaiz, "a_esperanca_e_jesus_pg", "a_esperanca_e_jesus_pg.exe");
            moverPasta(pastaRaiz, "amigos_da_esperanca", "amigos da esperança.exe");
            moverPasta(pastaRaiz, "amizade", "amizade.exe");
            moverPasta(pastaRaiz, "amizade_e_pra_sempre", "amizade é pra sempre.exe");
            moverPasta(pastaRaiz, "campori_aamar", "campori aamar.exe");
            moverPasta(pastaRaiz, "campori_aceam", "campori aceam.exe");
            moverPasta(pastaRaiz, "cristo_volte_volte_ja", "cristo volte, volte já.exe");
            moverPasta(pastaRaiz, "daniel-ludtke_diferente", "diferente.exe");
            moverPasta(pastaRaiz, "daniel-ludtke_filhos-de-israel", "filhos de israel.exe");
            moverPasta(pastaRaiz, "ja_1994", "ja 1994.exe");
            moverPasta(pastaRaiz, "ja_1995", "ja 1995.exe");
            moverPasta(pastaRaiz, "ja_1996", "ja 1996.exe");
            moverPasta(pastaRaiz, "ja_1997", "ja 1997.exe");
            moverPasta(pastaRaiz, "ja_1998", "ja 1998.exe");
            moverPasta(pastaRaiz, "ja_1999", "ja 1999.exe");
            moverPasta(pastaRaiz, "ja_2000", "ja 2000.exe");
            moverPasta(pastaRaiz, "ja_2001", "ja 2001.exe");
            moverPasta(pastaRaiz, "ja_2002", "ja 2002.exe");
            moverPasta(pastaRaiz, "ja_2003", "ja 2003.exe");
            moverPasta(pastaRaiz, "ja_2004", "ja 2004.exe");
            moverPasta(pastaRaiz, "ja_2005", "ja 2005.exe");
            moverPasta(pastaRaiz, "ja_2006", "ja 2006.exe");
            moverPasta(pastaRaiz, "ja_2007", "ja 2007.exe");
            moverPasta(pastaRaiz, "ja_2008", "ja 2008.exe");
            moverPasta(pastaRaiz, "ja_2009", "ja 2009.exe");
            moverPasta(pastaRaiz, "ja_2010", "ja 2010.exe");
            moverPasta(pastaRaiz, "ja_2012", "ja 2012.exe");
            moverPasta(pastaRaiz, "ja_2013", "ja 2013.exe");
            moverPasta(pastaRaiz, "ja_2014", "ja 2014.exe");
            moverPasta(pastaRaiz, "ja_2015", "ja 2015.exe");
            moverPasta(pastaRaiz, "diga_ao_mundo", "diga ao mundo.exe");
            moverPasta(pastaRaiz, "infantil_cantando1", "cantando com jesus 1.exe");
            moverPasta(pastaRaiz, "infantil_cantando2", "cantando com jesus 2.exe");
            moverPasta(pastaRaiz, "e_recebereis_poder", "e recebereis poder.exe");
            moverPasta(pastaRaiz, "em_comunhao", "em comunhão.exe");
            moverPasta(pastaRaiz, "escolhidos_para_brilhar", "escolhidos para brilhar.exe");
            moverPasta(pastaRaiz, "escolhidos_por_jesus", "escolhidos por jesus.exe");
            moverPasta(pastaRaiz, "evangelismo_com_esperanca", "evangelizando_com_esperança.exe");
            moverPasta(pastaRaiz, "evangelismo_integrado", "evangelismo integrado.exe");
            moverPasta(pastaRaiz, "familia_por_familias", "familia por familias.exe");
            moverPasta(pastaRaiz, "impacto_esperanca", "impacto esperança.exe");
            moverPasta(pastaRaiz, "e_hora_de_viver", "é hora de viver.exe");
            moverPasta(pastaRaiz, "e_so_louvor", "é só louvor.exe");
            moverPasta(pastaRaiz, "vamos_louvar_nosso_rei", "vamos_louvar_nosso_rei.exe");
            moverPasta(pastaRaiz, "vida_plena", "vida_plena.exe");
            moverPasta(pastaRaiz, "louve_ao_senhor", "louve ao senhor.exe");
            moverPasta(pastaRaiz, "infantil_louvorinfantil2", "louvor infantil ii.exe");
            moverPasta(pastaRaiz, "instrumental", "instrumental.exe");
            moverPasta(pastaRaiz, "louvor_2005", "louvor 2005.exe");
            moverPasta(pastaRaiz, "melhore_o_mundo", "melhore o mundo.exe");
            moverPasta(pastaRaiz, "mensageiros_da_esperanca", "mensageiros da esperança.exe");
            moverPasta(pastaRaiz, "ministerio_da_mulher", "ministério da mulher.exe");
            moverPasta(pastaRaiz, "ministerio-louvor_nt", "ministério de louvor novo tempo.exe");
            moverPasta(pastaRaiz, "ministerio-louvor_vol-1", "ministério de louvor vol.1.exe");
            moverPasta(pastaRaiz, "na_presenca_de_deus", "na presença de deus.exe");
            moverPasta(pastaRaiz, "superacao", "superação.exe");
            moverPasta(pastaRaiz, "na_trilha_da_conquista", "na trilha da conquista.exe");
            moverPasta(pastaRaiz, "novavoz_creioemti", "nova voz.exe");
            moverPasta(pastaRaiz, "nova_descoberta", "nova_descoberta.exe");
            moverPasta(pastaRaiz, "novo_sentido", "novo sentido.exe");
            moverPasta(pastaRaiz, "infantil_prisma_teen", "prisma teen.exe");
            moverPasta(pastaRaiz, "quero_te_ver", "quero te ver.exe");
            moverPasta(pastaRaiz, "restaurando_vidas", "restaurando vidas.exe");
            moverPasta(pastaRaiz, "songs", "songs.exe");
            moverPasta(pastaRaiz, "infantil_ministerio_da_crianca1", "ministério da criança 1.exe");
            //moverPasta(pastaRaiz, "vamos_louvar", "Vamos Louvar.exe");

            renomear(pastaRaiz, "JA 2011", "ja_2011");
            renomear(pastaRaiz, "Doxologia", "doxologia_");
            renomear(pastaRaiz, "Outros", "louvores_");
            renomear(pastaRaiz, "Salmos-2", "daniel-ludtke_salmos-2");
            renomear(pastaRaiz, "eu-creio", "ja_2017");

            moverArquivo(pastaRaiz, @"infantil\adão.mp4", "infantil_minhavidaeumaviagem-1", "adão.mp4");
            moverArquivo(pastaRaiz, @"infantil\daniel.mp4", "infantil_minhavidaeumaviagem-1", "daniel.mp4");
            moverArquivo(pastaRaiz, @"infantil\gigante davi.mp4", "infantil_minhavidaeumaviagem-1", "gigante davi.mp4");
            moverArquivo(pastaRaiz, @"infantil\jesus pode tudo.mp4", "infantil_minhavidaeumaviagem-1", "jesus pode tudo.mp4");
            moverArquivo(pastaRaiz, @"infantil\mãe, eu amo você.mp4", "infantil_minhavidaeumaviagem-1", "mãe, eu amo você.mp4");
            moverArquivo(pastaRaiz, @"infantil\minha vida é uma viagem.mp4", "infantil_minhavidaeumaviagem-1", "minha vida é uma viagem.mp4");
            moverArquivo(pastaRaiz, @"infantil\naamã.mp4", "infantil_minhavidaeumaviagem-1", "naamã.mp4");
            moverArquivo(pastaRaiz, @"infantil\o cordeiro.mp4", "infantil_minhavidaeumaviagem-1", "o cordeiro.mp4");
            moverArquivo(pastaRaiz, @"infantil\o que é que tem na arca de noé.mp4", "infantil_minhavidaeumaviagem-1", "o que é que tem na arca de noé.mp4");
            moverArquivo(pastaRaiz, @"infantil\tchibum.mp4", "infantil_minhavidaeumaviagem-1", "tchibum.mp4");
            moverArquivo(pastaRaiz, @"infantil\zaqueu.mp4", "infantil_minhavidaeumaviagem-1", "zaqueu.mp4");
            moverArquivo(pastaRaiz, @"infantil\auê.mp4", "infantil_minhavidaeumaviagem-2", "auê.mp4");
            moverArquivo(pastaRaiz, @"infantil\bebê jesus.mp4", "infantil_minhavidaeumaviagem-2", "bebê jesus.mp4");
            moverArquivo(pastaRaiz, @"infantil\deus te fez para sorrir.mp4", "infantil_minhavidaeumaviagem-2", "deus te fez para sorrir.mp4");
            moverArquivo(pastaRaiz, @"infantil\fortão do cabelão.mp4", "infantil_minhavidaeumaviagem-2", "fortão do cabelão.mp4");
            moverArquivo(pastaRaiz, @"infantil\instrumentos.mp4", "infantil_minhavidaeumaviagem-2", "instrumentos.mp4");
            moverArquivo(pastaRaiz, @"infantil\menino sonhador.mp4", "infantil_minhavidaeumaviagem-2", "menino sonhador.mp4");
            moverArquivo(pastaRaiz, @"infantil\milagres no deserto.mp4", "infantil_minhavidaeumaviagem-2", "milagres no deserto.mp4");
            moverArquivo(pastaRaiz, @"infantil\pai da fé.mp4", "infantil_minhavidaeumaviagem-2", "pai da fé.mp4");
            moverArquivo(pastaRaiz, @"infantil\peixes.mp4", "infantil_minhavidaeumaviagem-2", "peixes.mp4");
            moverArquivo(pastaRaiz, @"infantil\seu balaão.mp4", "infantil_minhavidaeumaviagem-2", "seu balaão.mp4");
            moverArquivo(pastaRaiz, @"infantil\a_vida_é_tão_boa.mp4", "infantil_minhavidaeumaviagem-3", "a_vida_é_tão_boa.mp4");
            moverArquivo(pastaRaiz, @"infantil\armadura_do_cristão.mp4", "infantil_minhavidaeumaviagem-3", "armadura_do_cristão.mp4");
            moverArquivo(pastaRaiz, @"infantil\estrela.mp4", "infantil_minhavidaeumaviagem-3", "estrela.mp4");
            moverArquivo(pastaRaiz, @"infantil\herói.mp4", "infantil_minhavidaeumaviagem-3", "herói.mp4");
            moverArquivo(pastaRaiz, @"infantil\i_corintios_12.mp4", "infantil_minhavidaeumaviagem-3", "i_corintios_12.mp4");
            moverArquivo(pastaRaiz, @"infantil\muito_bom.mp4", "infantil_minhavidaeumaviagem-3", "muito_bom.mp4");
            moverArquivo(pastaRaiz, @"infantil\onde_é_que_tá.mp4", "infantil_minhavidaeumaviagem-3", "onde_é_que_tá.mp4");

            moverArquivo(pastaRaiz, @"Colheita 2006.exe", "colheita_2006", "louvar seu nome.exe");

            var sb = new StringBuilder();
            var lstArquivosFisicos = Directory.GetFiles(pastaRaiz, "*.*", SearchOption.AllDirectories).ToList();
            for(int x=0; x< lstArquivosFisicos.Count; x++)
                lstArquivosFisicos[x] = lstArquivosFisicos[x].ToLower();

            var lstEncontradosFaltando = new List<String>();
            var lstEncontradosSobrando = new List<String>();

            var dt = new DataTable();
            var adapter = new OleDbDataAdapter("select distinct LCASE(button+'\\'+caminho) as caminho from dados", DadosAccess.Dados());
            adapter.Fill(dt);

            //1ª verificação
            foreach (DataRow r in dt.Rows)
            {
                var c = r["caminho"].ToString();
                if (lstArquivosFisicos.Contains(Path.Combine(pastaRaiz, c)))
                    lstEncontradosFaltando.Add(c);
                else
                    lstNaoEncontradosFaltando.Add(c);
            }
            sb.AppendLine("Arquivos faltando: " + lstNaoEncontradosFaltando.Count);
            lstNaoEncontradosFaltando.ForEach(i => Console.WriteLine(i));

            //2ª verificação
            foreach (String a in lstArquivosFisicos)
            {
                var a2 = a.ToLower().Substring(pastaRaiz.Length + 1);
                if (a2.Contains("dados.mdb") || a2.Contains("coletânea de louvor.") || a2.Contains("coletanea-de-louvor") || a2.Contains("hasdpps"))
                    continue;
                if (dt.Compute("count(caminho)", "caminho='" + a2 + "'").ToString() != "0")
                    lstEncontradosSobrando.Add(a2);
                else
                    lstNaoEncontradosSobrando.Add(a2);
            }
            sb.AppendLine("Arquivos sobrando: " + lstNaoEncontradosSobrando.Count);
            lstNaoEncontradosSobrando.ForEach(i => Console.WriteLine(i));
            MessageBox.Show(sb.ToString(), "Arquivos", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        void moverPasta(String pastaRaiz, String dir, String arquivo)
        {
            if (!File.Exists(Path.Combine(pastaRaiz, arquivo)))
                return;

            var dir2 = Path.Combine(pastaRaiz, dir);
            if (!Directory.Exists(dir2))
                Directory.CreateDirectory(dir2);
            File.Move(Path.Combine(pastaRaiz, arquivo), Path.Combine(dir2, arquivo));
        }
        void moverArquivo(String pastaRaiz, String caminhoAntigo, String dir, String arquivoNovo)
        {
            var arquivoAntigo2 = Path.Combine(pastaRaiz, caminhoAntigo);
            if (!File.Exists(arquivoAntigo2))
                return;

            var dir2 = Path.Combine(pastaRaiz, dir);
            if (!Directory.Exists(dir2))
                Directory.CreateDirectory(dir2);
            File.Move(arquivoAntigo2, Path.Combine(dir2, arquivoNovo));
        }
        void renomear(String pastaRaiz, String pastaAntiga, String pastaNova)
        {
            if (!Directory.Exists(Path.Combine(pastaRaiz, pastaAntiga)))
                return;
            Directory.Move(Path.Combine(pastaRaiz, pastaAntiga), Path.Combine(pastaRaiz, pastaNova));
        }

        private void lnkAjustar_Click(object sender, EventArgs e)
        {
            ajustar();
        }
    }
}
