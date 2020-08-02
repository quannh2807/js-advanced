const rooms = {
  getAllRooms: function (hotelId) {
    db.doc(`hotels/${hotelId}`)
      .collection("rooms")
      .get()
      .then((doc) => {
        if (doc.exists) {
          let content = ``;
          doc.forEach((result) => {
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
          });
          $("tbody").html(content);
        } else {
          window.location.replace('index.html');
        }
      });
  },
};
