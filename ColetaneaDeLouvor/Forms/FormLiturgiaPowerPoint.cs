using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ColetaneaDeLouvor.Forms
{
    public partial class FormLiturgiaPowerPoint : Form
    {
        public FormLiturgiaPowerPoint()
        {
            InitializeComponent();
        }

        //ABRIR CADASTRO DE CULTOS
        private void cadastroDeCultosToolStripMenuItem_Click(object sender, EventArgs e)
        {
            FormCultos abrir = new FormCultos();
            abrir.ShowDialog();
        }
    }
}
