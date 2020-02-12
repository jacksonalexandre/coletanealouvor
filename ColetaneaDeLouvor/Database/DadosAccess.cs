using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ColetaneaDeLouvor.Database
{
    public class DadosAccess
    {
        public static string Dados()
        {
            string result = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=Dados.mdb;Persist Security Info=True;Jet OLEDB:Database Password=Colet*20;";
            return result;
        }

        public static string LinkServidor()
        {
            string result = "http://www.coletanealouvor.com.br/files/";
            return result;
        }
    }
}
