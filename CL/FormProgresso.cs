using System;
using System.Windows.Forms;

namespace LouvorJA
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
                var dif = value-_progresso;
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

        void btnCancelar_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }
    }
}
