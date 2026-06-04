Add-Type -AssemblyName System.Drawing

function Get-SvgInfo {
    param([string]$Path)

    [xml]$svg = Get-Content -LiteralPath $Path -Raw
    $root = $svg.svg
    $viewBox = (($root.viewBox -split '\s+') | ForEach-Object { [double]$_ })
    if ($viewBox.Count -ne 4) {
        throw "SVG sem viewBox valido: $Path"
    }

    $paths = @()
    $nodeList = $svg.GetElementsByTagName("path")
    foreach ($node in $nodeList) {
        $strokeWidth = 0.0
        if ($node.'stroke-width') {
            $strokeWidth = [double]$node.'stroke-width'
        }

        $paths += [pscustomobject]@{
            Data = [string]$node.d
            FillRule = if ($node.'fill-rule') { [string]$node.'fill-rule' } else { "nonzero" }
            IsStroke = [bool]$node.stroke -or $strokeWidth -gt 0
            StrokeWidth = if ($strokeWidth -gt 0) { $strokeWidth } else { 1.0 }
            TranslateX = (Get-SvgTranslate -Node $node).X
            TranslateY = (Get-SvgTranslate -Node $node).Y
        }
    }

    [pscustomobject]@{
        ViewBox = $viewBox
        Paths = $paths
    }
}

function Get-SvgTranslate {
    param($Node)

    $x = 0.0
    $y = 0.0
    $current = $Node
    while ($null -ne $current) {
        if ($current.transform) {
            $matches = [regex]::Matches([string]$current.transform, 'translate\(\s*([-+]?(?:\d*\.\d+|\d+\.?))\s*(?:,|\s)\s*([-+]?(?:\d*\.\d+|\d+\.?))?\s*\)')
            foreach ($match in $matches) {
                $x += [double]::Parse($match.Groups[1].Value, [Globalization.CultureInfo]::InvariantCulture)
                if ($match.Groups[2].Success -and $match.Groups[2].Value) {
                    $y += [double]::Parse($match.Groups[2].Value, [Globalization.CultureInfo]::InvariantCulture)
                }
            }
        }
        $current = $current.ParentNode
    }

    [pscustomobject]@{ X = $x; Y = $y }
}

function Remove-FakeCheckerBackground {
    param([System.Drawing.Bitmap]$Bitmap)

    for ($x = 0; $x -lt $Bitmap.Width; $x++) {
        for ($y = 0; $y -lt $Bitmap.Height; $y++) {
            $pixel = $Bitmap.GetPixel($x, $y)
            if ($pixel.R -gt 218 -and $pixel.G -gt 218 -and $pixel.B -gt 218) {
                $Bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $pixel.R, $pixel.G, $pixel.B))
            }
        }
    }
}

function Get-PathTokens {
    param([string]$Data)
    $matches = [regex]::Matches($Data, '[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?')
    $tokens = New-Object System.Collections.Generic.List[string]
    foreach ($match in $matches) {
        $tokens.Add($match.Value)
    }
    $tokens
}

function Test-CommandToken {
    param([string]$Token)
    return $Token -match '^[a-zA-Z]$'
}

function Read-Number {
    param(
        [System.Collections.Generic.List[string]]$Tokens,
        [ref]$Index
    )
    $value = [double]::Parse($Tokens[$Index.Value], [Globalization.CultureInfo]::InvariantCulture)
    $Index.Value++
    $value
}

