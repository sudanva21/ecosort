$lines = Get-Content 'c:\Users\sudanva\Desktop\clg hacmk\src\utils\api.js'
for ($i = 92; $i -lt 140; $i++) {
    Write-Output "$i : $($lines[$i])"
}
