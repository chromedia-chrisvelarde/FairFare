
var tracker = {
        
    trackedPositions: [],
        
    commonLocationOptions: { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true },
    
    // callbacks for tracker 
    callbacks: {
        getCurrentPosition: {
            success: function(position) {
                var mapOptions = {
                        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                      };
                
                var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
                
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    map: map,
                    title:"You are here!"
                });
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
    
    initLocation: function() {
        
        // get current position of user
        navigator.geolocation.getCurrentPosition(tracker.callbacks.getCurrentPosition.success,tracker.callbacks.getCurrentPosition.error,tracker.commonLocationOptions);
        
    },
    
    startWatchPosition: function() {
        // start watching position
        _watchId = navigator.geolocation.watchPosition(tracker.callbacks.getCurrentPosition.success, tracker.callbacks.getCurrentPosition.error, tracker.commonLocationOptions);
    }
    
}