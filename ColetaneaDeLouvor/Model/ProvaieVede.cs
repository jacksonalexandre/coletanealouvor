using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ColetaneaDeLouvor.Model
{
    //CLASSE PARA INSERIR O NOME DE TODOS OS VÍDEOS DO PROVAI E VEDE
    public class ProvaieVede
    {        
        public static List<string> Sabado(string mesExtenso)
        {
            List<string> video = new List<string>();
            switch (mesExtenso)
            {
                case "janeiro":
                    video.Add("04_Janeiro – Uma Exceção.mp4");
                    video.Add("11_Janeiro – A hora da decisão.mp4");
                    video.Add("18_Janeiro – Mão na massa.mp4");
                    video.Add("25_Janeiro – Garota nota 10.mp4");
                    break;
                case "fevereiro":
                    video.Add("01_Fevereiro – Profissão e missão.mp4");
                    video.Add("08_Fevereiro – Mar aceso.mp4");
                    video.Add("15_Fevereiro – Fiel ladrão.mp4");
                    video.Add("22_Fevereiro – Missionário contribuinte.mp4");
                    video.Add("29_Fevereiro – De olho nas necessidades.mp4");
                    break;
                case "março":
                    video.Add("07_Três_irmas_O_mesmo_sonho.mp4");
                    video.Add("14_Bíblia_bola.mp4");
                    video.Add("21_Juventude_dedicada.mp4");
                    video.Add("28_O_descobrimento_da_graça.mp4");
                    break;
                case "abril":
                    video.Add("04_Ouvidos_atentos.mp4");
                    video.Add("11_Refrigério_que_vem_do_sol.mp4");
                    video.Add("18_Coração_aquecido.mp4");
                    video.Add("25_De mineiro_a_chef.mp4");
                    break;
                case "maio":
                    video.Add("02_Uma festa para as primícias.mp4");
                    video.Add("09_Sopa de amor.mp4");
                    video.Add("16_Esperança em Porto.mp4");
                    video.Add("23_Desenvolvimento dos dons.mp4");
                    video.Add("30_Impacto esperança.mp4");
                    break;
                case "junho":
                    video.Add("06_Anunciada.mp4");
                    video.Add("13_Resposta no lixo.mp4");
                    video.Add("20_Esperança para Jesus.mp4");
                    video.Add("27_Motivação no desafio.mp4");
                    break;
                case "julho":
                    video.Add("04_Ofertas para Tusgal.mp4");
                    video.Add("11_O desafio de Hana.mp4");
                    video.Add("18_Baterias carregadas.mp4");
                    video.Add("25_Uma chama acesa.mp4");
                    break;
                case "agosto":
                    video.Add("01_Meu talento meu ministério.mp4");
                    video.Add("08_Esperança rasgada.mp4");
                    video.Add("15_Dificuldade costurada.mp4");
                    video.Add("22_Liberdade religiosa.mp4");
                    video.Add("29_De olho na missão.mp4");
                    break;
                case "setembro":
                    video.Add("05_Desejo atendido.mp4");
                    video.Add("12_Luzeiros da Fronteira.mp4");
                    video.Add("19_Transferência oportuna.mp4");
                    video.Add("26_Grau 6 – Doze minutos.mp4");
                    break;
                case "outubro":
                    video.Add("03_Mudança radical.mp4");
                    video.Add("10_Doze mil cartazes.mp4");
                    video.Add("17_Fogo de todos os lados.mp4");
                    video.Add("24_Nada é definitivo.mp4");
                    video.Add("31_Dupla consagração.mp4");
                    break;
                case "novembro":
                    video.Add("07_Fidelidade no tempo.mp4");
                    video.Add("14_Uma vida em missão.mp4");
                    video.Add("21_Boa reputação.mp4");
                    video.Add("28_Frigideira contaminada.mp4");
                    break;
                case "dezembro":
                    video.Add("05_Remédios que salvam.mp4");
                    video.Add("12_Gratidão em primeiro lugar.mp4");
                    video.Add("19_Decisão na crise.mp4");
                    video.Add("26_Vaso quebrado.mp4");
                    break;
                default:
                    break;
            }
            return video;
        }
        
        public static List<string> Quarta(string mesExtenso)
        {
            List<string> video = new List<string>();
            switch (mesExtenso)
            {
                case "janeiro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "fevereiro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "março":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "abril":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "maio":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "junho":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "julho":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "agosto":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "setembro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "outubro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "novembro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "dezembro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                default:
                    break;
            }            
            return video;
        }

        public static List<string> Domingo(string mesExtenso)
        {
            List<string> video = new List<string>();
            switch (mesExtenso)
            {
                case "janeiro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "fevereiro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "março":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "abril":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "maio":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "junho":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "julho":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "agosto":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "setembro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "outubro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "novembro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                case "dezembro":
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    video.Add("");
                    break;
                default:
                    break;
            }
            return video;
        }
    }
}