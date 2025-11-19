#!/bin/bash

OPTIONS1=("Setiap hari" "Beberapa kali seminggu" "Seminggu sekali" "Jarang")
OPTIONS2=("Catat pengeluaran" "Catat pemasukan" "Budgeting" "Laporan/grafik" "Tracking aset")
OPTIONS3=("Sangat mudah" "Cukup mudah" "Biasa aja" "Lumayan ribet" "Ribet banget")
OPTIONS4=("Sangat membantu" "Lumayan membantu" "Biasa aja" "Kurang membantu" "Tidak membantu")
OPTIONS5=("Tampilan (UI)" "Kecepatan/performansi" "Kategori pengeluaran" "Laporan & grafik" "Fitur aset" "Tidak ada yang perlu")
OPTIONS6=("Auto-sync mutasi bank" "Reminder tagihan otomatis" "Export ke Excel" "Shared wallet" "Analisa AI (insight cashflow)" "Tidak butuh fitur tambahan")
OPTIONS7=("Tidak pernah" "Kadang ada bug kecil" "Sering error" "Fitur kurang sesuai kebutuhan")
OPTIONS8=("Sangat puas" "Puas" "Biasa saja" "Kurang puas" "Tidak puas")
OPTIONS9=("Ya" "Mungkin" "Tidak")
OPTIONS10=("Ya" "Mungkin" "Tidak")

pick() {
  local arr=("$@")
  echo "${arr[$RANDOM % ${#arr[@]}]}"
}

json="["

json+='{"id":1,"answer":"'"$(pick "${OPTIONS1[@]}")"'"},'
json+='{"id":2,"answer":"'"$(pick "${OPTIONS2[@]}")"'"},'
json+='{"id":3,"answer":"'"$(pick "${OPTIONS3[@]}")"'"},'
json+='{"id":4,"answer":"'"$(pick "${OPTIONS4[@]}")"'"},'
json+='{"id":5,"answer":"'"$(pick "${OPTIONS5[@]}")"'"},'
json+='{"id":6,"answer":"'"$(pick "${OPTIONS6[@]}")"'"},'
json+='{"id":7,"answer":"'"$(pick "${OPTIONS7[@]}")"'"},'
json+='{"id":8,"answer":"'"$(pick "${OPTIONS8[@]}")"'"},'
json+='{"id":9,"answer":"'"$(pick "${OPTIONS9[@]}")"'"},'
json+='{"id":10,"answer":"'"$(pick "${OPTIONS10[@]}")"'"}]'
  
curl -X POST http://localhost:3002/api/submit \
  -H "Content-Type: application/json" \
  -d "{\"answers\": $json}"
