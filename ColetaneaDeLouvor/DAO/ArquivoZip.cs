using Ionic.Zip;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ColetaneaDeLouvor.DAO
{
    public class ArquivoZip
    {
        public static void ExtrairArquivoZip(string localizacaoArquivoZip, string destino)
        {
            if (File.Exists(localizacaoArquivoZip))
            {
                //recebe a localização do arquivo zip
                using (ZipFile zip = new ZipFile(localizacaoArquivoZip))
                {
                    //verifica se o destino existe
                    if (Directory.Exists(destino))
                    {
                        try
                        {
                            //extrai o arquivo zip para o destino
                            zip.ExtractAll(destino);                            
                        }
                        catch
                        {
                            throw;
                        }
                    }
                    else
                    {
                        //lança uma exceção se o destino não existe
                        throw new DirectoryNotFoundException("O arquivo destino não foi localizado");
                    }
                }
            }
            else
            {
                //lança uma exceção se a origem não existe
                System.Windows.Forms.MessageBox.Show("Um erro ocorreu ao executar a Coletânea de Louvor.\nPara corrigir, precisamos realizar o download do arquivo de Dados.", "Falha na execução do programa!", System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Error);
                //Fecha o programa
                Process[] processes = Process.GetProcessesByName("ColetaneaDeLouvor");
                foreach (Process process in processes)
                {
                    process.Kill();
                }
                //throw new FileNotFoundException("O Arquivo Zip não foi localizado");
            }
        }
    }
}
