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
                      <td>
                        <button class="btn btn-info" onclick="hospitals.update('${
                          doc.id
                        }')"><i class="fas fa-pencil-alt"></i></button>
                        <button class="btn btn-danger" onclick="hospitals.remove('${
                          doc.id
                        }')"><i class="fas fa-trash"></i></button>
                      </td>
                    </tr>`;
      });

      $("tbody").html(content);
    });
  },
};
