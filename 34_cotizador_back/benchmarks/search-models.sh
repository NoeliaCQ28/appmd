#!/usr/bin/env bash

URL="http://localhost:3000/api/v1/grupos-electrogenos/modelos"

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NTA3OTg3NDEsImV4cCI6MTc1MTQwMzU0MX0.NH-UwGas5s0BBIih_CBqV0kKw9kHcG5IQGgpHOKkk_4"


read -r -d '' BODY << EOF
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
EOF

oha   -m POST   -T application/json   -H "Authorization: Bearer $TOKEN"   -d "$BODY"   -c 100   -q 200   -z 1m   --no-tui   "$URL"
