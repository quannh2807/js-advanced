const urlParams = new URLSearchParams(window.location.search);
const hospitalId = urlParams.get("hospitalId");

if (!hospitalId || hospitalId.length == 0 || hospitalId == "") {
  // redirect to index.html
  Swal.fire({
    icon: "error",
    title: "Oops...",
    html:
      'Có gì đó đang xảy ra!<p class="text-warning">Tự động quay trở lại trang chủ</p>',
  }).then((result) => {
    window.location.replace("index.html");
  });
}

window.patients = {
  db: customFirebase.getConnect(),

  getPatients: function () {
    let patientData = customFirebase.findById(
      this.db,
      "patients",
      "hospital_id",
      hospitalId
    );

    patientData.then((querySnapShot) => {
      let content = ``;
      querySnapShot.forEach((doc) => {
        content += `<tr id="row-${doc.id}">
                      <td id="name">${doc.data().name}</td>
                      <td id="age">${doc.data().age}</td>
                      <td id="bed_no">${doc.data().bed_no}</td>
                      <td id="address">${doc.data().address}</td>
                      <td id="avatar">
                        <img src="${
                          doc.data().avatar
                        }" class="img-thumbnail" width=200 />
                      </td>
                      <td>
                        <button class="btn btn-info" onclick="patients.updatePatient('${
                          doc.id
                        }')"><i class="fas fa-pencil-alt"></i></button>
                        <button class="btn btn-danger" onclick="patients.deletePatient('${
                          doc.id
                        }')"><i class="fas fa-trash"></i></button>
                      </td>
                    </tr>`;
      });
      $("tbody").html(content);
    });
  },

  createPatient: function () {
    if (
      $("#create-patient input[name=name]").is(":empty") ||
      $("#create-patient input[name=age]").is(":empty") ||
      $("#create-patient input[name=address]").is(":empty") ||
      $("#create-patient input[name=bed_no]").is(":empty") ||
      $("#create-patient input[name=avatar]").is(":empty")
    ) {
      $("#create-patient").trigger("reset");
    }
    $("#modal-1").modal("show");

    this.create_valid();

    $(".save-create").click(() => {
      if (!$("#create-patient").valid()) {
        return false;
      }

      let patientData = {
        name: $("#create-patient input[name=name]").val(),
        age: $("#create-patient input[name=age]").val(),
        address: $("#create-patient input[name=address]").val(),
        bed_no: $("#create-patient input[name=bed_no]").val(),
        hospital_id: $("#create-patient select[name=hospitalId]").val(),
        avatar: $("#create-patient input[name=avatar]").val()
          ? $("#create-patient input[name=avatar]").val()
          : defaultImage.patients,
      };

      customFirebase
        .createWithoutId(this.db, "patients", patientData)
        .then((snapShot) => {
          // add row
          document.querySelector("tbody").innerHTML += `
            <tr id="row-${snapShot.id}">
              <td id="name">${patientData.name}</td>
              <td id="age">${patientData.age}</td>
              <td id="bed_no">${patientData.bed_no}</td>
              <td id="address">${patientData.address}</td>
              <td id="avatar">
                <img src="${patientData.avatar}" class="img-thumbnail" width=200 />
              </td>
              <td>
                <button class="btn btn-info" onclick="patients.updatePatient('${snapShot.id}')"><i class="fas fa-pencil-alt"></i></button>
                <button class="btn btn-danger" onclick="patients.deletePatient('${snapShot.id}')"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`;

          Swal.fire(
            "Thêm mới thành công!",
            "Thông tin bệnh nhân đã được thêm mới.",
            "success"
          ).then(() => {
            $("#modal-1").modal("hide");
          });
        });
    });
  },

  deletePatient: function (patientId) {
    Swal.fire({
      title: "Bạn có chắc chắn không?",
      text: "Thông tin bệnh nhân sẽ không thể khôi phục",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "Hủy bỏ",
      confirmButtonText: "Xóa bệnh nhân",
    }).then((result) => {
      if (result.value) {
        customFirebase
          .deleteById(this.db, "patients", patientId)
          .then(() => {
            // delete row
            $(`#row-${patientId}`).remove();
            Swal.fire(
              "Xóa bệnh nhân thành công!",
              "Thông tin bệnh nhân đã được xóa.",
              "success"
            );
          })
          .catch((error) => console.log(error));
      }
    });
  },

  updatePatient: function (patientId) {

    // get all patients data
    customFirebase.fetchOne(this.db, "patients", patientId).then((doc) => {

      $("#modal-2 .modal-body input[name=name]").val(doc.data().name);
      $("#modal-2 .modal-body input[name=age]").val(doc.data().age);
      $("#modal-2 .modal-body input[name=address]").val(doc.data().address);
      $("#modal-2 .modal-body input[name=bed_no]").val(doc.data().bed_no);
      $("#modal-2 .modal-body input[name=avatar]").val(doc.data().avatar);

      $("#modal-2").modal("show");

      $("#modal-2 .modal-footer .save-update").click(() => {
        this.update_valid();

        if (!$("#update-patient").valid()) {
          return false;
        }

        let newPatient = {
          name: $("#modal-2 .modal-body input[name=name]").val(),
          age: $("#modal-2 .modal-body input[name=age]").val(),
          address: $("#modal-2 .modal-body input[name=address]").val(),
          bed_no: $("#modal-2 .modal-body input[name=bed_no]").val(),
          avatar: $("#modal-2 .modal-body input[name=avatar]").val()
            ? $("#modal-2 .modal-body input[name=avatar]").val()
            : defaultImage.patients,
          hospital_id: $("#modal-2 .modal-body select[name=hospitalId]").val(),
        };

        let oldPatient = {
          name: doc.data().name,
          age: doc.data().age,
          address: doc.data().address,
          bed_no: doc.data().bed_no,
          avatar: doc.data().avatar,
          hospital_id: doc.data().hospital_id,
        };

        if (customFirebase.isEqual(newPatient, oldPatient)) {
          Swal.fire("Dữ liệu bệnh nhân không được thay đổi").then(() => {
            $("#modal-2").modal("hide");
          });
          return false;
        } else {
          customFirebase
            .update(this.db, "patients", patientId, newPatient)
            .then(() => {
              if (newPatient.hospital_id !== oldPatient.hospital_id) {
                // xoa row tren ui
                Swal.fire(
                  "Sửa thành công!",
                  "Thông tin bệnh nhân đã được sửa.",
                  "success"
                ).then(() => {
                  $(`#row-${patientId}`).remove();
                  $("#modal-2").modal("hide");
                });
              } else {
                $(`#row-${patientId} td#name`).text(newPatient.name);
                $(`#row-${patientId} td#age`).text(newPatient.age);
                $(`#row-${patientId} td#bed_no`).text(newPatient.bed_no);
                $(`#row-${patientId} td#address`).text(newPatient.address);
                $(`#row-${patientId} td#avatar img`).attr(
                  "src",
                  newPatient.avatar
                );

                Swal.fire(
                  "Sửa thành công!",
                  "Thông tin bệnh nhân đã được sửa.",
                  "success"
                ).then(() => {
                  $("#modal-2").modal("hide");
                });
              }
            })
            .catch((error) => console.log(error));
        }
      });
    });
  },

  create_valid: function () {
    $("#create-patient").validate({
      rules: {
        name: {
          required: true,
          maxlength: 191,
          minlength: 2,
        },
        age: {
          required: true,
          number: true,
          min: 1,
          max: 100,
        },
        address: {
          required: true,
          maxlength: 191,
        },
        bed_no: {
          required: true,
          number: true,
          min: 0,
          max: 999,
        },
        avatar: {
          required: false,
          url: true,
        },
        hospitalId: {
          required: true,
        },
      },
      messages: {
        name: {
          required: "Nhập tên bệnh",
          maxlength: "Độ dài tối đa là 191 ký tự",
          minlength: "Độ dài tối thiểu là 2 ký tự",
        },
        age: {
          required: "Nhập tuổi bệnh nhân",
          number: "Tuổi bệnh nhân phải là số",
          min: "Tuổi của bệnh nhân phải lớn hơn 0",
          max: "Tuổi của bệnh nhân phải nhỏ hơn 100",
        },
        address: {
          required: "Nhập địa chỉ bệnh",
          maxlength: "Độ dài tối đa là 191 ký tự",
        },
        bed_no: {
          required: "Số giường bệnh phải được nhập",
          number: "Số giường bệnh phải là số",
          min: "Số giường bệnh tối thiểu là 1",
          max: "Số giường bệnh tối đa là 999",
        },
        avatar: {
          url: "Avatar có định dạng là link",
        },
        hospitalId: {
          required: "Chọn bệnh viện của bệnh nhân",
        },
      },
    });
  },

  update_valid: function () {
    $("#update-patient").validate({
      rules: {
        name: {
          required: true,
          maxlength: 191,
          minlength: 2,
        },
        age: {
          required: true,
          number: true,
          min: 1,
          max: 100,
        },
        address: {
          required: true,
          maxlength: 191,
        },
        bed_no: {
          required: true,
          number: true,
          min: 0,
          max: 999,
        },
        avatar: {
          required: false,
          url: true,
        },
        hospitalId: {
          required: true,
        },
      },
      messages: {
        name: {
          required: "Nhập tên bệnh",
          maxlength: "Độ dài tối đa là 191 ký tự",
          minlength: "Độ dài tối thiểu là 2 ký tự",
        },
        age: {
          required: "Nhập tuổi bệnh nhân",
          number: "Tuổi bệnh nhân phải là số",
          min: "Tuổi của bệnh nhân phải lớn hơn 0",
          max: "Tuổi của bệnh nhân phải nhỏ hơn 100",
        },
        address: {
          required: "Nhập địa chỉ bệnh",
          maxlength: "Độ dài tối đa là 191 ký tự",
        },
        bed_no: {
          required: "Số giường bệnh phải được nhập",
          number: "Số giường bệnh phải là số",
          min: "Số giường bệnh tối thiểu là 1",
          max: "Số giường bệnh tối đa là 999",
        },
        avatar: {
          url: "Avatar có định dạng là link",
        },
        hospitalId: {
          required: "Chọn bệnh viện của bệnh nhân",
        },
      },
    });
  },
};
