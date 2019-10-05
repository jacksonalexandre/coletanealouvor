using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace LouvorJA
{
    public partial class FormConfig : Form
	{
        public Int32 tamanho;
        List<String> lstNaoEncontradosFaltando = new List<String>();
        List<String> lstNaoEncontradosSobrando = new List<String>();

        public FormConfig(Int32 tamanho2)
		{
			InitializeComponent();
            tamanho = tamanho2;
            nudTamanho.Value = tamanho;
            LoadForm();
		}

        #region eventos
        void LoadForm()
        {
            var path = Application.StartupPath;
            var lstArquivosFisicos = Directory.GetFiles(path, "*.*", SearchOption.AllDirectories).ToList();

            var lstEncontradosFaltando = new List<String>();
            var lstEncontradosSobrando = new List<String>();

            var dt = new DataTable();
            var adapter = new OleDbDataAdapter("select distinct caminho from dados", "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=dados.mdb");
            adapter.Fill(dt);

            //1ª verificação
            foreach (DataRow r in dt.Rows)
            {
                var c = r["caminho"].ToString();
                if (lstArquivosFisicos.Contains(Path.Combine(path, c)))
                    lstEncontradosFaltando.Add(c);
                else
                {
                    lstNaoEncontradosFaltando.Add(c);
                }

            }
            lblQtdFaltando.Text = lstNaoEncontradosFaltando.Count.ToString();
            lnkFaltando.Visible = lstNaoEncontradosFaltando.Count > 0;
            Console.WriteLine("Arquivos > Encontrados: " + lstEncontradosFaltando.Count + " Não: " + lstNaoEncontradosFaltando.Count);
            lstNaoEncontradosFaltando.ForEach(i => Console.WriteLine(i));

            //2ª verificação
            foreach (String a in lstArquivosFisicos)
            {
                if (a.Contains("Dados.mdb") || a.Contains("Coletânea de Louvor.") || a.Contains("Coletanea-de-Louvor") || a.Contains("HASDPPS"))
                    continue;
                if (dt.Compute("count(caminho)", "caminho='" + a.Substring(path.Length + 1) + "'").ToString() != "0")
                    lstEncontradosSobrando.Add(a);
                else
                    lstNaoEncontradosSobrando.Add(a);
            }
            lblQtdSobrando.Text = lstNaoEncontradosSobrando.Count.ToString();
            lnkSobrando.Visible = lstNaoEncontradosSobrando.Count > 0;
            Console.WriteLine("Access > Encontrados: " + lstEncontradosSobrando.Count + " Não: " + lstNaoEncontradosSobrando.Count);
            lstNaoEncontradosSobrando.ForEach(i => Console.WriteLine(i));
        }

        void LnkSobrando_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            Ver(lstNaoEncontradosSobrando, "Sobrando");
        }

        void LnkFaltando_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            Ver(lstNaoEncontradosFaltando, "Faltando");
        }

        void NudTamanho_ValueChanged(object sender, EventArgs e)
        {
            try
            {
                tamanho = Convert.ToInt32(nudTamanho.Value);
            }
            catch
            {
                tamanho = 130;
            }
        }
        #endregion

        #region métodos
        void Ver(List<string> lstNaoEncontradosSobrando, String text)
        {
            var msg = "";
            lstNaoEncontradosSobrando.ForEach(o => msg += o.Replace(Directory.GetCurrentDirectory() + "\\", "") + Environment.NewLine);
            MessageBox.Show(msg, "Arquivos " + text, MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        #endregion

        private void FormConfig_Load(object sender, EventArgs e)
        {

        }
    }
}