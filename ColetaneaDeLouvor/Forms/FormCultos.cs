using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ColetaneaDeLouvor.Forms
{
    public partial class FormCultos : Form
    {
        public FormCultos()
        {
            InitializeComponent();
        }

        private void FormCultos_Load(object sender, EventArgs e)
        {
            var caminhoBanco = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "Database\\Culto.mdf");
            var stringConexao = string.Format(@"Server=(localdb)\mssqllocaldb; Integrated Security=true; AttachDbFileName={0};", caminhoBanco);

            using (var conn = new SqlConnection(stringConexao))
            {
                conn.Open();
                if (conn.State == ConnectionState.Open)
                {
                    using (var comm = new SqlCommand())
                    {
                        comm.Connection = conn;
                        comm.CommandText = "SELECT * FROM Slide";
                        using (var reader = comm.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                listBox1.Items.Add(reader["Item"]);
                                listBox1.Items.Add(reader["Imagem"]);
                                //Console.WriteLine("ID: {0}, Nome: {1}, Sobrenome: {2}", reader["Id"], reader["Nome"], reader["Sobrenome"]);
                            }
                        }
                    }
                }
            }
        }
    }
}
