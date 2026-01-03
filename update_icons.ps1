
Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param(
        [string]$InputFile,
        [string]$OutputFile,
        [int]$Width,
        [int]$Height
    )

    $srcImage = [System.Drawing.Image]::FromFile($InputFile)
    $newImage = new-object System.Drawing.Bitmap $Width, $Height

    $graphics = [System.Drawing.Graphics]::FromImage($newImage)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $graphics.DrawImage($srcImage, 0, 0, $Width, $Height)
    $graphics.Dispose()
    $srcImage.Dispose()

    $newImage.Save($OutputFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $newImage.Dispose()
    Write-Host "Created $OutputFile"
}

$original = "public\icon-original.png"
Resize-Image -InputFile $original -OutputFile "public\icon-192x192.png" -Width 192 -Height 192
Resize-Image -InputFile $original -OutputFile "public\icon-512x512.png" -Width 512 -Height 512
