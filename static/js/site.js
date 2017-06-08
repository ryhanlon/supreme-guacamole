/**
 * Created by Rebecca Hanlon on 6/5/17.
 */


"use strict";


let map;
let stopMarkers = new Array();


function addStopToTable(index, bus) {
    // Make table for bus stop information

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

function makeInFoWindow(busStop){
    // Generates and adds inforwindow HTML to Google map marker objects.

    let $description = $('<p>').text(`${busStop.desc}`);
    let $heading = $('<h4>').text(`${busStop.locid} -> ${busStop.dir}`);
    let $body = $('<section>').append($heading, $description);

    let $content = $('<main>').append($body, $heading, $description);

    return $content.html();
}

function addBus(busStop) {
    // add the bus icon and locate on the map

    let $iconBus = "static/img/bus-4.png";

    let busStopLoc = new google.maps.LatLng(busStop.lat, busStop.lng);
    let busMarker = new google.maps.Marker({
        position: busStopLoc,
        title: busStop.desc,
        icon: $iconBus
    });

    let contentString = makeInFoWindow(busStop);

    let infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

    busMarker.addListener('click', function () {
        infoWindow.open(map, busMarker);
    });

    stopMarkers.push(busMarker);   // Push this busMarker to the stopMarker array
    busMarker.setMap(map);     // To add the marker to the map, call setMap()
}




function addMarkers(busses) {
    // adding bus locations and icons

    $.each(busses, function(index, bus){
        console.log(bus);

        addStopToTable(index, bus);  // Add stops to table.
        addBus(bus);                // Add buses to map.

    });
}


function fetchArrivals(locID) {
    "use strict";
     // Requests the arrival times from TriMet: position, radius, appID, json
    let = data;

    let arriveParms = {'appID':'C04DA9067D94543B28DB02D54',
                     'locIDs': locID,
                     'json':'true',
                      'arrivals': '2'};

    $.ajax({
     url: 'https://developer.trimet.org/ws/v2/arrivals',
     method: 'GET',
     data: arriveParms,
     success: function(rsp){
         console.log(rsp);
         let times = rsp.resultSet.arrival;
         // addMarkers(times);
     },
     error: function(error){
         console.log(error);
     }
  });
}




function fetchStops(position, meters) {
    "use strict";
     // Requests the data from TriMet: position, radius, appID, json

    if (typeof meters === 'undefined') {
        let meters = '100';
    }

    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let dataPairs = {'ll':`${lat}, ${long}`,
                     'meters': meters,
                     'appID':'C04DA9067D94543B28DB02D54',
                     'json':'true'};

    $.ajax({
     url: 'https://developer.trimet.org/ws/V1/stops',
     method: 'GET',
     data: dataPairs,
     success: function(rsp){
         console.log(rsp);
         let busses = rsp.resultSet.location;
         addMarkers(busses);
     },
     error: function(error){
         console.log(error);
     }
  });
}



function setMapOnAll(map) {
    // Sets the map on all markers in the array.
    $.each(stopMarkers, function(index, stopMarker){
        stopMarker.setMap(map);
        });

    // for (var i = 0; i < markers.length; i++) {
    //   markers[i].setMap(map);
    //     }
}


function clearMarkers() {
    // Removes the markers from the map, but keeps them in the array.
    setMapOnAll(null);
}


function showMarkers() {
    // Shows any markers currently in the array.
    setMapOnAll(map);
}


function deleteMarkers() {
    // Deletes all markers in the array by removing references to them.
    clearMarkers();
    stopMarkers = [];
}


function clearTable() {
    // Clears all of the records from the table.
    $('#busses').empty();
}


$(function () {
    // slider handle, an ifie
    let handle = $("#custom-handle");

    // Slider below
    $("#slider").slider({
        value: 100,
        min: 0,
        max: 1000,
        step: 25,
        create: function () {
            handle.text($(this).slider("value"));
        },
        slide: function (event, ui) {
            handle.text(ui.value);
        },
        stop: function (event, ui) {
            navigator.geolocation.getCurrentPosition(function (position) {
                clearTable();
                clearMarkers();
                fetchStops(position, ui.value);
            });
        }
    }); // Ends Slider
});


function initMap(position) {
    // Puts the current location and marker on the map.

    let here = {lat:position.coords.latitude, lng:position.coords.longitude};

    map = new google.maps.Map(document.getElementById('map'), {
              zoom: 16,
              center: here,
              mapTypeId: 'satellite'
          });

    let busMarker = new google.maps.Marker({
      position: here,
      map: map
    });
}


function nav() {
    // gets the current position using latitude and longitude

    navigator.geolocation.getCurrentPosition(function(position) {
        fetchStops(position);  // calls the ajax function to get the data
        initMap(position);  // calls the initMap function show current position
    });
}