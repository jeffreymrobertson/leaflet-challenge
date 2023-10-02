let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});

let map = L.map('map', {
  center: [50,50],
  zoom: 5,
  layers: [street]
})

d3.json(url).then(data => {
  console.log(data)

  let depth = [...new Set(data.features.map(f => f.geometry.coordinates[2]))];

  L.geoJSON(data, {
    pointToLayer: function(feature, layer) {
      let cir = {
        radius: markerRadius(feature.properties.mag),
        fillColor: markerColour(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(layer, cir)
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h1>Location: ${feature.properties.place}</h1><hr><h3>Magnitude: ${feature.properties.mag}</h3><h3>Depth: ${feature.geometry.coordinates[2]}</h3>`)
    }
  }).addTo(map);

  let dLegend = L.control({position: 'bottomright'});
  dLegend.onAdd = function(map){
    let div = L.DomUtil.create('div', 'info legend'),
    grds = [0,10,20,30,50,70,100,150,250,400];
    div.innerHTML += "<strong>Depth</strong><br>";
    for(let i = 0; i < grds.length; i++){
      div.innerHTML += '<i style="background:' + markerColour(grds[i] + 1) + '"></i> ' +
      grds[i] + (grds[i + 1] ? '&ndash;' + grds[i + 1] + ' ' : '+') +
      '<span style="background-color: ' + markerColour(grds[i] + 1) + ';">&nbsp;&nbsp;&nbsp;&nbsp;</span><br>';
    }
    return div
  }
  dLegend.addTo(map);

  let magLegend = L.control({position: 'bottomleft'})
  magLegend.onAdd = function(map){
    let div = L.DomUtil.create('div', 'info legend');
    mag = [1.5,2.0,2.5,3.0,3.5,4.0,5.5,6.0]
    div.innerHTML += "<strong>Magnitude</strong><br>";
    for(let i = 0; i < mag.length; i++){
        div.innerHTML +=
                '<i style="width: ' + markerRadius(mag[i]) * 2 + 'px; height: ' + markerRadius(mag[i]) * 2 + 'px; background-color: #999; border-radius: 50%; display: inline-block;"></i> ' +
                `~${mag[i]}<br>`;
        }
      return div;
    }
  magLegend.addTo(map)
})

function markerColour(depth) {
  return depth > 400 ? '#BEBD7F' :
         depth > 300 ? '#CAC4B0' :
         depth > 250 ? '#E5BE01' :
         depth > 150 ? '#B8B799' :
         depth > 100 ? '#7D7F7D' :
         depth > 70  ? '#AF2B1E' :
         depth > 50  ? '#BEBD7F' :
         depth > 30  ? '#EC7C26' :
         depth > 20  ? '#B44C43' :
         depth > 10  ? '#B44C43' :
                      '#F75E25';
};

function markerRadius(mag){
  return Math.pow(mag,2)
}