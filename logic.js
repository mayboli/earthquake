
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL
// With the response, send the data.features object to the createFeatures function
d3.json(queryUrl, function(data) {
    console.log(data);
    createFeatures(data.features);
});

// Function to add features to map
function createFeatures(earthquakeData) {


    // Creating popup for earthquake place and time
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place + 
        "</h3><hr><p>" + "<h4><p>Magnitude: " + (feature.properties.mag) + "</p></h4>" + "</h4>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {

        // Changing markers into circles
        var geojsonMarkerOptions = {
            radius: 4*feature.properties.mag,
            fillColor: getColor(feature.properties.mag),
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        };
        
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }

    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Define streetmap layer
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Initial settings of map: center, zoom, and layers
    var myMap = L.map("map", {
      center: [
        39.82, -98.57
      ],
      zoom: 4,
      layers: [streetmap, earthquakes]
    });
  
    // Adding layers to map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
  
        var div = L.DomUtil.create('div', 'info legend'),
        levels = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        labels = [];
  
        // Generate label for legend
        for (var i = 0; i < levels.length; i++) {
            div.innerHTML +=
            labels.push(
            '<i style="background:' + getColor(levels[i] + 1) + '">&nbsp&nbsp</i> ' + 'Magnitude ' + 
            levels[i] + (levels[i + 1] ? '&ndash;' + levels[i + 1] + '<br>' : '+'));
    }

    div.innerHTML+= 'Magnitude';
    div.innerHTML = labels.join('<br>');
  
    return div;

    };
  
    legend.addTo(myMap);

  }


  // Defining colors for magnitudes
  function getColor(d) {
    return d < 1 ? 'rgb(102,255,51)' :
          d < 2  ? 'rgb(153,255,51)' :
          d < 3  ? 'rgb(204,255,51)' :
          d < 4  ? 'rgb(255, 255, 0)' :
          d < 5  ? 'rgb(255, 204, 0)' :
          d < 6  ? 'rgb(255, 153, 51)' :
          d < 7  ? 'rgb(255, 102, 0)' :
          d < 8  ? 'rgb(255, 0, 0)' :
          d < 9  ? 'rgb(204, 0, 0)' :
                      'rgb(255,255, 255)';
  }


    