function New-SvgGraphicsPath {
    param(
        [string]$Data,
        [string]$FillRule
    )

    $tokens = Get-PathTokens -Data $Data
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $path.FillMode = if ($FillRule -eq "evenodd") {
        [System.Drawing.Drawing2D.FillMode]::Alternate
    } else {
        [System.Drawing.Drawing2D.FillMode]::Winding
    }

    $i = 0
    $cmd = ''
    $x = 0.0
    $y = 0.0
    $startX = 0.0
    $startY = 0.0

    while ($i -lt $tokens.Count) {
        if (Test-CommandToken $tokens[$i]) {
            $cmd = $tokens[$i]
            $i++
        }

        $relative = $cmd -ceq $cmd.ToLowerInvariant()
        $upper = $cmd.ToUpperInvariant()

        switch ($upper) {
            'M' {
                $first = $true
                while ($i -lt $tokens.Count -and -not (Test-CommandToken $tokens[$i])) {
                    $ix = [ref]$i
                    $nx = Read-Number $tokens $ix
                    $ny = Read-Number $tokens $ix
                    $i = $ix.Value
                    if ($relative) {
                        $nx += $x
                        $ny += $y
                    }
                    if ($first) {
                        $path.StartFigure()
                        $startX = $nx
                        $startY = $ny
                        $first = $false
                    } else {
                        $path.AddLine([single]$x, [single]$y, [single]$nx, [single]$ny)
                    }
                    $x = $nx
                    $y = $ny
                }
            }
            'L' {
                while ($i -lt $tokens.Count -and -not (Test-CommandToken $tokens[$i])) {
                    $ix = [ref]$i
                    $nx = Read-Number $tokens $ix
                    $ny = Read-Number $tokens $ix
                    $i = $ix.Value
                    if ($relative) {
                        $nx += $x
                        $ny += $y
                    }
                    $path.AddLine([single]$x, [single]$y, [single]$nx, [single]$ny)
                    $x = $nx
                    $y = $ny
                }
            }
            'H' {
                while ($i -lt $tokens.Count -and -not (Test-CommandToken $tokens[$i])) {
                    $ix = [ref]$i
                    $nx = Read-Number $tokens $ix
                    $i = $ix.Value
                    if ($relative) {
                        $nx += $x
                    }
                    $path.AddLine([single]$x, [single]$y, [single]$nx, [single]$y)
                    $x = $nx
                }
            }
            'V' {
                while ($i -lt $tokens.Count -and -not (Test-CommandToken $tokens[$i])) {
                    $ix = [ref]$i
                    $ny = Read-Number $tokens $ix
                    $i = $ix.Value
                    if ($relative) {
                        $ny += $y
                    }
                    $path.AddLine([single]$x, [single]$y, [single]$x, [single]$ny)
                    $y = $ny
                }
            }
            'C' {
                while ($i -lt $tokens.Count -and -not (Test-CommandToken $tokens[$i])) {
                    $ix = [ref]$i
                    $x1 = Read-Number $tokens $ix
                    $y1 = Read-Number $tokens $ix
                    $x2 = Read-Number $tokens $ix
                    $y2 = Read-Number $tokens $ix
                    $nx = Read-Number $tokens $ix
                    $ny = Read-Number $tokens $ix
                    $i = $ix.Value
                    if ($relative) {
                        $x1 += $x; $y1 += $y
                        $x2 += $x; $y2 += $y
                        $nx += $x; $ny += $y
                    }
                    $path.AddBezier([single]$x, [single]$y, [single]$x1, [single]$y1, [single]$x2, [single]$y2, [single]$nx, [single]$ny)
                    $x = $nx
                    $y = $ny
                }
            }
            'Z' {
                $path.CloseFigure()
                $x = $startX
                $y = $startY
            }
            default {
                throw "Comando SVG nao suportado: $cmd"
            }
        }
    }

    $path
}

