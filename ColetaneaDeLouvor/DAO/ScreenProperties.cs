using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ColetaneaDeLouvor.DAO
{
    public class ScreenProperties
    {
        public static bool hasMoreThanOneScreen()
        {
            return System.Windows.Forms.Screen.AllScreens.Length > 1;
        }

        public static int numberOfScreens()
        {
            return System.Windows.Forms.Screen.AllScreens.Length;
        }

        public static Rectangle getCurrentScreenBounds()
        {
            return System.Windows.Forms.Screen.PrimaryScreen.Bounds;
        }

        public static int getCurrentScreenX()
        {
            return System.Windows.Forms.Screen.PrimaryScreen.Bounds.X;
        }

        public static int getCurrentScreenY()
        {
            return System.Windows.Forms.Screen.PrimaryScreen.Bounds.Y;
        }

        public static int getCurrentScreenWidth()
        {
            return System.Windows.Forms.Screen.PrimaryScreen.Bounds.Width;
        }

        public static int getCurrentScreenHeight()
        {
            return System.Windows.Forms.Screen.PrimaryScreen.Bounds.Height;
        }

        public static Size getCurrentScreenResolution()
        {
            Rectangle rec = System.Windows.Forms.Screen.PrimaryScreen.Bounds;
            return new Size(rec.Width, rec.Height);
        }

        public static Point getCurrentScreenLocation()
        {
            Rectangle rec = System.Windows.Forms.Screen.PrimaryScreen.Bounds;
            return new Point(rec.X, rec.Y);
        }

        public static string getCurrentScreenName()
        {
            return System.Windows.Forms.Screen.PrimaryScreen.DeviceName;
        }

        public static Rectangle getScreenBounds(int index)
        {
            IEnumerator ie = System.Windows.Forms.Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as System.Windows.Forms.Screen).DeviceName) == index)
                {
                    return (ie.Current as System.Windows.Forms.Screen).Bounds;
                }
            }
            return new Rectangle();
        }

        public static int getScreenX(int index)
        {
            IEnumerator ie = System.Windows.Forms.Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as System.Windows.Forms.Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as System.Windows.Forms.Screen).Bounds;
                    return rec.X;
                }
            }
            return 0;
        }

        public static int getScreenY(int index)
        {
            IEnumerator ie = System.Windows.Forms.Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as System.Windows.Forms.Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as System.Windows.Forms.Screen).Bounds;
                    return rec.Y;
                }
            }
            return 0;
        }

        public static Size getScreenResolution(int index)
        {
            IEnumerator ie = System.Windows.Forms.Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as System.Windows.Forms.Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as System.Windows.Forms.Screen).Bounds;
                    return new Size(rec.Width, rec.Height);
                }
            }
            return new Size();
        }

        public static Point getScreenLocation(int index)
        {
            IEnumerator ie = System.Windows.Forms.Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as System.Windows.Forms.Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as System.Windows.Forms.Screen).Bounds;
                    return new Point(rec.X, rec.Y);
                }
            }
            return new Point();
        }

        public static int getScreenWidth(int index)
        {
            IEnumerator ie = System.Windows.Forms.Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as System.Windows.Forms.Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as System.Windows.Forms.Screen).Bounds;
                    return rec.Width;
                }
            }
            return 0;
        }

        public static int getScreenHeight(int index)
        {
            IEnumerator ie = System.Windows.Forms.Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as System.Windows.Forms.Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as System.Windows.Forms.Screen).Bounds;
                    return rec.Height;
                }
            }
            return 0;
        }

        //RETORNAR O NÚMERO DA TELA PRIMÁRIA
        public static int getScreenIndex()
        {
            IEnumerator ie = System.Windows.Forms.Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if ((ie.Current as System.Windows.Forms.Screen).Primary == true)
                {
                    return getIndexFromName((ie.Current as System.Windows.Forms.Screen).DeviceName);
                }
            }
            return 0;
        }

        //RETORNAR O NÚMERO DA TELA NÃO PRIMÁRIA
        public static int getScreenSecondary()
        {
            IEnumerator ie = System.Windows.Forms.Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if ((ie.Current as System.Windows.Forms.Screen).Primary == false)
                {
                    return getIndexFromName((ie.Current as System.Windows.Forms.Screen).DeviceName);
                }
            }
            return 0;
        }

        //RETORNAR O NÚMERO DA TELA DE ACORDO COM O QUE O USUÁRIO ESCOLHEU
        public static int getIndexFromName(string name)
        {
            return Convert.ToInt32(string.Join(null, System.Text.RegularExpressions.Regex.Split(name, "[^\\d]")));
        }

        //LISTAR TODAS AS TELAS
        public static List<System.Windows.Forms.Screen> getAllScreens()
        {
            IEnumerator ie = System.Windows.Forms.Screen.AllScreens.GetEnumerator();
            List<System.Windows.Forms.Screen> screens = new List<System.Windows.Forms.Screen>();
            while (ie.MoveNext())
            {
                screens.Add((ie.Current as System.Windows.Forms.Screen));
            }
            return screens;
        }
    }
}
