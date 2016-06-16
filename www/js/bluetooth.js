angular.module('starter').factory('Bluetooth', function ($rootScope, $interval, $timeout) {
  /*****************************************************************************
   * Service Initialization
   *****************************************************************************/
  var service = {};

  /*****************************************************************************
   * Service's Constants Initialization
   *****************************************************************************/
  /* BLE Parameters */
  service.VSP_SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
  service.RX_CHARACTERISTIC_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
  service.TX_CHARACTERISTIC_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';

  /*****************************************************************************
   * Service's Variables Initialization
   *****************************************************************************/
  service.devices = [];
  service.scanInProgress = false;
  service.connected = false;

  /*****************************************************************************
   * BLE Scan Start
   *****************************************************************************/
  service.startScan = function() {
    console.log("scan");
    service.devices = [];
    service.scanInProgress = true;
    // $rootScope.$apply();

    /* Start BLE scan */
    ble.startScan([],
      function(device) {
        console.log(device);
        service.devices.push(device);
        $rootScope.$apply();
      },
      service.onError
    );
  };

  /*****************************************************************************
   * BLE Scan Stop
   *****************************************************************************/
  service.stopScan = function() {
    /* Stop BLE scan */
    ble.stopScan(
      function() {

        service.scanInProgress = false;
        $rootScope.$apply();
      },
      service.onError
    );
  };

  /*****************************************************************************
   * BLE Connection
   *****************************************************************************/
  service.connect = function(device) {
    console.log("connect");
    console.log(device);
    service.stopScan();
    service.device=device;
    /* Connect to BLE device */
    ble.connect(service.device.id, function() {
      console.log('connected');
      service.connected = true;

      /* Register to TX characteristic notifications */
      ble.startNotification(service.device.id, service.VSP_SERVICE_UUID, service.RX_CHARACTERISTIC_UUID, service.onData, service.onError);

    }, function(peripheral) {
      console.log('disconnected');
      if(service.connected) {
        service.connected = false;

        $rootScope.$apply();
      }
      /* If the connection failed */
      else {
        service.connect(service.device);
      }
    });
  };



  /*****************************************************************************
   * BLE Disconnection
   *****************************************************************************/
  service.disconnect = function() {
    if(service.device.id) ble.disconnect(service.device.id, function() {
      service.device= null;
      service.connected = false;
      $rootScope.$apply();
    }, service.onError);
  };

  /*****************************************************************************
   * BLE Data Reception
   *****************************************************************************/
  var receivedData = [];
  service.onData = function(buffer) {
    console.log(buffer);
    var data = new Uint8Array(buffer);
    console.log(data);
    var i;
    var maDonnee = String.fromCharCode.apply(null, data);
    var user = window.sessionStorage.getItem('ethylokey-key');
    user = JSON.parse(user);
    //return String.fromCharCode.apply(null, data);
    var alcool = parseFloat(maDonnee);
    var ref2 = firebase.database().ref('history/ethylokey/' + user);
    //Get the data
    var time = new Date().toDateString();
    ref2.set({
      alcoolemie: alcool,
      date: time
    });

    // gerer les data recues
  };

  service.onError = function(error) {
    /* Log error */
    console.log(error);
    //Log.logError(error);
  };

  /*****************************************************************************
   * Return created service
   *****************************************************************************/
  return service;
});