function Save-BridgePiece {
    param(
        [string]$TemplatePath,
        [string]$SvgPath,
        [string]$OutputPath,
        [double]$Scale = 0.34
    )

    $template = [System.Drawing.Bitmap]::FromFile($TemplatePath)
    $bitmap = [System.Drawing.Bitmap]::new($template.Width, $template.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.DrawImage($template, 0, 0, $template.Width, $template.Height)
    $graphics.Dispose()
    $template.Dispose()
    Remove-FakeCheckerBackground -Bitmap $bitmap

    $svg = Get-SvgInfo -Path $SvgPath
    $vb = $svg.ViewBox
    $size = [Math]::Min($bitmap.Width, $bitmap.Height) * $Scale
    $scaleFactor = $size / [Math]::Max($vb[2], $vb[3])
    $drawWidth = $vb[2] * $scaleFactor
    $drawHeight = $vb[3] * $scaleFactor
    $offsetX = ($bitmap.Width - $drawWidth) / 2
    $offsetY = ($bitmap.Height - $drawHeight) / 2

    $mask = [System.Drawing.Bitmap]::new($bitmap.Width, $bitmap.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $maskGraphics = [System.Drawing.Graphics]::FromImage($mask)
    $maskGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $maskGraphics.Clear([System.Drawing.Color]::Transparent)
    $maskGraphics.TranslateTransform([single]$offsetX, [single]$offsetY)
    $maskGraphics.ScaleTransform([single]$scaleFactor, [single]$scaleFactor)
    $maskGraphics.TranslateTransform([single](-$vb[0]), [single](-$vb[1]))

    foreach ($pathInfo in $svg.Paths) {
        $path = New-SvgGraphicsPath -Data $pathInfo.Data -FillRule $pathInfo.FillRule
        if ($pathInfo.TranslateX -ne 0 -or $pathInfo.TranslateY -ne 0) {
            $matrix = [System.Drawing.Drawing2D.Matrix]::new()
            $matrix.Translate([single]$pathInfo.TranslateX, [single]$pathInfo.TranslateY)
            $path.Transform($matrix)
            $matrix.Dispose()
        }
        if ($pathInfo.IsStroke) {
            $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::Black, [single]$pathInfo.StrokeWidth)
            $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
            $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
            $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
            $maskGraphics.DrawPath($pen, $path)
            $pen.Dispose()
        } else {
            $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::Black)
            $maskGraphics.FillPath($brush, $path)
            $brush.Dispose()
        }
        $path.Dispose()
    }
    $maskGraphics.Dispose()

    for ($x = 0; $x -lt $bitmap.Width; $x++) {
        for ($y = 0; $y -lt $bitmap.Height; $y++) {
            $maskPixel = $mask.GetPixel($x, $y)
            if ($maskPixel.A -gt 0) {
                $sourcePixel = $bitmap.GetPixel($x, $y)
                $newAlpha = [Math]::Max(0, $sourcePixel.A - $maskPixel.A)
                $bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newAlpha, $sourcePixel.R, $sourcePixel.G, $sourcePixel.B))
            }
        }
    }

    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $mask.Dispose()
    $bitmap.Dispose()
}

function Save-CleanTemplate {
    param([string]$TemplatePath)

    $template = [System.Drawing.Bitmap]::FromFile($TemplatePath)
    $bitmap = [System.Drawing.Bitmap]::new($template.Width, $template.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.DrawImage($template, 0, 0, $template.Width, $template.Height)
    $graphics.Dispose()
    $template.Dispose()

    Remove-FakeCheckerBackground -Bitmap $bitmap
    $bitmap.Save($TemplatePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
}

$root = Split-Path -Parent $PSScriptRoot
$assets = Join-Path $root "public\assets\img\capitulo_4"
$refs = Join-Path $assets "source_refs"
$template = Join-Path $assets "bridge-piece-template.png"

Save-CleanTemplate -TemplatePath $template

$pieces = @(
    @{ Svg = "code-svgrepo-com.svg"; Output = "bridge-piece-codigo.png"; Scale = 0.34 },
    @{ Svg = "merge-svgrepo-com.svg"; Output = "bridge-piece-integrar.png"; Scale = 0.34 },
    @{ Svg = "check-big-svgrepo-com.svg"; Output = "bridge-piece-testes.png"; Scale = 0.38 },
    @{ Svg = "settings-2-svgrepo-com.svg"; Output = "bridge-piece-build.png"; Scale = 0.34 },
    @{ Svg = "rocket-svgrepo-com.svg"; Output = "bridge-piece-deploy.png"; Scale = 0.34 }
)

foreach ($piece in $pieces) {
    Save-BridgePiece `
        -TemplatePath $template `
        -SvgPath (Join-Path $refs $piece.Svg) `
        -OutputPath (Join-Path $assets $piece.Output) `
        -Scale $piece.Scale
    Write-Host "Gerado: $($piece.Output)"
}
