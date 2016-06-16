angular.module('starter.controllers', ['firebase'])

.controller('IndexCtrl', function($scope, $state, User) {

  $scope.submit = function(username, password) {
    window.sessionStorage
    .setItem('ethylokey-mail', JSON.stringify(username));
    User.getUser(username, password).then(function(data) {
      console.log(data);
      $scope.user = data;
      $state.go('tab.home');
    }, function(error) {
      console.log(error);
      $scope.pop = function() {
          toaster.pop('success', 'title', error);
        };
    });
  };
})

.controller('TaxisCtrl', function($scope) {})

.controller('SettingsCtrl', function($scope, $location, User) {
  $scope.ble = function() {
    console.log('redirect ble');
    $location.path('/ble');
  };

  // var userMail = window.sessionStorage.getItem('ethylokey-mail');
  // userMail = JSON.parse(userMail);
  // User.getUser(userMail).then(function(data) {
  //   $scope.user = data;
  // }, function() {
  //   console.log(' va te faire');
  // });
  var user = window.sessionStorage.getItem('ethylokey-user-all');
  user = JSON.parse(user);
  $scope.user = user;

  $scope.update = function(user) {
    User.updateUser(user);
  };

  addAddressAutoCompletion()
  .then(addListenerOnAutoCompleteChanged);

  function addAddressAutoCompletion() {
    return new Promise(function(resolve) {
      // Create autocomplete field.
      var autocomplete = new google.maps.places.Autocomplete(
        document.querySelector('#autocomplete-input'), {
          types: ['address']
        });
      resolve(autocomplete);
    }.bind(this));
  }

  function addListenerOnAutoCompleteChanged(autocomplete) {
    return new Promise(function() {
      autocomplete.addListener('place_changed', function() {
        var userSession = window.sessionStorage.getItem('ethylokey-key');
        userSession = JSON.parse(userSession);
        var ref = firebase.database().ref('users/' + userSession);
        var location = autocomplete.getPlace().geometry.location;
        ref.update({
          adresse: autocomplete.getPlace().formatted_address,
          lat: location.lat(),
          lng: location.lng()
        });
      }.bind(this));
    }.bind(this));
  };
})

.controller('HotelsCtrl', function($scope) {})

.controller('BLECtrl', function($scope, $location, Bluetooth) {
  console.log('coucou ble');
  Bluetooth.startScan();
  $scope.devices = Bluetooth.devices;

  $scope.connect = function(device) {
    Bluetooth.connect(device);
  };
})

.controller('HomeCtrl', function($scope, $state, $cordovaGeolocation, User) {
  var options = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

    var latLng =
    new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var moi = {lat: position.coords.latitude, lng: position.coords.longitude};

    User.setMap();

    var dest = window.sessionStorage.getItem('ethylokey-map');
    dest = JSON.parse(dest);

    $scope.map = new google.maps.Map(document.getElementById('map'), {
      center: latLng,
      scrollwheel: false,
      zoom: 7
    });
    var directionsDisplay = new google.maps.DirectionsRenderer({
      map: $scope.map
    });
    // Set destination, origin and travel mode.
    var request = {
      destination: dest,
      origin: moi,
      travelMode: google.maps.TravelMode.DRIVING
    };

    // Pass the directions request to the directions service.
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        // Display the route on the map.
        directionsDisplay.setDirections(response);
      }
    });

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function() {

      document.querySelector('#home-spinner').setAttribute('hidden', 'true');

      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
    });

  }, function(error) {
    console.log('Could not get location');
  });

  User.getAlcolemie.then(function(data) {
    console.log(data);
    $scope.alcolemie = data;
  }, function() {
    console.log(' va te faire');
  });
  var userMail = window.sessionStorage.getItem('ethylokey-mail');
  userMail = JSON.parse(userMail);

  // User.getUser(userMail).then(function(data) {
  //   $scope.user = data;
  // }, function() {
  //   console.log(' va te faire');
  // });
  //
  var user = window.sessionStorage.getItem('ethylokey-user-all');
  user = JSON.parse(user);
  $scope.user = user;
});
