Add-Type -AssemblyName System.Drawing

# Gera o logo e os ícones a partir da arte original (marcas brancas sobre fundo azul).
# Uso: pwsh scripts/generate-icons.ps1
$proj  = Split-Path -Parent $PSScriptRoot
$pub   = Join-Path $proj "public"
$asset = Join-Path $proj "src\assets"
$src   = Join-Path $asset "logo-source.jpg"
New-Item -ItemType Directory -Force -Path $asset | Out-Null

$bg = [System.Drawing.Color]::FromArgb(255, 0, 22, 59)

# 1. Versão transparente da arte: fundo azul vira alfa, traços viram branco puro.
$orig = [System.Drawing.Bitmap]::FromFile($src)
$w = $orig.Width; $h = $orig.Height
$flat = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$rectSrc = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$dSrc = $orig.LockBits($rectSrc, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dDst = $flat.LockBits($rectSrc, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$len = $dSrc.Stride * $h
$buf = New-Object byte[] $len
[System.Runtime.InteropServices.Marshal]::Copy($dSrc.Scan0, $buf, 0, $len)

$lumBg = 0.2126 * $bg.R + 0.7152 * $bg.G + 0.0722 * $bg.B
for ($i = 0; $i -lt $len; $i += 4) {
  $b = $buf[$i]; $g = $buf[$i+1]; $r = $buf[$i+2]
  $lum = 0.2126 * $r + 0.7152 * $g + 0.0722 * $b
  $t = ($lum - $lumBg) / (255 - $lumBg)
  if ($t -lt 0.08) { $t = 0 } else { $t = ($t - 0.08) / 0.92 }
  if ($t -gt 1) { $t = 1 }
  $a = [byte][math]::Round($t * 255)
  $buf[$i] = 255; $buf[$i+1] = 255; $buf[$i+2] = 255; $buf[$i+3] = $a
}
[System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $dDst.Scan0, $len)
$orig.UnlockBits($dSrc)
$flat.UnlockBits($dDst)
$orig.Dispose()

function Save-Scaled([System.Drawing.Bitmap]$bmp, [int]$maxW, [string]$path) {
  $scale = $maxW / $bmp.Width
  $nw = [int][math]::Round($bmp.Width * $scale)
  $nh = [int][math]::Round($bmp.Height * $scale)
  $out = New-Object System.Drawing.Bitmap($nw, $nh, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gfx = [System.Drawing.Graphics]::FromImage($out)
  $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $gfx.Clear([System.Drawing.Color]::Transparent)
  $gfx.DrawImage($bmp, (New-Object System.Drawing.Rectangle(0, 0, $nw, $nh)))
  $gfx.Dispose()
  $out.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
  "wrote $path ($nw x $nh)"
}

Save-Scaled $flat 512 (Join-Path $asset "logo.png")

function Save-Square([System.Drawing.Bitmap]$bmp, [int]$size, [double]$inset, [bool]$withBg, [int]$radius, [string]$path) {
  $out = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gfx = [System.Drawing.Graphics]::FromImage($out)
  $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $gfx.Clear([System.Drawing.Color]::Transparent)
  if ($withBg) {
    $brush = New-Object System.Drawing.SolidBrush($bg)
    if ($radius -gt 0) {
      $p = New-Object System.Drawing.Drawing2D.GraphicsPath
      $d = $radius * 2
      $p.AddArc(0, 0, $d, $d, 180, 90)
      $p.AddArc($size - $d, 0, $d, $d, 270, 90)
      $p.AddArc($size - $d, $size - $d, $d, $d, 0, 90)
      $p.AddArc(0, $size - $d, $d, $d, 90, 90)
      $p.CloseFigure()
      $gfx.FillPath($brush, $p)
      $p.Dispose()
    } else {
      $gfx.FillRectangle($brush, 0, 0, $size, $size)
    }
    $brush.Dispose()
  }
  $avail = $size * (1 - 2 * $inset)
  $scale = [math]::Min($avail / $bmp.Width, $avail / $bmp.Height)
  $nw = $bmp.Width * $scale
  $nh = $bmp.Height * $scale
  $x = ($size - $nw) / 2
  $y = ($size - $nh) / 2
  $gfx.DrawImage($bmp, (New-Object System.Drawing.RectangleF($x, $y, $nw, $nh)))
  $gfx.Dispose()
  $out.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
  "wrote $path ($size x $size)"
}

Save-Square $flat 512 0.08 $true 0    (Join-Path $pub "icon-512.png")
Save-Square $flat 192 0.08 $true 0    (Join-Path $pub "icon-192.png")
Save-Square $flat 512 0.22 $true 0    (Join-Path $pub "icon-maskable-512.png")
Save-Square $flat 180 0.10 $true 0    (Join-Path $pub "apple-touch-icon.png")
Save-Square $flat 32  0.06 $true 0    (Join-Path $pub "favicon-32.png")
Save-Square $flat 16  0.04 $true 0    (Join-Path $pub "favicon-16.png")
Save-Square $flat 48  0.06 $true 0    (Join-Path $pub "favicon-48.png")

$flat.Dispose()

# 2. favicon.ico com 16/32/48 embutidos (PNG dentro do container ICO).
$icoSizes = @(16, 32, 48)
$entries = @()
foreach ($s in $icoSizes) {
  $entries += ,(@{ size = $s; bytes = [System.IO.File]::ReadAllBytes((Join-Path $pub "favicon-$s.png")) })
}
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($ms)
$bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]$entries.Count)
$offset = 6 + 16 * $entries.Count
foreach ($e in $entries) {
  $bw.Write([byte]$e.size); $bw.Write([byte]$e.size)
  $bw.Write([byte]0); $bw.Write([byte]0)
  $bw.Write([uint16]1); $bw.Write([uint16]32)
  $bw.Write([uint32]$e.bytes.Length)
  $bw.Write([uint32]$offset)
  $offset += $e.bytes.Length
}
foreach ($e in $entries) { $bw.Write($e.bytes) }
$bw.Flush()
[System.IO.File]::WriteAllBytes((Join-Path $pub "favicon.ico"), $ms.ToArray())
$bw.Dispose(); $ms.Dispose()
"wrote $(Join-Path $pub 'favicon.ico')"
