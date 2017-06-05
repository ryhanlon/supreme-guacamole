/**
 * Created by Rebecca Hanlon on 6/5/17.
 */





function dataCall(position) {
    // pulls the data from TriMet: position, radius, appID, json
    "use strict"
    let data;
    let $lat = position.coords.latitude;
    let $long = position.coords.longitude;
    let $dataPairs = {'ll':`${$lat}, ${$long}`,
                     'meters':'100',
                     'appID':'C04DA9067D94543B28DB02D54',
                     'json':'true'};

  $.ajax({
     url: 'https://developer.trimet.org/ws/V1/stops',
     method: 'GET',
     data: $dataPairs,
     success: function(rsp){
         console.log(rsp);
         data = rsp;
     },
     error: function(err){
         console.log('grrr');
     },
 });

}

function initMap(position) {
    // puts the current location and marker on the map

        let here = {lat:position.coords.latitude, lng:position.coords.longitude};
        let map = new google.maps.Map(document.getElementById('map'), {
                  zoom: 16,
                  center: here
                });
                let marker = new google.maps.Marker({
                  position: here,
                  map: map
                });
              }

function nav() {
    // gets the current position using latitude and longitude

    navigator.geolocation.getCurrentPosition(function(position) {
        dataCall(position);
        initMap(position);
        console.log('started')
    });
}

nav();
