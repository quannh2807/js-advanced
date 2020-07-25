window.SystemCore = {
    baseApiUrl: "https://5f1a7521610bde0016fd292c.mockapi.io/quannh/products",

    fetchData: function () {
        fetch(this.baseApiUrl)
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    let content = ``;
                    data.map((item) => {
                        content += `<tr id="data-${item.id}">
                                        <td>${item.id}</td>
                                        <td>${item.name}</td>
                                        <td><img src="${item.image}" class="img-fluid" width=150 /></td>
                                        <td>${item.cate_id}</td>
                                        <td>${item.price}</td>
                                        <td>
                                            <button class="btn btn-outline-danger mx-1"
                                                onclick="SystemCore.remove(${item.id})">Xoa</button>
                                            <button class="btn btn-outline-info" onclick="SystemCore.detail(${item.id})"
                                            type="button"
                                            class="btn btn-primary"
                                            data-toggle="modal"
                                            data-target="#exampleModalLong"
                                            >Chi tiet</button>
                                        </td>
                                    </tr>`;
                    });
                    document.querySelector("tbody").innerHTML = content;
                }
            });
    },

    remove: function (id) {
        // gui request xoa du lieu mockapi
        let removeUrl = `${this.baseApiUrl}/${id}`;

        fetch(removeUrl, { method: "DELETE" })
            .then((res) => res.json())
            .then((data) => {
                // xoa DOM tren trinh duyet
                document.querySelector(`#data-${data.id}`).remove();
            });
    },

    showForm: function (id) {
        // get url
        let changeUrl = `${this.baseApiUrl}/${id}`;
        // show data
        fetch(changeUrl, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                let modalContent = document.querySelector(".modal-content");
                modalContent.innerHTML = `
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="recipient-name" class="col-form-label">Produc Name:</label>
                            <input type="text" class="form-control" id="recipient-name" name="name" value="${data.name}">
                        </div>
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Short Description:</label>
                            <textarea class="form-control" id="message-text">${data.short_desc}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Price:</label>
                            <textarea class="form-control" id="message-text">${data.price}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Image:</label>
                            <div class="row">
                                <img src="${data.image}" class="img-fluid col-4">
                                <input type="file" class="form-control-file col-8" />
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"
                        onclick="SystemCore.saveChange(${data.id})">
                        Save change
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        Close
                    </button>
                </div>
                `;
            });
    },

    saveChange: function (id) {
        let changeUrl = `${this.baseApiUrl}/${id}`;

        fetch(changeUrl, { method: "PUT" })
            .then((res) => res.json())
            .then(data => {
            console.log(data);
        })

    },

    detail: function (id) {
        let detailUrl = `${this.baseApiUrl}/${id}`;

        fetch(detailUrl, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                let modalContent = document.querySelector(".modal-content");
                modalContent.innerHTML = `
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle"><span class="font-weight-bold">Product: </span>${data.name}</h5>
                    <button type="button" class="close" data-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="card mb-3 px-2" style="max-width: 540px;">
                        <div class="row no-gutters justify-content-center align-items-center">
                            <div class="col-md-4">
                                <img src="${data.image}" class="card-img" alt="...">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${data.name}</h5>
                                    <p class="card-text text-danger">${data.price}$</p>
                                    <p class="card-text">${data.short_desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"
                        onclick="SystemCore.showForm(${data.id})">
                        Change product
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        Close
                    </button>
                </div>
                `;
            });
    },
};

// function encodeImageFileAsURL(element) {
//     var file = element.files[0];
//     if (file === undefined) {
//         $("#preview-img").attr("src", `${data.image}`);
//         return false;
//     }
//     var reader = new FileReader();
//     reader.onloadend = function () {
//         $("#preview-img").attr("src", reader.result);
//     };
//     reader.readAsDataURL(file);
// }
