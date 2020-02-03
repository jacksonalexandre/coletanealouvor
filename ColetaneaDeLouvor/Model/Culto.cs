using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ColetaneaDeLouvor.Model
{
    public class Culto
    {
        public int IdCulto { get; set; }
        public int OrdemCulto { get; set; }
        public string ResponsavelCulto { get; set; }
        public string IgrejaCulto { get; set; }
        public string SlideCulto { get; set; }
        public byte[] FotoCulto { get; set; }
    }

    //AQUI ESTÃO AS SUBCLASSES PARA A APRESENTAÇÃO EM POWERPOINT
    public class Slide01 : Culto { }
    public class Slide02 : Culto { }
    public class Slide03 : Culto { }
    public class Slide04 : Culto { }
    public class Slide05 : Culto { }
    public class Slide06 : Culto { }
    public class Slide07 : Culto { }
    public class Slide08 : Culto { }
    public class Slide09 : Culto { }
    public class Slide10 : Culto { }
    public class Slide11 : Culto { }
    public class Slide12 : Culto { }
    public class Slide13 : Culto { }
    public class Slide14 : Culto { }
    public class Slide15 : Culto { }
    public class Slide16 : Culto { }
    public class Slide17 : Culto { }
    public class Slide18 : Culto { }
    public class Slide19 : Culto { }
    public class Slide20 : Culto { }

    //SUBCLASSES EXTRAS PARA A 2ª PARTE DO PRELÚDIO E OFERTÓRIO
    public class Slide21 : Culto { }
    public class Slide22 : Culto { }
}