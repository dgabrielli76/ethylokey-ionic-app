angular.module('starter.services', ['firebase'])

.service('User', function() {
  var config = {
    apiKey: 'AIzaSyBq3LD3LsRzn03JU3w_4iHXd3a8frvdL0U',
    authDomain: 'ethylobase.firebaseapp.com',
    databaseURL: 'https://ethylobase.firebaseio.com',
    storageBucket: 'ethylobase.appspot.com',
  };
  firebase.initializeApp(config);
  var db = firebase.database();

  this.getUser = function(userMail, password) {
    return new Promise(function(resolve, reject) {
      var ref = db.ref('users').orderByChild('mail').equalTo(userMail);
      ref.on('value', function(snapshot) {
        if (snapshot.val()) {
          window.sessionStorage
          .setItem('ethylokey-key', JSON.stringify(Object.keys(snapshot.val())));
          //set map
          var user = window.sessionStorage.getItem('ethylokey-key');
          user = JSON.parse(user);
          ref = db.ref('users/' + user);
          ref.on('value', function(snapshot) {
            var home = {lat: snapshot.val().lat, lng: snapshot.val().lng};
            window.sessionStorage.setItem('ethylokey-map', JSON.stringify(home));
            console.log(password);
            if (password && password === snapshot.val().password) {
              window.sessionStorage
              .setItem('ethylokey-user-all', JSON.stringify(snapshot.val()));
              resolve(snapshot.val());
            } else {
              reject('mauvais mdp');
            }
          }, function(errorObject) {
            console.log('The read failed: ' + errorObject.code);
          });
        } else {
          function createGuid() {
            return 'xxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r&0x3 | 0x8);
              return v.toString(16); });
          }
          var uuid = createGuid(); console.log(uuid);
          var ref = db.ref('users/' + uuid);
          ref.set({
            adresse: '',
            age: '',
            lat: '',
            lng: '',
            mail: userMail,
            numeroFav: '',
            poids: '',
            sexe: '',
            password: password
          });
          resolve({
            adresse: '',
            age: '',
            lat: '',
            lng: '',
            mail: userMail,
            numeroFav: '',
            poids: '',
            sexe: '',
            password: password
          });
        }
      }, function(errorObject) {
        console.log('The read failed: ' + errorObject.code);
      });
    });
  };

  this.setMap = function() {
    console.log('setMap');
    var user = window.sessionStorage.getItem('ethylokey-key');
    user = JSON.parse(user);
    ref = db.ref('users/' + user);
    ref.on('value', function(snapshot) {
      var home = {lat: snapshot.val().lat, lng: snapshot.val().lng};
      window.sessionStorage.setItem('ethylokey-map', JSON.stringify(home));
    }, function(errorObject) {
      console.log('The read failed: ' + errorObject.code);
    });
  };

  this.getAlcolemie = new Promise(function(resolve) {
    var user = window.sessionStorage.getItem('ethylokey-key');
    user = JSON.parse(user);
    console.log(user);
    ref = db.ref('history/ethylokey/' + user);
    ref.on('value', function(snapshot) {
      console.log(snapshot.val());
      resolve(snapshot.val());
    }, function(errorObject) {
      console.log('The read failed: ' + errorObject.code);
    });
  }),

  // this.addUser = function(mail, passwd) {
  //   firebase.auth().createUserWithEmailAndPassword(mail, passwd)
  //   .catch(function(error) {
  //     // Handle Errors here.
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     console.log(errorCode, errorMessage);
  //   });
  //
  //   var ref = db.ref('users/HkvTOek_SSSSS');
  //   ref.set({mail: mail});
  // };

  this.updateUser = function(user) {
    console.log(user);
    var userSession = window.sessionStorage.getItem('ethylokey-key');
    userSession = JSON.parse(userSession);
    var ref = db.ref('users/' + userSession);
    ref.update({
      age: user.age,
      poids: user.poids,
      sexe: user.sexe,
      numeroFav: user.numeroFav
    });
  };
})

.factory('Hotels', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Le Florence',
    lastText: '33€',
    face: 'img/hotel.png'
  }, {
    id: 1,
    name: 'Ibis',
    lastText: '38€',
    face: 'img/hotel.png'
  },
    {
    id: 3,
    name: 'Ibis Bubdget',
    lastText: '30€',
    face: 'img/hotel.png'
  }, {
    id: 4,
    name: 'Hôtel Mémorial',
    lastText: '43€',
    face: 'img/hotel.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Taxis', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Taxis Vasseur',
    lastText: 'You on your way?',
    face: 'img/taxi.png'
  }, {
    id: 1,
    name: 'Gomes Manuel',
    lastText: 'Hey, it\'s me',
    face: 'img/taxi.png'
  },
    {
    id: 3,
    name: 'Taxi Eco Services',
    lastText: 'Look at my mukluks!',
    face: 'img/taxi.png'
  }, {
    id: 4,
    name: 'Timarche Jean-René',
    lastText: 'This is wicked good ice cream.',
    face: 'img/taxi.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
