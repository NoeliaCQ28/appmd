# search-models.ps1 (compatible con tu versión antigua de oha)

$url   = "http://localhost:3000/api/v1/grupos-electrogenos/modelos"
$token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NTA3OTg3NDEsImV4cCI6MTc1MTQwMzU0MX0.NH-UwGas5s0BBIih_CBqV0kKw9kHcG5IQGgpHOKkk_4"

# Crear el archivo JSON del body
@'
{
  "modelo": "Todos",
  "voltaje": 220,
  "frecuencia": 60,
  "fases": 3,
  "factorPotencia": 0.8,
  "altura": 1000,
  "temperatura": 0,
  "insonoro": true,
  "powerThreshold": 20,
  "primePower": "Todos",
  "standbyPower": "Todos",
  "marketId": 1
}
'@ | Out-File -FilePath body.json -Encoding utf8

Write-Host "=== body.json ==="
Get-Content .\body.json
Write-Host "================="

# Ejecutar oha (sin flags modernos)
oha --method POST -T application/json -H "Authorization: $token" -D body.json -c 1 $url