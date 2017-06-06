/**
 * Created by Rebecca Hanlon on 6/5/17.
 */

let map;


// slider handle

 $( function() {
    var handle = $( "#custom-handle" );
    $( "#slider" ).slider({
      create: function() {
        handle.text( $( this ).slider( "value" ) );
      },
      slide: function( event, ui ) {
        handle.text( ui.value );
      }
    });
  } );


function addStopToTable(index, bus) {

    // prototype for table
    //  <tr>
    //   <th scope="row"></th>
    //   <td>99</td>
    //   <td>42</td>
    //   <td>@SW Corbert</td>
    // </tr>

    // variables for table with bus locations

    let busStopIndex = $('<th>', {'class': 'row'}).text(index+1);
    let busLocId = $('<td>').text(bus.locid);
    let busStopDEsc = $('<td>').text(bus.desc);
    let busHeading = $('<th>').text(bus.dir);

    let busStopRow = $("<tr>").append(busStopIndex, busLocId, busHeading, busStopDEsc);
    $('#busses').append(busStopRow);
}



function addBus(bus) {
    // add the bus icon and locate on the map

    let $iconBus = "static/img/bus-4.png";

    let marker = new google.maps.Marker({
          position: bus,
          icon: $iconBus
        });

    marker.setMap(map);
}


function addMarkers(busses) {
    // adding bus locations and icons

    $.each(busses, function(index, bus){
        console.log(bus);

        addStopToTable(index, bus);
        addBus(bus);
    });
}


function dataCall(position) {
    "use strict"
     // pulls the data from TriMet: position, radius, appID, json

    let data;
    let $lat = position.coords.latitude;
    let $long = position.coords.longitude;
    let $dataPairs = {'ll':`${$lat}, ${$long}`,
                     'meters':'300',
                     'appID':'C04DA9067D94543B28DB02D54',
                     'json':'true'};

  $.ajax({
     url: 'https://developer.trimet.org/ws/V1/stops',
     method: 'GET',
     data: $dataPairs,
     success: function(rsp){
         console.log(rsp);
         data = rsp;
         let busses = rsp.resultSet.location;
         addMarkers(busses);
     },
     error: function(error){
         console.log(error);
     },
 });

}


function initMap(position) {

    // puts the current location and marker on the map

    let here = {lat:position.coords.latitude, lng:position.coords.longitude};
    map = new google.maps.Map(document.getElementById('map'), {
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
    });
}