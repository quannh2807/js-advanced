window.patients = {
  db: customFirebase.getConnect(),

  fethcAll: function () {
    const db = this.db;

    db.collection("patients")
      .where("hospital_id", "==", hospitalId)
      .get()
        .then((result) => result.forEach((doc) =>
            db
            .collection('patients')
            .doc(doc.id)
            .delete()
            .then(() => console.log('Deleted'))
            .catch(error => console.log(error))
        ));
  },
};
