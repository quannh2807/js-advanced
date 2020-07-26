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
                                        <td>${item.id}</td>
                                        <td>${item.name}</td>
                                        <td><img src="${item.image}" class="img-fluid" width=150 /></td>
                                        <td>${item.cate_id}</td>
                                        <td>${item.price}$</td>
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
            confirmButtonText: "Ồ, đéo quan tâm",
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
        let getUrl = `${this.baseApiUrl}/${id}`;
        console.log(getUrl);
        axios({
            method: "GET",
            url: getUrl,
            responseType: "json",
        })
            .then((res) => {
                console.log(res.data);
                let title = document.querySelector("#modal-1-title");
                title.innerHTML = `${res.data.name}`;
                let content = document.querySelector("#modal-1-content");
                content.innerHTML += `
                    <h5><span class="font-weight-bold">Price:<br></span> ${res.data.price}$</h5>
                    <h5><span class="font-weight-bold">Category:<br></span> ${res.data.cate_id}</h5>
                    <h5><span class="font-weight-bold">Description:<br></span> ${res.data.short_desc}</h5>
                    <h5><span class="font-weight-bold">Image:<br></span> <img src="${res.data.image}" class="img-fluid" /></h5>
                `;
                let actionBtn = document.querySelector('#modal__btn-action');
                actionBtn.style.display = "none";
                /*
                Neu ma sua thi setEventLisner
                Show thi an di
                */
            })
            .catch((error) => console.log(error));

        MicroModal.show("modal-1");
    },
};
