const hotels = {
  getAllData: function () {
    db.collection("hotels")
      .get()
      .then((result) => {
        // !result is an object data which we need
        let content = ``;
        result.forEach((doc) => {
          let item = doc.data();
          content += `
                <tr id="row-${doc.id}">
                    <td id="name">${item.name}</td>
                    <td id="address">${item.address}</td>
                    <td id="room_number">${item.room_number}</td>
                    <td id="logo"><img src="${item.logo}" class="img-thumbnail" width=150 /></td>
                    <td>
                        <button class="btn btn-danger" onclick="hotels.remove('${doc.id}')">Remove</button>
                        <button class="btn btn-info" onclick="hotels.getOne('${doc.id}')">Detail</button>
                    </td>
                </tr>
            `;
        });
        document.querySelector("tbody").innerHTML = content;
      });
  },

  remove: function (id) {
    Swal.fire({
      title: "Chắc chưa?",
      text: "Không thể khôi phục đâu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Ờ, cũng hợp lý",
      confirmButtonText: "méo quan tâm",
    }).then((result) => {
      if (result.value) {
        db.collection("hotels")
          .doc(id)
          .delete()
          .then(() => {
            document.querySelector(`#row-${id}`).remove();
          })
          .catch((error) => console.log(error));
      }
    });
  },

  create: function () {
    MicroModal.show("modal-2");

    document.querySelector(".btn-save-create").onclick = function () {
      let data = {
        name: document.querySelector("#modal-2-content input[name=name]").value,
        address: document.querySelector("#modal-2-content input[name=address]")
          .value,
        room_number: document.querySelector(
          "#modal-2-content input[name=room_number]"
        ).value,
        logo: document.querySelector("#modal-2-content input[name=logo]").value,
      };

      if (
        data.name.length <= 0 ||
        data.address.length <= 0 ||
        data.logo.length <= 0 ||
        data.room_number.length < 0
      ) {
        alert("Nhập thông tin khách sạn vào trước");
      } else {
        // Add a new document with a generated id.
        db.collection("hotels")
          .add(data)
          .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            document.querySelector("tbody").innerHTML += `
                  <tr id="row-${docRef.id}">
                    <td id="name">${data.name}</td>
                    <td id="address">${data.address}</td>
                    <td id="room_number">${data.room_number}</td>
                    <td id="logo"><img src="${data.logo}" class="img-thumbnail" width=150 /></td>
                    <td>
                        <button class="btn btn-danger" onclick="hotels.remove('${docRef.id}')">Remove</button>
                        <button class="btn btn-info" onclick="hotels.getOne('${docRef.id}')">Detail</button>
                    </td>
                  </tr>
            `;
            setTimeout(() => {
              MicroModal.close("modal-2");
            }, 1000);
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });
      }
    };
  },

  getOne: function (id) {
    db.collection("hotels")
      .doc(id)
      .get()
      .then((result) => {
        if (result.data()) {
          let title = document.querySelector("#modal-1-title");
          let content = document.querySelector("#modal-1-content");

          if (title.innerHTML != "" || content.innerHTML != "") {
            title.innerHTML = "";
            content.innerHTML = "";
          }

          title.innerHTML = `Hotel: ${result.data().name}`;
          content.innerHTML += `<h5><span class="font-weight-bold">Address:<br></span> ${
            result.data().address
          }$</h5>
                                <h5><span class="font-weight-bold">Number of rooms:<br></span> ${
                                  result.data().room_number
                                }</h5>
                                <h5><span class="font-weight-bold">Logo:<br></span> <img src="${
                                  result.data().logo
                                }" class="img-thumbnail" /></h5>
                              `;
          document
            .querySelector("#modal__btn-action")
            .setAttribute("onclick", `hotels.edit('${result.id}')`);
          // show modal
          MicroModal.show("modal-1");
        }
      });
  },

  edit: function (id) {
    // get data truyen vao input
    db.collection("hotels")
      .doc(id)
      .get()
      .then((result) => {
        let item = result.data();
        document.querySelector("#modal-2-content input[name=name]").value =
          item.name;
        document.querySelector("#modal-2-content input[name=address]").value =
          item.address;
        document.querySelector(
          "#modal-2-content input[name=room_number]"
        ).value = item.room_number;
        document.querySelector("#modal-2-content input[name=logo]").value =
          item.logo;

        document.querySelector(".btn-save-edit").innerText = "Save edit";
        // show modal
        MicroModal.show("modal-2");

        document.querySelector(".btn-save-edit").onclick = function () {
          let data = {
            name: document.querySelector("#modal-2-content input[name=name]")
              .value,
            address: document.querySelector(
              "#modal-2-content input[name=address]"
            ).value,
            room_number: document.querySelector(
              "#modal-2-content input[name=room_number]"
            ).value,
            logo: document.querySelector("#modal-2-content input[name=logo]")
              .value,
          };
          // Update
          if (
            data.name.length <= 0 ||
            data.address.length <= 0 ||
            data.logo.length <= 0 ||
            data.room_number.length < 0
          ) {
            alert("Nhập dữ liệu vào trước");
          } else {
            db.collection("hotels").doc(id).update(data);
            console.log("Success!");
            /**
             * ! sua data tren UI
             * Lay row-${id}
             * sua tung thanh phan
             */
            document.querySelector(`#row-${id} td[id=name]`).innerText =
              data.name;
            document.querySelector(`#row-${id} td[id=address]`).innerText =
              data.address;
            document.querySelector(`#row-${id} td[id=room_number]`).innerText =
              data.room_number;
            document.querySelector(`#row-${id} td[id=logo] img`).src =
              data.logo;
            setTimeout(() => {
              MicroModal.close("modal-2");
              MicroModal.close("modal-1");
            }, 500);
          }
        };
      });
  },
};
