
var tracker = {
        
    serverUrl: 'http://192.168.1.213:8888/fairShare/index.php',
        
    originMarker: null,
    
    destinationMarker: null,
        
    map: {},
        
    currentPosition: {},
    
    defaultBounds : {},
        
    trackedPositions: [],
    
    directionsService: new google.maps.DirectionsService(),
    
    directionsDisplay: null,
        
    commonLocationOptions: { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true },
    
    // callbacks for tracker 
    callbacks: {
        getCurrentPosition: {
            success: function(position) {
                tracker.currentPosition = position;
                
                // set bounds
                tracker.defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(tracker.currentPosition.coords.latitude, tracker.currentPosition.coords.longitude));
                
                gPosition = new google.maps.LatLng(tracker.currentPosition.coords.latitude, tracker.currentPosition.coords.longitude);
                
                tracker.directionsDisplay = new google.maps.DirectionsRenderer();
                
                tracker.initMapWidgets()
                    .buildMap(gPosition)
                    //.pinOrigin(gPosition)
                    ;
                
                tracker.directionsDisplay.setMap(tracker.map);
            }, // end getCurrentPosition.success callback
            
            error: function(error) {
                alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
            }
        }, // end callbacks block for getCurrentPosition
        watchPosition: {
            success: function(position){
                tracker.trackedPositions.push(position);
                alert("moved");
            },
            error: function(error) {
                alert('watchPosition code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
            }
        }
    },
    
    buildMap: function(position) {
        
        var mapOptions = {
                'center': position,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
              };
        
        tracker.map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);  
        
        return this;
    },
    
    pinOrigin: function(position){
        tracker.originMarker = tracker._changeMarker(tracker.originMarker, position);
    },
    
    pinDestination: function(position) {
        tracker.destinationMarker = tracker._changeMarker(tracker.destinationMarker, position);
        
        tracker.renderDirections();
    },
    
    renderDirections: function() {
        $('#searchPage').fadeOut();
        $('#mapPage').show().css({zIndex: 1, opacity: 1});
        var start = document.getElementById('origin').value;
        var end = document.getElementById('destination').value;
        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        tracker.directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            tracker.directionsDisplay.setDirections(response);
            $(response.routes).each(function(){
                // iterate each route
               $(this.legs).each(function(){
                   // iterate the legs
                   _leg = this;
                   $.ajax({
                       url: tracker.serverUrl,
                       data: {
                           device_uuid: '1',
                           distance: _leg.distance.value,
                           origin: _leg.start_address,
                           origin_latitude: _leg.start_location.lat(),
                           origin_longitude: _leg.start_location.lng(),
                           destination: _leg.end_address,
                           destination_latitude: _leg.end_location.lat(),
                           destination_longitude: _leg.end_location.lng(),
                           fare: 0
                       },
                       type: 'post',
                       dataType: 'json',
                       success: function(){
                           
                       }
                   });
               }); 
            });
            
          }
        });
    },
    
    _changeMarker: function(marker, position) {
        if (marker) {
            marker.setMap(null);
        }
        
        marker = new google.maps.Marker({
            'position': position,
            map: tracker.map,
            title:"You are here!"
        });
        
        return marker;
    },
    
    initLocation: function() {
        
        // get current position of user
        navigator.geolocation.getCurrentPosition(tracker.callbacks.getCurrentPosition.success,tracker.callbacks.getCurrentPosition.error,tracker.commonLocationOptions);
      
        return this;
    },
    
    initMapWidgets: function() {
        var inputFrom = new google.maps.places.Autocomplete(document.getElementById('origin'), {bounds: tracker.defaultBounds});
        var inputTo = new google.maps.places.Autocomplete(document.getElementById('destination'), {bounds: tracker.defaultBounds});
        
        // bind listener for origin
//        google.maps.event.addListener(inputFrom, 'place_changed', function() {
//            var place = inputFrom.getPlace();
//            if (!place.geometry) {
//              return;
//            }
//            if (place.geometry.viewport) {
//              //tracker.map.fitBounds(place.geometry.viewport);
//            } else {
//              tracker.map.setCenter(place.geometry.location);
//            }
//            tracker.pinOrigin(place.geometry.location);
//          });
//        
//        // bind listener for destination
//        google.maps.event.addListener(inputTo, 'place_changed', function() {
//            var place = inputTo.getPlace();
//            if (!place.geometry) {
//              return;
//            }
//            if (place.geometry.viewport) {
//              //tracker.map.fitBounds(place.geometry.viewport);
//            } else {
//              tracker.map.setCenter(place.geometry.location);
//            }
//            tracker.pinDestination(place.geometry.location)
//          });
//        
        return this;
    },
    
    startWatchPosition: function() {
        // start watching position
        _watchId = navigator.geolocation.watchPosition(tracker.callbacks.getCurrentPosition.success, tracker.callbacks.getCurrentPosition.error, tracker.commonLocationOptions);
    }
    
};

serverRequest = {
	uri: '192.168.1.213:8888/fairShare?',
	
	saveTrip: function(params)
	{
		url = serverRequest.uri + 'saveTrip';

		$.post(url, params, function(result){
			alert(result);
		}, 'json');
	},
	
	getSameTrips: function(params)
	{
		url = serverRequest.uri + 'getSameTrips';
		$.get(url, params, function(){
			
		}, 'json');
	},
	
	getSameTrips: function(params)
	{
		url = serverRequest.uri + 'getFares';
		$.get(url, params, function(){
			
		}, 'json');
	}
};

var fareCalculator =
{
	flagDown: 40, 
	flagDownDistance: 500, // meter
	succeedingRate: 3.50, 
	succeedingDistance: 300,
	idleRate: 3.50, 
	idleTime: (1000 * 60) * 2, // 2 minute

	totalFare: this.flagDown,
	
	addSucceedingFare: function()
	{
		this.totalFare += this.succeedingRate;
	},

	addIdleFare: function()
	{
		this.totalFare += this.idleRate;
	},
	
	getTotalFare: function()
	{
		return this.totalFare;
	},
	
	computeDistanceFare: function(distance)
	{
		var fare = this.flagDown;
		
		if(distance > this.flagDownDistance) {
			distance -= this.flagDownDistance;

			fare += (Math.ceil(distance / this.succeedingDistance) * this.succeedingRate);
		}
		
		return fare;
	}
}