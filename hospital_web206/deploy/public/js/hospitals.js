window.hospitals = {
  db: customFirebase.getConnect(),

  fetchAll: function () {
    this.db
      .collection("hospitals")
      .orderBy('bed_numbers')
      .get()
      .then((snapShot) => {
        let content = ``;
        let index = 1;
        snapShot.forEach((result) => {
          content += `
            <tr id="row-${result.id}">
              <th>${index++}</th>
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
                  }')"><i class="fas fa-trash"></i></button>
                  <a href="patient.html?hospitalId=${
                    result.id
                  }" class="btn btn-warning my-1"><i class="fas fa-procedures"></i></a>
              </td>
            </tr>
          `;
        });
        $("tbody").html(content);
      })
      .catch((error) => console.log(error));
  },

  remove: function (hospitalId) {
    let database = this.db;
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
              Swal.fire(
                "Xóa thành công!",
                "Thông tin bệnh viện và bệnh nhân đã xóa thành công.",
                "success"
              );
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
                      .then(() => {
                        console.log("Deleted");
                      })
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
    this.create_valid();

    $(".save-create").click(() => {
      if (!$("#create-hospital").valid()) {
        return false;
      }

      let hospitalData = {
        name: $("#create-hospital input[name=name]").val(),
        address: $("#create-hospital input[name=address]").val(),
        bed_numbers: parseInt(
          $("#create-hospital input[name=bed_numbers]").val()
        ),
        logo: $("#create-hospital input[name=logo]").val()
          ? $("#create-hospital input[name=logo]").val()
          : defaultImage.hospitals,
      };

      this.db
        .collection("hospitals")
        .add(hospitalData)
        .then((snapShot) => {
          Swal.fire(
            "Thêm mới thành công!",
            "Thông tin bệnh viện đã được thêm.",
            "success"
          ).then(() => {
            $("#modal-1").modal("hide");
            this.fetchAll();
          });
        })
        .catch((error) => console.log(error));
    });
  },

  update: function (hospitalId) {
    this.db
      .collection("hospitals")
      .doc(hospitalId)
      .get()
      .then((result) => {
        let item = result.data();
        $("#modal-2 .modal-header h5").text("Update Hospital");
        $("#modal-2 .modal-body input[name=name]").val(item.name);
        $("#modal-2 .modal-body input[name=address]").val(item.address);
        $("#modal-2 .modal-body input[name=logo]").val(item.logo);
        $("#modal-2 .modal-body input[name=bed_numbers]").val(item.bed_numbers);
        $("#modal-2 .modal-footer .save-update").text("Save Update");

        if (result) {
          $("#modal-2").modal("show");
        }

        $("#modal-2 .modal-footer .save-update").click(() => {
          this.update_valid();

          if (!$("#update-hospital").valid()) {
            return false;
          }

          let newData = {
            name: $("#modal-2 .modal-body input[name=name]").val(),
            address: $("#modal-2 .modal-body input[name=address]").val(),
            bed_numbers: parseInt(
              $("#modal-2 .modal-body input[name=bed_numbers]").val()
            ),
            logo: $("#modal-2 .modal-body input[name=logo]").val()
              ? $("#modal-2 .modal-body input[name=logo]").val()
              : defaultImage.hospitals,
          };
          let oldData = {
            name: item.name,
            address: item.address,
            bed_numbers: item.bed_numbers,
            logo: item.logo,
          };

          if (customFirebase.isEqual(newData, oldData)) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Dữ liệu bệnh viện không được thay đổi!",
            }).then((result) => {
              return false;
            });
            return false;
          } else {
            this.db
              .doc(`hospitals/${hospitalId}`)
              .update(newData)
              .then(() => {
                Swal.fire(
                  "Sửa thành công!",
                  "Thông tin bệnh viện đã được sửa.",
                  "success"
                ).then(() => this.fetchAll());
                return $("#modal-2").modal("hide");
              })
              .catch((error) => console.log(error));
          }
        });
      })
      .catch((error) => console.log(error));
  },

  create_valid: function () {
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
          min: 1,
          max: 2000,
        },
        logo: {
          required: true,
          url: true,
          extension: "jpg|png|gif",
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
          min: "Số giường không thể nhỏ hơn 1",
        },
        logo: {
          required: "Nhập logo bệnh viện",
          url: "Chỉ cho phép nhập logo theo link",
          extension: "Định dạng logo chưa hợp lệ",
        },
      },
    });
  },

  update_valid: function () {
    $("#update-hospital").validate({
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
          min: 1,
          max: 2000,
        },
        logo: {
          required: true,
          url: true,
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
          min: "Số giường không thể nhỏ hơn 1",
        },
        logo: {
          required: "Nhập logo bệnh viện",
          url: "Chỉ cho phép nhập logo theo link",
        },
      },
    });
  },
};
