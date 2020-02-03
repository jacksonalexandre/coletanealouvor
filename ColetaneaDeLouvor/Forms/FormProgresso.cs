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
    public partial class FormProgresso : Form
    {
        Int32 _progresso;
        String arquivo;

        public FormProgresso()
        {
            InitializeComponent();
        }

        public Int32 Progresso
        {
            get
            {
                return _progresso;
            }
            set
            {
                var dif = value - _progresso;
                _progresso += dif;
                barProgresso.Increment(dif);
            }
        }

        public String Arquivo
        {
            get { return arquivo; }
            set
            {
                arquivo = value;
                lblArquivo.Text = "Baixando: " + value;
            }
        }

        private void btnCancelar_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }
    }
}
