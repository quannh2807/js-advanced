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

const db = firebase.firestore();

// get data
db.collection("hotels")
    .get()
    .then((result) => {
        let content = ``;
        result.forEach((doc) => {
            let item = doc.data();
            content += `
                <tr id="row-${doc.id}">
                    <td>${item.name}</td>
                    <td>${item.address}</td>
                    <td>${item.room_number}</td>
                    <td><img src="${item.logo}" class="img-thumbnail" width=150 /></td>
                    <td>
                        <button class="btn btn-danger">Remove</button>
                        <button class="btn btn-info">Detail</button>
                    </td>
                </tr>
            `;
        });
        document.querySelector('tbody').innerHTML = content;
    });
