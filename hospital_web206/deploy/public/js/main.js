window.hospitals = {
  db: customFirebase.getConnect(),

  fetchAll: function () {
    this.db
      .collection("hospitals")
      .get()
      .then((snapShot) => {
        let content = ``;
        snapShot.forEach(
          (result) =>
            (content += `
            <tr id="row-${result.id}">
              <td id="name">${result.data().name}</td>
              <td id="address">${result.data().address}</td>
              <td id="bed_numbers">${result.data().bed_numbers}</td>
              <td id="logo"><img src="${
                result.data().logo
              }" class="img-thumbnail" width=150 /></td>
              <td>
                  <button class="btn btn-info" onclick="hospitals.update('${
                    result.id
                  }')"><i class="fas fa-pencil-alt"></i></button>
                  <button class="btn btn-danger" onclick="hospitals.remove('${
                    result.id
                  }')"><i class="fas fa-trash"></i></button><br>
                  <a href="patient.html?hospitalId=${
                    result.id
                  }" class="btn btn-warning my-1"><i class="fas fa-procedures"></i></a>
              </td>
            </tr>
          `)
        );
        $("tbody").html(content);
      })
      .catch((error) => console.log(error));
  },

  remove: function (hospitalId) {
    const database = this.db;
    Swal.fire({
      title: "Bạn có chắc chắn không?",
      text:
        "Xóa bệnh viện sẽ xóa tất cả thông tin bệnh nhân, dữ liệu sẽ không thể khôi phục",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "Hủy bỏ",
      confirmButtonText: "Xóa bệnh viện",
    })
      .then((result) => {
        if (result.value) {
          database
            .collection("hospitals")
            .doc(hospitalId)
            .delete()
            .then(() => {
              $(`#row-${hospitalId}`).remove();

              // delete document
              database
                .collection("patients")
                .where("hospital_id", "==", hospitalId)
                .get()
                .then((snapShot) =>
                  snapShot.forEach((doc) =>
                    database
                      .collection("patients")
                      .doc(doc.id)
                      .delete()
                      .then(() => console.log("Deleted"))
                      .catch((error) => console.log(error))
                  )
                );
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  },

  create: function () {
    $("#modal-1").modal("show");
    $("#create-hospital").validate({
      rules: {
        name: {
          required: true,
          maxlength: 191,
          minlength: 2,
        },
        address: {
          required: true,
          maxlength: 191,
        },
        bed_numbers: {
          required: true,
          number: true,
          maxlength: 191,
        },
        logo: {
          required: true,
          maxlength: 191,
        },
      },
      messages: {
        name: {
          required: "Nhập tên bệnh",
          maxlength: "Độ dài tối đa là 191 ký tự",
          minlength: "Độ dài tối thiểu là 2 ký tự",
        },
        address: {
          required: "Nhập địa chỉ bệnh",
          maxlength: "Độ dài tối đa là 191 ký tự",
        },
        bed_numbers: {
          required: "Nhập số giường bệnh",
          number: "Chỉ nhập số",
          maxlength: "Độ dài tối đa là 191 ký tự",
        },
        logo: {
          required: "Nhập logo bệnh viện",
          maxlength: "Độ dài tối đa là 191 ký tự",
        },
      },
    });

    $(".save-create").click(() => {
      if ($("#create-hospital").valid()) {
        let hospitalData = {
          name: $("#create-hospital input[name=name]").val(),
          address: $("#create-hospital input[name=address]").val(),
          bed_numbers: $("#create-hospital input[name=bed_numbers]").val(),
          logo: $("#create-hospital input[name=logo]").val(),
        };

        this.db
          .collection("hospitals")
          .add(hospitalData)
          .then((snapShot) => {
            console.log("Document written with ID: ", snapShot.id);

            document.querySelector("tbody").innerHTML += `
              <tr id="row-${snapShot.id}">
                <td id="name">${hospitalData.name}</td>
                <td id="address">${hospitalData.address}</td>
                <td id="bed_numbers">${hospitalData.bed_numbers}</td>
                <td id="logo"><img src="${hospitalData.logo}" class="img-thumbnail" width=150 /></td>
                <td>
                    <button class="btn btn-info" onclick="hospitals.detail('${snapShot.id}')"><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn btn-danger" onclick="hospitals.remove('${snapShot.id}')"><i class="fas fa-trash"></i></button><br>
                    <a href="patient.html?hospitalId=${snapShot.id}" class="btn btn-warning my-1"><i class="fas fa-procedures"></i></a>
                </td>
              </tr>
            `;
            $("#modal-1").modal("hide");
          })
          .catch((error) => console.log(error));
      } else {
        console.log("Not Valid");
      }
    });
  },

  update: function (hospitalId) {
    this.db
      .collection("hospitals")
      .doc(hospitalId)
      .get()
      .then((result) => {
        let item = result.data();
        $(".modal .modal-header h5").text("Update Hospital");
        $(".modal .modal-body input[name=name]").val(item.name);
        $(".modal .modal-body input[name=address]").val(item.address);
        $(".modal .modal-body input[name=logo]").val(item.logo);
        $(".modal .modal-body input[name=bed_numbers]").val(item.bed_numbers);
        $(".modal .modal-footer .save-update").text("Save Update");

        if (result) {
          $("#modal-1").modal("show");
        }

        $(".modal .modal-footer .save-update").click(() => {
          $("#create-hospital").validate({
            rules: {
              name: {
                required: true,
                maxlength: 191,
                minlength: 2,
              },
              address: {
                required: true,
                maxlength: 191,
              },
              bed_numbers: {
                required: true,
                number: true,
                maxlength: 191,
              },
              logo: {
                required: true,
                maxlength: 191,
              },
            },
            messages: {
              name: {
                required: "Nhập tên bệnh",
                maxlength: "Độ dài tối đa là 191 ký tự",
                minlength: "Độ dài tối thiểu là 2 ký tự",
              },
              address: {
                required: "Nhập địa chỉ bệnh",
                maxlength: "Độ dài tối đa là 191 ký tự",
              },
              bed_numbers: {
                required: "Nhập số giường bệnh",
                number: "Chỉ nhập số",
                maxlength: "Độ dài tối đa là 191 ký tự",
              },
              logo: {
                required: "Nhập logo bệnh viện",
                maxlength: "Độ dài tối đa là 191 ký tự",
              },
            },
          });

          if (!$("#create-hospital").valid()) {
            return false;
          }

          let newData = {
            name: $(".modal .modal-body input[name=name]").val(),
            address: $(".modal .modal-body input[name=address]").val(),
            bed_numbers: $(".modal .modal-body input[name=bed_numbers]").val(),
            logo: $(".modal .modal-body input[name=logo]").val(),
          };
          let oldData = {
            name: item.name,
            address: item.address,
            bed_numbers: item.bed_numbers,
            logo: item.logo,
          };

          if (customFirebase.isEqual(newData, oldData)) {
            alert("Dữ liệu bệnh viện không thay đổi");
            $("#modal-1").modal("hide");
            return false;
          }

          this.db
            .doc(`hospitals/${hospitalId}`)
            .update(newData)
            .then(() => {
              $(`#row-${hospitalId} td#name`).text(newData.name);
              $(`#row-${hospitalId} td#address`).text(newData.address);
              $(`#row-${hospitalId} td#bed_numbers`).text(newData.bed_numbers);
              $(`#row-${hospitalId} td#logo img`).attr("src", newData.logo);

              return $("#modal-1").modal("hide");
            })
            .catch((error) => console.log(error));
        });
      })
      .catch((error) => console.log(error));
  },
};
