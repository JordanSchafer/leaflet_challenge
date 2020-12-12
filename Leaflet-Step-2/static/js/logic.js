//queryURLS

var earthquakeURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var plateURL="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

//function to setup style for circles
function styleInfo(feature){
    return{
        opacity:1,
        fillOpacity:0.5,
        fillColor:getColor(feature.properties.mag),
        color:"#000000",
        radius:getRadius(feature.properties.mag),
        stroke:true,
        weight:0.5
    };
}

//function to set color
function getColor(mag){
    if(mag>5) return 'red';
    else if(mag>4) return 'orange';
    else if(mag>3) return 'yellow';
    else if(mag>2) return 'lightgreen';
    else if (mag>1)return 'green';
    else return 'magenta';
}

//function to set radius
function getRadius(mag){
    if (mag==0)return 1;

    return mag*5;
}

d3.json(earthquakeURL,(data)=>{
    //create earthquakeLayer
    var earthquakeLayer = new L.LayerGroup();
    L.geoJson(data,{
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng)
        },
        style:styleInfo,
        onEachFeature:function(feature,layer){
            layer.bindPopup("Mag: "+feature.properties.mag+"<hr>Location: "+feature.properties.place)
        }
    }).addTo(earthquakeLayer);

    // Create legend
    var legend = L.control({
        position: "bottomleft"
    });

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "legend"),
        grades = [0, 1, 2, 3, 4, 5];

    //Create list in the legend
    div.innerHTML+="<h3> Magnitude</h3>"
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };

    //create tectonicplates layer
    var tectonicplates = new L.LayerGroup();
    
    d3.json(plateURL,(data)=>{
        L.geoJson(data,{
            color:"blue",
            weight:2
        }).addTo(tectonicplates);
    });
        

    //Create light map tile layer
    var lightmap=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY
    });

    //create street layer
    var streetmap=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
        });

    //create dark layer
    var darkmap=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
    });

    //Create Initial map
    var myMap = L.map("map",{
        center:[37.7749,-122.4194],
        zoom:5,
        worldCopyJump: true,
        layers:[lightmap,earthquakeLayer]
    });

    //set up base maps and overlay maps
    var baseMaps={"Light Map":lightmap,
                  "Street Map":streetmap,
                  "Dark Map":darkmap};

    var overlayMaps={"Earthquakes":earthquakeLayer,
                     "Tectonic Plates":tectonicplates};

    //create layer controller
    L.control.layers(baseMaps,overlayMaps,{
        collapsed:false
    }).addTo(myMap);

    //add legend to map
    legend.addTo(myMap);

    //event handlers to hide and show legend when layer is shown
    myMap.on("overlayadd",(eventLayer)=>{
        if(eventLayer.name=="Earthquakes"){
            myMap.addControl(legend);;
        }
    });
    myMap.on("overlayremove",(eventLayer)=>{
        if(eventLayer.name=="Earthquakes"){
            myMap.removeControl(legend);
        }
    });

});




