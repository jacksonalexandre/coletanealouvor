using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ColetaneaDeLouvor.DAO
{
    public class TestarConexao
    {
        public static int IsConnected()
        {
            int fail;

            System.Uri Url = new System.Uri("http://www.microsoft.com"); //é sempre bom por um site que costuma estar sempre on, para n haver problemas

            System.Net.WebRequest WebReq;
            System.Net.WebResponse Resp;
            WebReq = System.Net.WebRequest.Create(Url);

            try
            {
                Resp = WebReq.GetResponse();
                Resp.Close();
                WebReq = null;
                fail = 0; //consegue conexão à internet
                return fail;
            }

            catch
            {
                MessageBox.Show("Não existe nenhuma ligação à internet.\n\nLiga-te à internet e tenta de novo.", "Erro de ligação!", MessageBoxButtons.OK, MessageBoxIcon.Error);
                WebReq = null;
                fail = 1; //falhou a conexão à internet
                return fail;
            }
        }
    }
}