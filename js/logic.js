function markerSize(mag) {
  return mag * 10000;
}

// Adding tile layer
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Link to GeoJSON
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var earthquakes = [];
var feature = [];

d3.json(APILink, function(response) {
  
  for (var i = 0; i < response.features.length; i++) {
    feature.push(response.features[i])

    earthquakes.push(
      L.circle([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.75,
        color: "white",
        fillColor: "orange",
        radius: markerSize(response.features[i].properties.mag)
      })
    );
    // console.log(i)
  }
  // console.log(earthquakes);

  var markers = []
  var markerLayer = L.layerGroup(markers)
  var eqLayer = L.layerGroup(earthquakes);

  // Create a baseMaps object
  var baseMaps = {
    "Light Map": lightmap,
  };

  // Create an overlay object
  var overlayMaps = {
    "Earthquakes": eqLayer,
    "Markers": markerLayer
  };

  var myMap = L.map("map", {
    center: [38.7128, -114.0059],
    zoom: 5,
    layers: [lightmap, eqLayer, markerLayer]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // adding markers for magnitude 5.0 or greater quakes
  for (var i = 0; i < feature.length; i++) {
    if (feature[i].properties.mag > 5.0) {
      var newMarker = L.marker([feature[i].geometry.coordinates[1], feature[i].geometry.coordinates[0]], {
      });

      // Add the new marker to the appropriate layer
      newMarker.addTo(markerLayer);

      // Bind a popup to the marker that will  display on click. This will be rendered as HTML
      newMarker.bindPopup("Magnitude: " + feature[i].properties.mag);
    }
  }

});
