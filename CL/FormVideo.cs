using System;
using System.Windows.Forms;

namespace LouvorJA
{
    public partial class FormVideo : Form, IMessageFilter
    {
        public FormVideo()
        {
            InitializeComponent();
            Application.AddMessageFilter(this);
        }

        public void abrir(string caminho)
        {
            showOnScreen(1);
            ax.URL = caminho;
            //ax.uiMode = "none";
            ax.Ctlcontrols.play();
            Show();
        }
        void atalhos(Keys o)
        {
            switch (o)
            {
                case Keys.Escape:
                    this.Close();
                    break;
                case Keys.Space:
                    if (ax.playState == WMPLib.WMPPlayState.wmppsPlaying)
                        ax.Ctlcontrols.pause();
                    else
                        ax.Ctlcontrols.play();
                    break;
            }
        }

        void showOnScreen(int screenNumber)
        {
            Screen[] screens = Screen.AllScreens;

            if (screenNumber >= 0 && screenNumber < screens.Length)
            {
                bool maximised = false;
                if (WindowState == FormWindowState.Maximized)
                {
                    WindowState = FormWindowState.Normal;
                    maximised = true;
                }
                this.Location = screens[screenNumber].WorkingArea.Location;
                if (maximised)
                {
                    WindowState = FormWindowState.Maximized;
                }
            }
        }

        void ax_PlayStateChange(object sender, AxWMPLib._WMPOCXEvents_PlayStateChangeEvent e)
        {
            switch (e.newState)
            {
                case 3: //Playing
                    ax.fullScreen = true;
                    break;
                case 8: //MediaEnded
                    Close();
                    break;
            }
        }

        void ax_KeyDownEvent(object sender, AxWMPLib._WMPOCXEvents_KeyDownEvent e)
        {
            atalhos((Keys)e.nKeyCode);
        }

        #region IMessageFilter Members
        const UInt32 WM_KEYDOWN = 0x0100;
        public bool PreFilterMessage(ref Message m)
        {
            if (m.Msg == WM_KEYDOWN)
            {
                Keys keyCode = (Keys)(int)m.WParam & Keys.KeyCode;
                if (keyCode == Keys.Escape)
                {
                    Close();
                    return true;
                }
            }
            return false;
        }
        #endregion

        void FormVideo_FormClosing(object sender, FormClosingEventArgs e)
        {
            Application.RemoveMessageFilter(this);
        }
    }
}