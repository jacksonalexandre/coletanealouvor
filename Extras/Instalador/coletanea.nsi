# Coletânea de Louvor

!include "MUI2.nsh"
!include "nsDialogs.nsh"
!include "LogicLib.nsh"

!define APP_NAME "Coletânea de Louvor"
!define APP_VERSION "2017.01"
!define PUBLISHER "Coletânea de Louvor"
!define WEBSITE "http://fb.com/coletanealouvor"
!define MUI_ICON "instalador.ico"
!define MUI_UNICON "uninstall.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "cabecalho.bmp"
!define MUI_ABORTWARNING

Name "${APP_NAME}"
Caption "${APP_NAME} ${APP_VERSION}"
OutFile "CL_${APP_VERSION}.exe"
InstallDir "C:\${APP_NAME}"
InstallDirRegKey HKLM "Software\${PUBLISHER}\${APP_NAME}" "installation_folder"
Icon "coletanea.ico"
UninstallIcon "uninstall.ico"
BRANDINGTEXT "Coletânea de Louvor"
SetCompressor lzma

RequestExecutionLevel admin
ShowInstDetails show

!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

!insertmacro MUI_LANGUAGE "PortugueseBR"

Section CheckUserAccount
    UserInfo::getAccountType
    Pop $0
    StrCmp $0 "Admin" +3
 
    MessageBox MB_OK|MB_ICONSTOP "Para instalar este software é preciso ser administrador."
	Quit
SectionEnd
Section "MainSection" SEC01
	SetOutPath $INSTDIR
	File "D:\Coletânea de Louvor\Coletânea de Louvor.exe"
	File "D:\Coletânea de Louvor\AxInterop.WMPLib.dll"
	File "D:\Coletânea de Louvor\Interop.WMPLib.dll"
SectionEnd


Section -Post
	WriteUninstaller "$INSTDIR\Uninstall.exe"
	WriteRegStr HKLM "Software\${PUBLISHER}\${APP_NAME}" "installation_folder" $INSTDIR
	WriteRegExpandStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
	WriteRegExpandStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "InstallLocation" "$INSTDIR"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayName" "${APP_NAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayIcon" "$INSTDIR\Coletânea de Louvor.Servico.exe,0"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayVersion" "${APP_VERSION}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "URLInfoAbout" "${WEBSITE}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "HelpLink" "${WEBSITE}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "Publisher" "${PUBLISHER}"
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoModify" "1"
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoRepair" "1"
	
	AccessControl::GrantOnFile "$INSTDIR" "(S-1-5-32-545)" "FullAccess"
	
	CreateShortCut "$DESKTOP\Coletânea de Louvor.lnk" "$INSTDIR\Coletânea de Louvor.exe" "" "$INSTDIR\Coletânea de Louvor.exe"
	CreateDirectory "$SMPROGRAMS\Coletânea de Louvor"
	CreateShortCut "$SMPROGRAMS\Coletânea de Louvor\Coletânea de Louvor.lnk" "$INSTDIR\Coletânea de Louvor.exe" "" "$INSTDIR\Coletânea de Louvor.exe"
	CreateShortCut "$SMPROGRAMS\Coletânea de Louvor\Desinstalar a Coletânea de Louvor.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Uninstall"

	SetDetailsPrint textonly
	DetailPrint "Unregister service"
	SetDetailsPrint none
	
	Delete "$INSTDIR\Uninstall.exe"
	Delete "$INSTDIR\Coletânea de Louvor.exe"
	
	DeleteRegValue HKLM "Software\${PUBLISHER}\${APP_NAME}" "installation_folder"
	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
	DeleteRegKey HKLM "Software\Coletânea de Louvor"
	
	Delete "$DESKTOP\Coletânea de Louvor.lnk"
	RMDir /r "$SMPROGRAMS\Coletânea de Louvor"
SectionEnd