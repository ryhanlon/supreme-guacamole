/**
 * Created by Rebecca Hanlon on 6/5/17.
 */


"use strict";


let map;


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

    let busStopLoc = new google.maps.LatLng(bus.lat, bus.lng);
    let Marker = new google.maps.Marker({
        position: busStopLoc,
        title: bus.desc
    });

    marker.setMap(map);

    // Add the info window

    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
        '<div id="bodyContent">' +
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the ' +
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
        'south west of the nearest large town, Alice Springs; 450&#160;km ' +
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
        'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
        'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
        'Aboriginal people of the area. It has many springs, waterholes, ' +
        'rock caves and ancient paintings. Uluru is listed as a World ' +
        'Heritage Site.</p>' +
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
        '(last visited June 22, 2009).</p>' +
        '</div>' +
        '</div>';

    let infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
}





function addMarkers(busses) {
    // adding bus locations and icons

    $.each(busses, function(index, bus){
        console.log(bus);

        addStopToTable(index, bus);
        addBus(bus);
    });
}


function dataCall(position, meters) {
    "use strict";
     // Requests the data from TriMet: position, radius, appID, json

    if (typeof meters === 'undefined') {
        var meters = '100';
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
                dataCall(position, ui.value);
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