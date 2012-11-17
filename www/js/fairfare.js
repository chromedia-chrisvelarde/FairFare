
var tracker = {
        
    map: {},
        
    currentPosition: {},
    
    defaultBounds : {},
        
    trackedPositions: [],
        
    commonLocationOptions: { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true },
    
    // callbacks for tracker 
    callbacks: {
        getCurrentPosition: {
            success: function(position) {
                tracker.currentPosition = position;
                
                // set bounds
                tracker.defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(tracker.currentPosition.coords.latitude, tracker.currentPosition.coords.longitude));
                
                tracker.initMapWidgets()
                    .buildMap(tracker.currentPosition)
                    .pinLocation(tracker.currentPosition);
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
        position = position ? position : tracker.currentPosition;
        
        var mapOptions = {
                'center': new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
              };
        
        tracker.map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);  
        
        return this;
    },
    
    pinLocation: function(location){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
            map: tracker.map,
            title:"You are here!"
        });
    },
    
    initLocation: function() {
        
        // get current position of user
        navigator.geolocation.getCurrentPosition(tracker.callbacks.getCurrentPosition.success,tracker.callbacks.getCurrentPosition.error,tracker.commonLocationOptions);
      
        return this;
    },
    
    initMapWidgets: function() {
        var input = document.getElementById('from');
        var searchBox = new google.maps.places.SearchBox(input, {bounds: tracker.defaultBounds});
        
        return this;
    },
    
    startWatchPosition: function() {
        // start watching position
        _watchId = navigator.geolocation.watchPosition(tracker.callbacks.getCurrentPosition.success, tracker.callbacks.getCurrentPosition.error, tracker.commonLocationOptions);
    }
    
}