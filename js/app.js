

function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
      center: {lat: 40.7059, lng: -74.1285},
      zoom: 12
    });
  }