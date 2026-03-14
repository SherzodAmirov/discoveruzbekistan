var map = L.map('map').setView([41.2995, 69.2401], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom: 18
}).addTo(map);

// Registan
L.marker([39.6542,66.9750])
.addTo(map)
.bindPopup("<b>Registan</b><br>Distance: 300 km<br>Cost: ~250000 so'm");

// Charvak
L.marker([41.6170,70.0800])
.addTo(map)
.bindPopup("<b>Charvak</b><br>Distance: 80 km<br>Cost: ~150000 so'm");

// Bukhara
L.marker([39.7747,64.4286])
.addTo(map)
.bindPopup("<b>Bukhara</b><br>Distance: 600 km<br>Cost: ~400000 so'm");
