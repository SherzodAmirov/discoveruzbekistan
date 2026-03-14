// Data
const places = {
"registan":{
name:"Registan",
desc:"Samarkanddagi mashhur tarixiy maydon",
distance:"Masofa: 300 km",
cost:"Xarajat: ~250000 so'm",
coords:[39.6542,66.9750]
},
"charvak":{
name:"Charvak",
desc:"Toshkent yaqinidagi chiroyli suv va tog' joyi",
distance:"Masofa: 80 km",
cost:"Xarajat: ~150000 so'm",
coords:[41.6170,70.0800]
},
"bukhara":{
name:"Bukhara",
desc:"Qadimiy shahar va tarixiy obidalar",
distance:"Masofa: 600 km",
cost:"Xarajat: ~400000 so'm",
coords:[39.7747,64.4286]
}
};

// Show modal
function showDetails(placeId){
let place = places[placeId];
document.getElementById("placeName").innerText = place.name;
document.getElementById("placeDesc").innerText = place.desc;
document.getElementById("placeDistance").innerText = place.distance;
document.getElementById("placeCost").innerText = place.cost;
document.getElementById("modal").style.display = "flex";
document.getElementById("map").style.display = "none";
}

// Close modal
function closeModal(){
document.getElementById("modal").style.display = "none";
}

// Show map in modal
function showMap(){
let mapDiv = document.getElementById("map");
mapDiv.style.display = "block";
let map = L.map('map').setView([41.2995, 69.2401], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom: 18
}).addTo(map);

// Add markers
for(let key in places){
L.marker(places[key].coords)
.addTo(map)
.bindPopup("<b>"+places[key].name+"</b><br>"+places[key].distance+"<br>"+places[key].cost);
}
}
