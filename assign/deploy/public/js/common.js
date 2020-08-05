window.customFirebase = {
  getConnect: function () {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyBjsyq7nUCUeay8eXQmMO74jEaPGuVdcHQ",
      authDomain: "quannhph09166-web206-pt15111.firebaseapp.com",
      databaseURL: "https://quannhph09166-web206-pt15111.firebaseio.com",
      projectId: "quannhph09166-web206-pt15111",
      storageBucket: "quannhph09166-web206-pt15111.appspot.com",
      messagingSenderId: "1089652722378",
      appId: "1:1089652722378:web:d44a643519004bcb154233",
      measurementId: "G-4BXY49G1L1",
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    return firebase.firestore();
  },

  fetchAll: function () {

  }
};
