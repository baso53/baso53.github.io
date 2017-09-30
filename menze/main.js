function initMap(foundIndex, myLocation) {
    var uluru = { lat: 45.813, lng: 15.9779 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: myLocation ? myLocation: uluru
    });
    
    restorani.forEach(function(restoran){
        restoran.marker = new google.maps.Marker({
            position: restoran["coordinates"],
            map: map,
            title: restoran["name"]
        });
    });

    if (myLocation){
      new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: myLocation,
        radius: 50
      });
      var startEnd = [
        myLocation,
        restorani[foundIndex].marker.position
      ];
      var airLine = new google.maps.Polyline({
        path: startEnd,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
      });
      var closestDiv = document.querySelector("#closest");
      closestDiv.style.height = "100px";
      closestDiv.innerHTML = "Najbliži je " + restorani[foundIndex].name;
    }
}


function getClosestRestaurant(givenLocation){
  var location = new google.maps.LatLng(givenLocation);
  var minDistance = 100000000;
  var minIndex = 0;

  restorani.forEach(function(restoran, index){
    var distance = google.maps.geometry.spherical.computeDistanceBetween (location, restoran.marker.position);
    if (distance < minDistance){
      minDistance = distance;
      minIndex = index;
    }
  });

  initMap(minIndex, location);
}

function getCoordinatesByLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      getClosestRestaurant(pos);
    }, function() {
      console.log("error");
    });
  }
}

function getCoordinates(){
  var searchString = document.querySelector("#addressInput").value;
  var foundJSON;
  
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          foundJSON = JSON.parse(this.responseText);
          console.log(foundJSON);
          if (foundJSON.status !== "OK"){
            alert("Couldn't find location!");
          } else{
            getClosestRestaurant(foundJSON.results[0].geometry.location);
          }
      }
  };
  xmlhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address=" + searchString + "+Zagreb" + "&key=AIzaSyAEiwDXTvOYhVW7SY4uk-o2N2S6ZLDijck", true);
  xmlhttp.send();
}

var restorani = 
[
    {
      "id": 0,
      "name": "Cassandra",
      "address": "Unska 3, Zagreb",
      "coordinates": {
        "lat": 45.800143,
        "lng": 15.969357
      }
    },
    {
      "id": 1,
      "name": "Restoran SUPERFAKS",
      "address": "Pierottijeva 6, Zagreb",
      "coordinates": {
        "lat": 45.807100,
        "lng": 15.961858
      }
    },
    {
      "id": 2,
      "name": "Restoran brze prehrane Bologna",
      "address": "Horvatovac 102a, Zagreb",
      "coordinates": {
        "lat": 45.826362,
        "lng": 15.986362
      }
    },
    {
      "id": 3,
      "name": "Restoran Borongaj - blagavaona Tekstilni",
      "address": "Prilaz Baruna Filipovića 28a, Zagreb",
      "coordinates": {
        "lat": 45.812054,
        "lng": 15.936581
      }
    },
    {
      "id": 4,
      "name": "Restoran Borongaj",
      "address": "Borongajska cesta bb, Zagreb",
      "coordinates": {
        "lat": 45.813380,
        "lng": 16.040415
      }
    },
    {
      "id": 5,
      "name": "Restoran brze prehrane FSB",
      "address": "Ivana Lučića 5, Zagreb",
      "coordinates": {
        "lat": 45.795336,
        "lng": 15.969052
      }
    },
    {
      "id": 6,
      "name": "Restoran na Agron. i šum. fakultetu",
      "address": "Svetošimunska 25, Zagreb",
      "coordinates": {
        "lat": 45.827546,
        "lng": 16.028753
      }
    },
    {
      "id": 7,
      "name": "Restoran na Akademiji lik. umjetnosti",
      "address": "Ilica 85, Zagreb",
      "coordinates": {
        "lat": 45.811524,
        "lng": 15.962471
      }
    },
    {
      "id": 8,
      "name": "Restoran na Ekonomskom fakultetu",
      "address": "Trg J. F. Kennedyja 6, Zagreb",
      "coordinates": {
        "lat": 45.816035,
        "lng": 16.011026
      }
    },
    {
      "id": 9,
      "name": "Restoran na Medicinskom fakultetu",
      "address": "Šalata 3b, Zagreb",
      "coordinates": {
        "lat": 45.836932,
        "lng": 15.990086
      }
    },
    {
      "id": 10,
      "name": "Restoran na Veterinarskom fakultetu",
      "address": "Heinzelova 55, Zagreb",
      "coordinates": {
        "lat": 45.824373,
        "lng": 16.009312
      }
    },
    {
      "id": 11,
      "name": "Restoran Savska",
      "address": "Savska cesta 25, Zagreb",
      "coordinates": {
        "lat": 45.8039449,
        "lng": 15.9632854
      }
    },
    {
      "id": 12,
      "name": "Restoran u Stud. domu Cvjetno naselje",
      "address": "Odranska 8, Zagreb",
      "coordinates": {
        "lat": 45.791507,
        "lng": 15.960875
      }
    },
    {
      "id": 13,
      "name": "Restoran u Stud. domu Lašćina",
      "address": "Lašćinska cesta 32, Zagreb",
      "coordinates": {
        "lat": 45.822067,
        "lng": 15.997242
      }
    },
    {
      "id": 14,
      "name": "Restoran u Stud. domu Stjepan Radić",
      "address": "Jarunska 2, Zagreb",
      "coordinates": {
        "lat": 45.785134,
        "lng": 15.945239
      }
    },
    {
      "id": 15,
      "name": "Odeon ugostiteljski obrt Branko Babić",
      "address": "Andrije Kačića-Miošića 26, Zagreb",
      "coordinates": {
        "lat": 45.808644,
        "lng": 15.961447
      }
    }
  ];