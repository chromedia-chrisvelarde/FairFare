<?php


$action = isset($_GET['action']);


$db = new mysqli('healthcare-dev', 'root', 'hcadbadmin', 'fareShare');

if (!$db) {
    die('Unable to connect to database!');
}

switch($action) {
    
    case 'saveRide' :
        
        $requiredFields = array('device_uuid', 'origin', 'distance', 'fare');
        
        if(isset($_GET['device_uuid']) && isset($_GET['origin'])) {
            
            $uuid = $_GET['device_uuid'];
            
            $origin = $_GET['origin'];
            $originLatitude = $_GET['origin_lat'];
            $originLongitude = $_GET['origin_long']; 
            
            $destination = isset($_GET['destination']) ? $_GET['destination'] : '';
            $destinationLatitude = isset($_GET['destination_lat']) ? $_GET['destination_lat'] : '';
            $destinationLongitude = isset($_GET['destination_long']) ? $_GET['destination_long'] : '';

            $distance = isset($_GET['distance']) ? $_GET['distance'] : '';
            $fare = isset($_GET['fare']) ? $_GET['fare'] : '';

            $query = "INSERT INTO rides(device_uuid, origin, origin_latitude, origin_longitude, destination, destination_latitude, destination_longitude, km_distance, fare, time) 
                      VALUES ($uuid, $origin, $originLatitude, $originLongitude, $destination, $distance, $fare, now())";
            $db->prepare($query);
            $result = $db->query($query);
            
        }


        
        echo $result ? true : $db->error;

        break;
    
    case 'getFares' :
        break;
        
    case 'getSameDestination' :
        $uuid = $_GET['device_uuid']; 
        break;
}

$db->close();