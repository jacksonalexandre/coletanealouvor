using ColetaneaDeLouvor.Model;
using Microsoft.Office.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Graph = Microsoft.Office.Interop.Graph;
using PowerPoint = Microsoft.Office.Interop.PowerPoint;

namespace ColetaneaDeLouvor.DAO
{
    public class ApresentacaoSlide
    {
        public void ShowPresentation(List<Culto> lista)
        {
            String strTemplate, strPic, imgPreludio, imgInvocacao, imgBoasVindas, imgAdoracaoInfantil, imgComunicacao, imgMensagemMusical, imgLouvorCongregacional, imgOracaoIntercessora, imgSermao, imgBencaoFinal, imgOutros;
            strTemplate = "C:\\Program Files\\Microsoft Office\\Document Themes 15\\Office Theme.thmx";

            //PEGANDO O ENDEREÇO DAS IMAGENS NA PASTA 'C:\ArquivosDoxologia'
            imgPreludio = "C:\\ArquivosDoxologia\\preludio.jpg";
            imgInvocacao = "C:\\ArquivosDoxologia\\invocacao.jpg";
            imgBoasVindas = "C:\\ArquivosDoxologia\\boas_vindas.jpg";
            imgAdoracaoInfantil = "C:\\ArquivosDoxologia\\adoracao_infantil.jpg";
            imgComunicacao = "C:\\ArquivosDoxologia\\comunicacao.jpg";
            imgMensagemMusical = "C:\\ArquivosDoxologia\\mensagem_musical.jpg";
            imgLouvorCongregacional = "C:\\ArquivosDoxologia\\louvor_congregacional.jpg";
            imgOracaoIntercessora = "C:\\ArquivosDoxologia\\oracao_intercessora.jpg";
            imgSermao = "C:\\ArquivosDoxologia\\sermao.jpg";
            imgBencaoFinal = "C:\\ArquivosDoxologia\\bencao_final.jpg";
            imgOutros = "C:\\ArquivosDoxologia\\outros.jpg";

            bool bAssistantOn;

            PowerPoint.Application objApp;
            PowerPoint.Presentations objPresSet;
            PowerPoint._Presentation objPres;
            PowerPoint.Slides objSlides;
            PowerPoint._Slide objSlide;
            PowerPoint.TextRange objTextRng;
            PowerPoint.Shapes objShapes;
            PowerPoint.Shape objShape;
            PowerPoint.SlideShowWindows objSSWs;
            PowerPoint.SlideShowTransition objSST;
            PowerPoint.SlideShowSettings objSSS;
            PowerPoint.SlideRange objSldRng;
            Graph.Chart objChart;

            //Criar uma nova apresentação baseado no template
            objApp = new PowerPoint.Application();
            objApp.Visible = MsoTriState.msoTrue;
            objPresSet = objApp.Presentations;
            objPres = objPresSet.Open(strTemplate,
                MsoTriState.msoFalse, MsoTriState.msoTrue, MsoTriState.msoTrue);
            objSlides = objPres.Slides;

            int contador = 0; //Contador do próximo slide   

            foreach (Culto result in lista.OrderBy(l => l.OrdemCulto))
            {
                //Construindo os Slides de acordo com a lista

                contador += 1; //Próximo slide

                //Add novo slide
                objSlide = objSlides.Add(contador, PowerPoint.PpSlideLayout.ppLayoutBlank);
                objShapes = objSlide.Shapes;

                //Add o fundo de cada slide de acordo com o ítem
                if (result.SlideCulto == "Prelúdio" || result.SlideCulto == "Ofertório" || result.SlideCulto == "Saída do Culto")
                    objSlide.Shapes.AddPicture(imgPreludio, MsoTriState.msoFalse, MsoTriState.msoTrue, 0, 0, 960, 540);
                else
                {
                    if (result.SlideCulto == "Invocação")
                        objSlide.Shapes.AddPicture(imgInvocacao, MsoTriState.msoFalse, MsoTriState.msoTrue, 0, 0, 960, 540);
                    else
                    {
                        if (result.SlideCulto == "Boas Vindas")
                            objSlide.Shapes.AddPicture(imgBoasVindas, MsoTriState.msoFalse, MsoTriState.msoTrue, 0, 0, 960, 540);
                        else
                        {
                            if (result.SlideCulto == "Adoração Infantil")
                                objSlide.Shapes.AddPicture(imgAdoracaoInfantil, MsoTriState.msoFalse, MsoTriState.msoTrue, 0, 0, 960, 540);
                            else
                            {
                                if (result.SlideCulto == "Comunicação")
                                    objSlide.Shapes.AddPicture(imgComunicacao, MsoTriState.msoFalse, MsoTriState.msoTrue, 0, 0, 960, 540);
                                else
                                {
                                    if (result.SlideCulto == "Mensagem Musical 1" || result.SlideCulto == "Mensagem Musical 2")
                                        objSlide.Shapes.AddPicture(imgMensagemMusical, MsoTriState.msoFalse, MsoTriState.msoTrue, 0, 0, 960, 540);
                                    else
                                    {
                                        if (result.SlideCulto == "Louvor Congregacional")
                                            objSlide.Shapes.AddPicture(imgLouvorCongregacional, MsoTriState.msoFalse, MsoTriState.msoTrue, 0, 0, 960, 540);
                                        else
                                        {
                                            if (result.SlideCulto == "Oração Intercessora")
                                                objSlide.Shapes.AddPicture(imgOracaoIntercessora, MsoTriState.msoFalse, MsoTriState.msoTrue, 0, 0, 960, 540);
                                            else
                                            {
                                                if (result.SlideCulto == "Sermão")
                                                    objSlide.Shapes.AddPicture(imgSermao, MsoTriState.msoFalse, MsoTriState.msoTrue, 0, 0, 960, 540);
                                                else
                                                {
                                                    if (result.SlideCulto == "Benção Final")
                                                        objSlide.Shapes.AddPicture(imgBencaoFinal, MsoTriState.msoFalse, MsoTriState.msoTrue, 0, 0, 960, 540);
                                                    else
                                                    {
                                                        objSlide.Shapes.AddPicture(imgOutros, MsoTriState.msoFalse, MsoTriState.msoTrue, 0, 0, 960, 540);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                //Add a forma do ítem             
                objShape = objShapes.AddTextbox(MsoTextOrientation.msoTextOrientationHorizontal, 240, 45, 600, 400); //Esquerda,superior,largura,altura
                //Add texto, fonte, tamanho e negrito
                objShape.TextEffect.Text = result.SlideCulto;
                objShape.TextEffect.FontName = "Essai";
                objShape.TextEffect.Alignment = MsoTextEffectAlignment.msoTextEffectAlignmentCentered;
                objShape.TextEffect.FontSize = 45;
                objShape.TextEffect.FontBold = MsoTriState.msoCTrue;
                objShape.TextEffect.FontItalic = MsoTriState.msoFalse;
                objShape.TextEffect.PresetTextEffect = MsoPresetTextEffect.msoTextEffect11;

                if (result.SlideCulto == "Prelúdio" || result.SlideCulto == "Ofertório" || result.SlideCulto == "Saída do Culto")
                {
                    //Add a forma das músicas 'Prelúdio' ou 'Ofertório' ou 'Saída do Culto'
                    objShape = objShapes.AddTextbox(MsoTextOrientation.msoTextOrientationHorizontal, 150, 150, 700, 650);
                    objShape.TextEffect.Text = result.ResponsavelCulto;
                    objShape.TextEffect.FontName = "Century Gothic";
                    objShape.TextEffect.FontSize = 39;
                    objShape.TextEffect.FontBold = MsoTriState.msoFalse;
                    objShape.TextEffect.FontItalic = MsoTriState.msoCTrue;
                    objShape.TextEffect.Alignment = MsoTextEffectAlignment.msoTextEffectAlignmentCentered;
                    objShape.TextEffect.PresetTextEffect = MsoPresetTextEffect.msoTextEffect1;
                }
                else
                {
                    //Add a forma do responsável
                    objShape = objShapes.AddTextbox(MsoTextOrientation.msoTextOrientationHorizontal, 0, 250, 650, 400);
                    //Add texto, fonte, tamanho e negrito
                    objShape.TextEffect.Text = result.ResponsavelCulto;
                    objShape.TextEffect.FontName = "Century Gothic";
                    objShape.TextEffect.Alignment = MsoTextEffectAlignment.msoTextEffectAlignmentCentered;
                    objShape.TextEffect.FontSize = 60;
                    objShape.TextEffect.FontBold = MsoTriState.msoFalse;
                    objShape.TextEffect.FontItalic = MsoTriState.msoFalse;
                    objShape.TextEffect.PresetTextEffect = MsoPresetTextEffect.msoTextEffect1;

                    //Add a forma da igreja
                    objShape = objShapes.AddTextbox(MsoTextOrientation.msoTextOrientationHorizontal, 0, 350, 650, 400);
                    //Add texto, fonte, tamanho e negrito
                    objShape.TextEffect.Text = result.IgrejaCulto;
                    objShape.TextEffect.FontName = "Century Gothic";
                    objShape.TextEffect.Alignment = MsoTextEffectAlignment.msoTextEffectAlignmentCentered;
                    objShape.TextEffect.FontSize = 30;
                    objShape.TextEffect.FontBold = MsoTriState.msoCTrue;
                    objShape.TextEffect.FontItalic = MsoTriState.msoFalse;
                    objShape.TextEffect.PresetTextEffect = MsoPresetTextEffect.msoTextEffect4;
                }
                /*
                //Construindo o Slide #1:
                //Adicionando o texto no slide, mudando a fonte e inserindo a posição da imagem no primeiro slide.
                objSlide = objSlides.Add(1, PowerPoint.PpSlideLayout.ppLayoutTitleOnly);
                objTextRng = objSlide.Shapes[1].TextFrame.TextRange;
                objTextRng.Text = "Texto 01";
                objTextRng.Font.Name = "Comic Sans MS";
                objTextRng.Font.Size = 48;
                objTextRng.Font.Color.RGB = Color.Black.ToArgb();
                objSlide.Shapes.AddPicture(strPic, MsoTriState.msoFalse, MsoTriState.msoTrue,
                    150, 150, 500, 350);

                //Construindo o Slide #2:
                //Adicionando o texto no título do slide, formatação do texto. Também adicionando o gráfico no slide e mudando o tipo do gráfico de pizza.
                objSlide = objSlides.Add(2, PowerPoint.PpSlideLayout.ppLayoutTitleOnly);
                objTextRng = objSlide.Shapes[1].TextFrame.TextRange;
                objTextRng.Text = "Texto 02";
                objTextRng.Font.Name = "Comic Sans MS";
                objTextRng.Font.Size = 48;
                objChart = (Graph.Chart)objSlide.Shapes.AddOLEObject(150, 150, 480, 320,
                    "MSGraph.Chart.8", "", MsoTriState.msoFalse, "", 0, "",
                    MsoTriState.msoFalse).OLEFormat.Object;
                objChart.ChartType = Graph.XlChartType.xl3DPie;
                objChart.Legend.Position = Graph.XlLegendPosition.xlLegendPositionBottom;
                objChart.HasTitle = true;
                objChart.ChartTitle.Text = "Here it is...";

                //Construindo o Slide #3:
                //Mudando a cor de fundo slide atual. Adicionando efeito do texto no slide e aplicar vários esquemas de cores e sombras no texto com efeitos.
                objSlide = objSlides.Add(3, PowerPoint.PpSlideLayout.ppLayoutBlank);
                objSlide.FollowMasterBackground = MsoTriState.msoFalse;
                objShapes = objSlide.Shapes;
                objShape = objShapes.AddTextEffect(MsoPresetTextEffect.msoTextEffect27,
                  "The End", "Impact", 96, MsoTriState.msoFalse, MsoTriState.msoFalse, 230, 200);
                */
            }

            //Modificar a transição dos slides desta apresentação.
            int[] SlideIdx = new int[contador];
            for (int i = 0; i < contador; i++) SlideIdx[i] = i + 1;
            objSldRng = objSlides.Range(SlideIdx);
            objSST = objSldRng.SlideShowTransition; //Transição do slideshow
            objSST.AdvanceOnTime = MsoTriState.msoFalse; //Não passar para o próximo slide com tempo
            objSST.AdvanceOnClick = MsoTriState.msoCTrue; //Passar para o próximo slide com um click do mouse
            objSST.AdvanceTime = 3; //Tempo em segundos para passar ao próximo slide
            objSST.EntryEffect = PowerPoint.PpEntryEffect.ppEffectFade;//Efeito para iniciar o slideshow

            /*Previnir o Assistente do Office de exibir mensagem de alerta:
            bAssistantOn = objApp.Assistant.On;
            objApp.Assistant.On = true;*/

            //Abre a apresentação de Slides a partir do slide 1 ao 3.
            objSSS = objPres.SlideShowSettings;
            objSSS.StartingSlide = 1;
            objSSS.EndingSlide = contador;
            objSSS.Run();

            /*Aguarda a apresentação de slides para terminar.
            objSSWs = objApp.SlideShowWindows;
            while (objSSWs.Count >= 1) System.Threading.Thread.Sleep(3);*/

            /*Reativar o Assistente do Office se estiver em::
            if (bAssistantOn)
            {
                objApp.Assistant.On = true;
                objApp.Assistant.Visible = false;
            }*/

            /*Fecha a apresentação sem salvar as mudanças e fechar o PowerPoint.
            objPres.Close();
            objApp.Quit();*/
        }
    }
}