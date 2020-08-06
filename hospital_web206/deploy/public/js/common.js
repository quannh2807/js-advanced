window.customFirebase = {
  getConnect: function () {
    var firebaseConfig = {
      apiKey: "AIzaSyDYJGr49FulvrVxIxQdu5U_sNFbpmEObSg",
      authDomain: "hospitals-web206.firebaseapp.com",
      databaseURL: "https://hospitals-web206.firebaseio.com",
      projectId: "hospitals-web206",
      storageBucket: "hospitals-web206.appspot.com",
      messagingSenderId: "1060559236342",
      appId: "1:1060559236342:web:eab49c37710f5918cd10d7",
      measurementId: "G-5KTFQ8B9ZV",
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    return firebase.firestore();
  },

  isEqual: function (objA, objB) {
    // Tạo các mảng chứa tên các property
    let aProps = Object.getOwnPropertyNames(objA);
    let bProps = Object.getOwnPropertyNames(objB);
    // Nếu độ dài của mảng không bằng nhau,
    // thì 2 objects đó không bằnh nhau.
    if (aProps.length != bProps.length) {
      return false;
    }

    for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i];
      // Nếu giá trị của cùng một property mà không bằng nhau,
      // thì 2 objects không bằng nhau.
      if (objA[propName] !== objB[propName]) {
        return false;
      }
    }
    // Nếu code chạy đến đây,
    // tức là 2 objects được tính lằ bằng nhau.
    return true;
  },

  fetchAll: function (database, collectionName) {
    return database.collection(collectionName).get();
  },

  fetchOne: function (database, collectionName, id) {
    return database.collection(collectionName).doc(id).get();
  },

  findById: function (database, collectionName, param, id) {
    return database.collection(collectionName).where(param , '==', id).get();
  },

  update: function (database, collectionName, id, data) {
    return database.collection(collectionName).doc(id).update(data);
  },

  delete: function (database, collectionName, id) {
    return database.collection(collectionName).delete(id);
  },

  createWithoutId: function (database, collectionName, data) {
    return database.collection(collectionName).add(data);
  }
};
