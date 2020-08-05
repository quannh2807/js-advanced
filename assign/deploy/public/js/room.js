const rooms = {
  db: customFirebase.getConnect(),
  getAllRooms: function (hotelId) {
    this.db.doc(`hotels/${hotelId}`)
      .collection("rooms")
      .get()
      .then((doc) => {
        let content = ``;
        doc.forEach((result) => {
          if (result.exists) {
            let item = result.data();
            content += `
            <tr id="row-${doc.id}">
              <td id="address">${item.room_number}</td>
              <td id="room_number">${item.floor}</td>
              <td id="logo"><img src="${item.feature_image}" class="img-thumbnail" width=150 /></td>
              <td>
                  <button class="btn btn-danger" onclick="hotels.remove('${doc.id}')">Remove</button>
                  <button class="btn btn-info my-1" onclick="hotels.getOne('${doc.id}')">Detail</button><br>
              </td>
            </tr>
          `;
          } else {
            $(location).attr('href', 'index.html');
          }
        });
        $("tbody").html(content);
      });
  },

  createRoom: function () {
    MicroModal.show("modal-2");

    $(".btn-save-create").click(() => {
      let data = {
        feature_image: document.querySelector("#modal-2-content input[name=feature_image]").value,
        floor: document.querySelector("#modal-2-content input[name=floor]")
          .value,
        room_number: document.querySelector(
          "#modal-2-content input[name=room_number]"
        ).value,
      };
      console.log(data);

      // if (
      //   data.name.length <= 0 ||
      //   data.address.length <= 0 ||
      //   data.logo.length <= 0 ||
      //   data.room_number.length < 0
      // ) {
      //   alert("Nhập thông tin khách sạn vào trước");
      // } else {
      //   // Add a new document with a generated id.
      //   this.db.collection("hotels")
      //     .add(data)
      //     .then(function (doc) {
      //       console.log("Document written with ID: ", doc.id);
      //       document.querySelector("tbody").innerHTML += `
      //               <tr id="row-${doc.id}">
      //                 <td id="name">${data.name}</td>
      //                 <td id="address">${data.address}</td>
      //                 <td id="room_number">${data.room_number}</td>
      //                 <td id="logo"><img src="${data.logo}" class="img-thumbnail" width=150 /></td>
      //                 <td>
      //                     <button class="btn btn-danger" onclick="hotels.remove('${doc.id}')">Remove</button>
      //                     <button class="btn btn-info" onclick="hotels.getOne('${doc.id}')">Detail</button>
      //                 </td>
      //               </tr>
      //         `;
      //       setTimeout(() => {
      //         MicroModal.close("modal-2");
      //       }, 500);
      //     })
      //     .catch(function (error) {
      //       console.error("Error adding document: ", error);
      //     });
      // }
    });
  },
};
