function point(lat, lng)
{
    this.lat = lat;
    this.lng = lng;

    return this;
}

//function point(points)
//{
//    this.lat = lat;
//    this.lng = lng;
//
//    return this;
//}


function transitRoutSegment(icon, name, short, time, from, to)
{
    this.icon = icon;
    this.name = name;
    this.short = short;
    this.time = time;
    this.from = from;
    this.to = to;

    return this;
}

var myMaps = {
    map: null,
    markers: [],

    init: function(params = null)
        {
        if(params == null)
           map = new GMaps({
                   el: '#map',
                   lat: 52.213663,
                   lng: 21.003197,
                   zoomControl : true,
                   zoomControlOpt: {
                       style : 'SMALL',
                       position: 'TOP_LEFT'
                   },
                   panControl : false,
                   streetViewControl : false,
                   mapTypeControl: true,
                   overviewMapControl: false
                   });
        else
           map = new GMaps(params);
        },

    addMarker: function(point, title)
        {
        var tmp = map.addMarker({
            lat: point.lat,
            lng: point.lng,
            title: title,
        });
        this.markers.push(tmp);
        return tmp;
        },

    addMarkerWithInfoWindow: function(point, title, content)
        {
        var tmp = map.addMarker({
            lat: point.lat,
            lng: point.lng,
            title: title,
            infoWindow: {
                content: content
            }
        });
        this.markers.push(tmp);
        return tmp;
        },

    removeMarker: function(marker)
        {
        var index = this.markers.indexOf(marker);
            if (index > -1) {this.markers.splice(index, 1);}
        map.removeMarker(marker);
        },

    removeAllMarkers: function()
        {
        this.markers.forEach(function(marker) {
            map.removeMarker(marker);
        });
        this.markers = []
        },

    drawRoute: function(start, end, waypoints = [], travelMode='walking', strokeColor='#131540', strokeOpacity=0.6, strokeWeight=6)
    {
//        console.log(start, end)
    	map.drawRoute({
    	  origin: [start.lat, start.lng],
    	  destination: [end.lat, end.lng],
    	  waypoints: [],
          travelMode: 'walking',
          strokeColor: '#131540',
          strokeOpacity: 0.6,
          strokeWeight: 6
    	});
    },

    geolocate: function()
    {
        GMaps.geolocate({
            success: function(position) {
                map.setCenter(position.coords.latitude, position.coords.longitude);
            },
            error: function(error) {
                ;//alert('Geolocation failed: '+error.message);
            },
            not_supported: function() {
                ;//alert("Your browser does not support geolocation");
            },
            always: function() {
                ;//alert("Done!");
            }
        });
    },

    getTransit: function(){
        var route = map.getRoutes({
            origin: [52.213663, 21.003197],
            destination: [52, 21],
            travelMode: 'transit',
            callback: this.getTransitCallback
        });
    },

    getTransitCallback: function(data)
    {
        segList = []
        data[0].legs[0].steps.forEach(function(step) {
        if(step.travel_mode == "TRANSIT")
        {
            icon = step.transit.line.vehicle.icon;
            name = step.transit.line.vehicle.name;
            short = step.transit.line.short_name;
            time = step.transit.arrival_time.text;
            from = step.transit.arrival_stop.name;
            to = step.transit.departure_stop.name;
            var seg = new transitRoutSegment(icon, name, short, time, from, to);
            segList.push(seg);
        }
        });
        console.log(segList);
    }

}