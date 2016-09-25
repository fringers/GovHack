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

function distanceBetweenPoints(p1, p2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(p2.lat-p1.lat);  // deg2rad below
    var dLon = deg2rad(p2.lng-p1.lng);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(p1.lat)) * Math.cos(deg2rad(p2.lat)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return Math.round(d * 100) / 100;
}
function deg2rad(deg) {
    return deg * (Math.PI/180)
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

    addMarker: function(point, title, icon)
        {
        var tmp = map.addMarker({
            lat: point.lat,
            lng: point.lng,
            title: title,
            icon: icon
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

    geolocate: function(center, callback)
    {
        GMaps.geolocate({
            success: function(position) {
                if(center)
                   this.center({lat: position.coords.latitude, lng: position.coords.longitude});
                if(callback)
                    callback({lat: position.coords.latitude, lng: position.coords.longitude});
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

    center: function(loc) {
        map.setCenter(loc.lat, loc.lng);
    },

    getTransit: function(from, to, callback, mode="transit"){
        var that = this;
        var route = map.getRoutes({
            origin: [from.lat, from.lng],
            destination: [to.lat, to.lng],
            travelMode: mode,
            callback: function(data) {
                that.getTransitCallback(mode, data, callback);
            }
        });
    },

    getUberPrice: function(start_latitude, start_longitude, end_latitude, end_longitude) {
        return Promise.resolve(
            $.ajax({
                type: "GET",
                url: "https://sandbox-api.uber.com/v1/estimates/price?start_latitude="+start_latitude+"&start_longitude="+start_longitude+"&end_latitude="+end_latitude+"&end_longitude="+end_longitude,
                headers : {
                    "Authorization": "Token KjyHuNgu4tKWwNpg6XetC_ekmMZ_CSmcEq_0TifM"
                }
            })
        )
    },

    getUberTime: function(start_latitude, start_longitude) {
        return Promise.resolve(
            $.ajax({
                type: "GET",
                url: "https://sandbox-api.uber.com/v1/estimates/time?start_latitude="+start_latitude+"&start_longitude="+start_longitude,
                headers : {
                    "Authorization": "Token KjyHuNgu4tKWwNpg6XetC_ekmMZ_CSmcEq_0TifM"
                }
            })
        )
    },

    getTransitCallback: function(mode, data, callback)
    {

        if(mode == 'transit') {
            segList = [];
            data[0].legs[0].steps.forEach(function (step) {
                if (step.travel_mode == "TRANSIT") {
                    icon = step.transit.line.vehicle.icon;
                    name = step.transit.line.vehicle.name;
                    short = step.transit.line.short_name;
                    time = step.transit.arrival_time.text;
                    to = step.transit.arrival_stop.name;
                    from = step.transit.departure_stop.name;
                    var seg = new transitRoutSegment(icon, name, short, time, from, to);
                    segList.push(seg);
                }
            });
            callback({
                dur: data[0].legs[0].duration.text,
                segLists: segList
            });
        }
        else {
            var result = {
                dist: data[0].legs[0].distance.text,
                dur: data[0].legs[0].duration.text
            };
            callback(result);
        }
    }

}