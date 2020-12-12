//Create Initial map

var myMap = L.map("map",{
    center:[37.7749,-122.4194],
    zoom:5,
    worldCopyJump: true
});

//Place a tile layer to map 
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  maxZoom: 18,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

//URL to query
var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, (data)=>{
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

    //Create Geojson layer
    L.geoJson(data,{
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng)
        },
        style:styleInfo,
        onEachFeature:function(feature,layer){
            layer.bindPopup("Mag: "+feature.properties.mag+"<hr>Location: "+feature.properties.place)
        }
    }).addTo(myMap);

    var legend = L.control({
        position: "bottomleft"
    });

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 1, 2, 3, 4, 5];

    // Create legend
    div.innerHTML+="<h3> Magnitude</h3>"
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };

    legend.addTo(myMap);

})
