$ErrorActionPreference = "Stop"
try {
    $response = Invoke-RestMethod -Method Post -Uri "https://drive.io/api/upload" -Body '{"filename": "test-upload.txt", "contentType": "text/plain", "size": 46}' -ContentType "application/json"
    if ($response.url) {
        Invoke-WebRequest -Method Put -Uri $response.url -InFile "test-upload.txt" -ContentType "text/plain"
        Write-Output "Upload complete for ID: $($response.id)"
    }
    else {
        Write-Error "Failed to get upload URL"
    }
}
catch {
    Write-Error $_.Exception.Message
}
