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
      let index = 1;
      querySnapShot.forEach((doc) => {
        content += `<tr id="row-${doc.id}">
                      <td id="index">${index++}</td>
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

    this.valid();

    $(".save-create").click(() => {
      if (!$("#create-patient").valid()) {
        return false;
      }

      let patientData = {
        name: $("#create-patient input[name=name]").val(),
        age: $("#create-patient input[name=age]").val(),
        address: $("#create-patient input[name=address]").val(),
        bed_no: $("#create-patient input[name=bed_no]").val(),
        hospital_id: hospitalId,
        avatar: $("#create-patient input[name=avatar]").val()
          ? $("#create-patient input[name=bed_no]").val()
          : defaultImage.patients,
      };

      customFirebase
        .createWithoutId(this.db, "patients", patientData)
        .then((snapShot) => {
          console.log("Document written with ID: ", snapShot.id, snapShot);
          let index = $("tr td#index").length;
          // add row
          document.querySelector("tbody").innerHTML += `
            <tr id="row-${snapShot.id}">
              <td id="index">${++index}</td>
              <td id="name">${patientData.name}</td>
              <td id="age">${patientData.age}</td>
              <td id="bed_no">${patientData.bed_no}</td>
              <td id="address">${patientData.address}</td>
              <td id="avatar">
                <img src="${
                  patientData.avatar
                }" class="img-thumbnail" width=200 />
              </td>
              <td>
                <button class="btn btn-info" onclick="patients.updatePatient('${
                  snapShot.id
                }')"><i class="fas fa-pencil-alt"></i></button>
                <button class="btn btn-danger" onclick="patients.deletePatient('${
                  snapShot.id
                }')"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`;

          $("#modal-1").modal("hide");
          Swal.fire(
            "Thêm mới thành công!",
            "Thông tin bệnh nhân đã được thêm mới.",
            "success"
          );
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
    /**
     * 1. Get Patient by patientId
     * 2. Validate: equal, form ...
     * 3. Save
     */
    customFirebase.fetchOne(this.db, "patients", patientId).then((doc) => {
      $(".modal .modal-header h5").text("Update Patient");
      $(".modal .modal-body input[name=name]").val(doc.data().name);
      $(".modal .modal-body input[name=age]").val(doc.data().age);
      $(".modal .modal-body input[name=address]").val(doc.data().address);
      $(".modal .modal-body input[name=bed_no]").val(doc.data().bed_no);
      $(".modal .modal-body input[name=avatar]").val(doc.data().avatar);
      $(".modal .modal-footer .save-update").text("Save Update");

      if (doc) {
        $("#modal-1").modal("show");
      }

      $(".modal .modal-footer .save-update").click(() => {
        this.valid();

        if (!$("#create-patient").valid()) {
          return false;
        }

        let newPatient = {
          name: $(".modal .modal-body input[name=name]").val(),
          age: $(".modal .modal-body input[name=age]").val(),
          address: $(".modal .modal-body input[name=address]").val(),
          bed_no: $(".modal .modal-body input[name=bed_no]").val(),
          avatar: $(".modal .modal-body input[name=avatar]").val()
            ? $(".modal .modal-body input[name=avatar]").val()
            : defaultImage.patients,
        };

        let oldPatient = {
          name: doc.data().name,
          age: doc.data().age,
          address: doc.data().address,
          bed_no: doc.data().bed_no,
          avatar: doc.data().avatar,
        };

        if (customFirebase.isEqual(newPatient, oldPatient)) {
          alert("Dữ liệu bệnh nhân không thay đổi");
          $("#modal-1").modal("hide");
          return false;
        }

        customFirebase
          .update(this.db, "patients", patientId, newPatient)
          .then(() => {
            $(`#row-${patientId} td#name`).text(newPatient.name);
            $(`#row-${patientId} td#age`).text(newPatient.age);
            $(`#row-${patientId} td#bed_no`).text(newPatient.bed_no);
            $(`#row-${patientId} td#address`).text(newPatient.address);
            $(`#row-${patientId} td#avatar img`).attr("src", newPatient.avatar);

            $("#modal-1").modal("hide");
            Swal.fire(
              "Sửa thành công!",
              "Thông tin bệnh nhân đã được sửa.",
              "success"
            );
          })
          .catch((error) => console.log(error));
      });
    });
  },

  valid: function () {
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
      },
    });
  },
};
