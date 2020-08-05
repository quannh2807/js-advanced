window.config = {
  fetchAll: function (url) {
    return axios({
      method: "GET",
      url: url,
      responseType: "json",
    });
    },

    update: function () {

    },

    findById: function (id) {

    }
};
