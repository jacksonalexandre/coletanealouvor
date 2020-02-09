using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace ColetaneaDeLouvor.DAO
{
    public class ScreenProperties
    {
        public static bool hasMoreThanOneScreen()
        {
            return Screen.AllScreens.Length > 1;
        }

        public static int numberOfScreens()
        {
            return Screen.AllScreens.Length;
        }

        public static Rectangle getCurrentScreenBounds()
        {
            return Screen.PrimaryScreen.Bounds;
        }

        public static int getCurrentScreenX()
        {
            return Screen.PrimaryScreen.Bounds.X;
        }

        public static int getCurrentScreenY()
        {
            return Screen.PrimaryScreen.Bounds.Y;
        }

        public static int getCurrentScreenWidth()
        {
            return Screen.PrimaryScreen.Bounds.Width;
        }

        public static int getCurrentScreenHeight()
        {
            return Screen.PrimaryScreen.Bounds.Height;
        }

        public static Size getCurrentScreenResolution()
        {
            Rectangle rec = Screen.PrimaryScreen.Bounds;
            return new Size(rec.Width, rec.Height);
        }

        public static Point getCurrentScreenLocation()
        {
            Rectangle rec = Screen.PrimaryScreen.Bounds;
            return new Point(rec.X, rec.Y);
        }

        public static string getCurrentScreenName()
        {
            return Screen.PrimaryScreen.DeviceName;
        }

        public static Rectangle getScreenBounds(int index)
        {
            IEnumerator ie = Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as Screen).DeviceName) == index)
                {
                    return (ie.Current as Screen).Bounds;
                }
            }
            return new Rectangle();
        }

        public static int getScreenX(int index)
        {
            IEnumerator ie = Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as Screen).Bounds;
                    return rec.X;
                }
            }
            return 0;
        }

        public static int getScreenY(int index)
        {
            IEnumerator ie = Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as Screen).Bounds;
                    return rec.Y;
                }
            }
            return 0;
        }

        public static Size getScreenResolution(int index)
        {
            IEnumerator ie = Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as Screen).Bounds;
                    return new Size(rec.Width, rec.Height);
                }
            }
            return new Size();
        }

        public static Point getScreenLocation(int index)
        {
            IEnumerator ie = Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as Screen).Bounds;
                    return new Point(rec.X, rec.Y);
                }
            }
            return new Point();
        }

        public static int getScreenWidth(int index)
        {
            IEnumerator ie = Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as Screen).Bounds;
                    return rec.Width;
                }
            }
            return 0;
        }

        public static int getScreenHeight(int index)
        {
            IEnumerator ie = Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if (getIndexFromName((ie.Current as Screen).DeviceName) == index)
                {
                    Rectangle rec = (ie.Current as Screen).Bounds;
                    return rec.Height;
                }
            }
            return 0;
        }

        //RETORNAR O NÚMERO DA TELA PRIMÁRIA
        public static int getScreenIndex()
        {
            IEnumerator ie = Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if ((ie.Current as Screen).Primary == true)
                {
                    return getIndexFromName((ie.Current as Screen).DeviceName);
                }
            }
            return 0;
        }

        //RETORNAR O NÚMERO DA TELA NÃO PRIMÁRIA
        public static int getScreenSecondary()
        {
            IEnumerator ie = Screen.AllScreens.GetEnumerator();
            while (ie.MoveNext())
            {
                if ((ie.Current as Screen).Primary == false)
                {
                    return getIndexFromName((ie.Current as Screen).DeviceName);
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
        public static List<Screen> getAllScreens()
        {
            IEnumerator ie = Screen.AllScreens.GetEnumerator();
            List<Screen> screens = new List<Screen>();
            while (ie.MoveNext())
            {
                screens.Add((ie.Current as Screen));
            }
            return screens;
        }
    }
}
