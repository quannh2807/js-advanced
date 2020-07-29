window.SystemCore = {
    baseApiUrl: "https://5f1a7521610bde0016fd292c.mockapi.io/quannh/products",

    fetchData: function () {
        axios({
            method: "GET",
            url: this.baseApiUrl,
            responseType: "json",
        })
            .then((res) => {
                if (res.statusText == "OK") {
                    let content = ``;
                    res.data.map((item) => {
                        content += `<tr id="data-${item.id}">
                                        <td data-target="id">${item.id}</td>
                                        <td data-target="name">${item.name}</td>
                                        <td data-target="image"><img src="${item.image}" class="img-fluid" width=150 /></td>
                                        <td data-target="price">${item.price}$</td>
                                        <td>
                                            <button class="btn btn-outline-danger mx-1"
                                                onclick="SystemCore.remove(${item.id})">Xoa</button>
                                            <button class="btn btn-outline-info"
                                                onclick="SystemCore.detail(${item.id})"
                                            >Chi tiet</button>
                                        </td>
                                    </tr>`;
                    });
                    document.querySelector("tbody").innerHTML = content;
                }
            })
            .catch((error) => console.log(error));
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
                Swal.fire("Xóa rồi đó!", "Đã tèo rồi, sướng chưa!", "success");
                // gui request xoa du lieu mockapi

                let removeUrl = `${this.baseApiUrl}/${id}`;
                axios
                    .delete(removeUrl)
                    .then((res) => console.log(res))
                    .then(() => document.querySelector(`#data-${id}`).remove());
            }
        });
    },

    detail: function (id) {
        // show modal
        MicroModal.show("modal-1");

        let getUrl = `${this.baseApiUrl}/${id}`;
        axios({
            method: "GET",
            url: getUrl,
            responseType: "json",
        })
            .then((res) => {
                let title = document.querySelector("#modal-1-title");
                let content = document.querySelector("#modal-1-content");

                if (title.innerText != "" || content.innerText != "") {
                    title.innerHTML = "";
                    content.innerHTML = "";
                }

                title.innerHTML = `Product: ${res.data.name}`;
                content.innerHTML += `
                    <h5><span class="font-weight-bold">Price:<br></span> ${res.data.price}$</h5>
                    <h5><span class="font-weight-bold">Category:<br></span> ${res.data.cate_id}</h5>
                    <h5><span class="font-weight-bold">Description:<br></span> ${res.data.short_desc}</h5>
                    <h5><span class="font-weight-bold">Image:<br></span> <img src="${res.data.image}" class="img-thumbnail" /></h5>
                `;
                let actionBtn = document.querySelector("#modal__btn-action");
                actionBtn.setAttribute(
                    "onclick",
                    `SystemCore.edit(${res.data.id})`
                );
                // actionBtn.addEventListener(MouseEvent.CLICK, SystemCore.edit(`${res.data.id}`));
                // actionBtn.onclick = SystemCore.edit(`${res.data.id}`);
            })
            .catch((error) => console.log(error));
    },

    edit: function (id) {
        let editUrl = `${this.baseApiUrl}/${id}`;
        axios({
            method: "GET",
            url: editUrl,
            responseType: "json",
        })
            .then((res) => {
                let title = document.querySelector("#modal-1-title");
                let content = document.querySelector("#modal-1-content");

                if (title.innerText != "" || content.innerText != "") {
                    title.innerHTML = "";
                    content.innerHTML = "";
                }
                title.innerHTML = "Edit product";
                content.innerHTML = `
                    <div class="form-group">
                        <label for="">Name</label>
                        <input type="text" name="name" class="form-control" value="${res.data.name}" />
                    </div>
                    <div class="form-group">
                        <label for="">Price</label>
                        <input type="text" name="price" class="form-control" value="${res.data.price}" />
                    </div>
                    <div class="form-group">
                        <label for="">Short Descript</label>
                        <input type="text" name="short_desc" class="form-control" value="${res.data.short_desc}" />
                    </div>
                    <div class="form-group">
                        <label for="">Image</label>
                        <input type="text" name="image" class="form-control" value="${res.data.image}">
                    </div>
                `;

                let actionBtn = document.querySelector("#modal__btn-action");
                // actionBtn.style.display = "none";
                actionBtn.innerText = "Save";
                actionBtn.setAttribute(
                    "onclick",
                    `SystemCore.saveEdit(${res.data.id})`
                );
                // actionBtn.addEventListener("click", SystemCore.edit);
            })
            .catch((error) => console.log(error));
    },

    saveEdit: function (id) {
        let data = {
            name: document.querySelector("#modal-1 input[name=name]").value,
            price: document.querySelector("#modal-1 input[name=price]").value,
            short_desc: document.querySelector(
                "#modal-1 input[name=short_desc]"
            ).value,
            image: document.querySelector("#modal-1 input[name=image]").value,
        };
        let editUrl = `${this.baseApiUrl}/${id}`;

        fetch(editUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            // Xu ly du lieu hien thi
            .then((result) => {
                if (result) {
                    document.querySelector(
                        `#data-${id} td[data-target=name]`
                    ).innerText = result.name;
                    document.querySelector(
                        `#data-${id} td[data-target=price]`
                    ).innerText = `${result.price}$`;
                    document.querySelector(
                        `#data-${id} td[data-target=image] img`
                    ).src = result.image;
                    // đóng modal
                    setTimeout(() => {
                        document
                            .querySelector(".js-modal-close-trigger")
                            .click();
                    }, 1000);
                }
            })
            .catch((error) => alert("Cập nhật không thành công " + error));
    },

    add: function () {
        MicroModal.show("modal-2");

        document.querySelector(".btn-save-create").onclick = function () {
            // lay du lieu
            let data = {
                name: document.querySelector("input[name=name]").value,
                price: document.querySelector("input[name=price]").value,
                short_desc: document.querySelector("input[name=short_desc]")
                    .value,
                image: document.querySelector("input[name=image]").value,
            };

            fetch(SystemCore.baseApiUrl, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((item) => {
                    let newRow = `<tr id="data-${item.id}">
                                        <td data-target="id">${item.id}</td>
                                        <td data-target="name">${item.name}</td>
                                        <td data-target="image"><img src="${item.image}" class="img-fluid" width=150 /></td>
                                        <td data-target="price">${item.price}$</td>
                                        <td>
                                            <button class="btn btn-outline-danger mx-1"
                                                onclick="SystemCore.remove(${item.id})">Xoa</button>
                                            <button class="btn btn-outline-info"
                                                onclick="SystemCore.detail(${item.id})"
                                            >Chi tiet</button>
                                        </td>
                                    </tr>`;

                    let content = document.querySelector("tbody").innerHTML;
                    content += newRow;
                    document.querySelector("tbody").innerHTML = content;
                    setTimeout(() => {
                        document.querySelector(".js-modal-cancel").click();
                    }, 1000);
                });
        };
    },
};
