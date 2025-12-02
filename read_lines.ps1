$content = Get-Content 'c:\Users\sudanva\Desktop\clg hacmk\src\utils\api.js'
for ($i = 119; $i -lt 155; $i++) {
    Write-Output "$($i + 1): $($content[$i])"
}
