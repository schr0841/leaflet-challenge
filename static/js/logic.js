// Part 1: Create the Earthquake Visualization

//center of north america lat lon 54.5260° N, 105.2551° W
let mapcenter = [54.5260, -105.2551];
let zoomLevel = 3;

// Perform an API call to the GeoJSON API to get the earthquake information. Call createMarkers / other functions when it completes.


//d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(createMarkers);

//Significant earthquakes over the past week
/* d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson").then(function(data){
    console.log('data: ', data);
    console.log('data.features: ', data.features);

    features=data.features;
    for (let i=0; i<features.length; i++){
        console.log('lat: ', features[i].geometry.coordinates[1],  'lon: ', features[i].geometry.coordinates[0])

    }

});  */



//Significant earthquakes over the past week
//d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson").then(createMarkers); 

//All earthquakes over the past week
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);


/*d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(response){
    console.log(response);
});*/






function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options.
    let myMap = L.map("map", {
      center:  mapcenter,
      zoom: zoomLevel,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap); 

    //Create legend
    let legend = L.control({ position: "bottomright" });
    
    legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let labels = [];

    colors=['#fee0d2','#fc9272','#de2d26'];
    limits=[0,70,300];

    // Add the minimum and maximum.
    let legendInfo = "<h3>Earthquake depth (km) </h3>" +
      "<div class=\"labels\">" +
      "</div>";

    div.innerHTML = legendInfo;

    //labels for legend
    for (var i = 0; i < limits.length; i++) {
        div.innerHTML +=
            '<li style="background:' + colors[i] + '"> ' +
            limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '</li>' : '+');
    }

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
    }; 

    // Adding the legend to the map
    legend.addTo(myMap);  
  }
  




// Create the createMarkers function.
function createMarkers(response){
    // Pull the "stations" property from response.data.
  let features=response.features;
  console.log('features: ', features)
    // Initialize an array to hold the bike markers.
  let earthquakeMarkers = [];
    // Loop through the stations array.
    for (let i=0; i< features.length; i++){
      // For each station, create a marker, and bind a popup with the station's name.
      //let marker = L.marker([stations[i].lat, stations[i].lon]).bindPopup("<h3>" + stations[i].name + "<h3><h3>Capacity: " + stations[i].capacity + "</h3>");

        //earthquake depth is the 3rd feature of coordinates: features[i].geometry.coordinates[2]
        //earthquake magnitude: features[i].properties.mag

        //console.log('earthquake magnitude: ', features[i].properties.mag)

        //For scientific purposes, this earthquake depth range of 0 - 700 km is divided into three zones: shallow, intermediate, and deep. 
        //Shallow earthquakes are between 0 and 70 km deep; intermediate earthquakes, 70 - 300 km deep; and deep earthquakes, 300 - 700 km deep.
      function color(depth){
        if (depth <70) {
            return '#fee0d2'
        }
        else if (depth<300){
            return '#fc9272';
        }
        else return '#de2d26';
      };

      let circle = L.circleMarker([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], {
        radius : 2**features[i].properties.mag,
        color  : color(features[i].geometry.coordinates[2]),
        opacity: 0.95,
      }).bindPopup("<h3>Magnitude: " + features[i].properties.mag + "<h3><h3>Depth (km): " + features[i].geometry.coordinates[2] + "</h3>");
      // Add the marker to the bikeMarkers array.
      earthquakeMarkers.push(circle);
    }
    
    
  
    console.log('end of createMarkers function')

    // Create a layer group that's made from the earthquake markers array, and pass it to the createMap function.
    createMap(L.layerGroup(earthquakeMarkers));
  
  };










// Part 2: Gather and Plot More Data (Optional with no extra points earning)