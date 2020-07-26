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
            });
    },

    remove: function (id) {
        Swal.fire({
            title: "Chắc chưa?",
            text: "Không thể khôi phục đâu!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ồ, đéo quan tâm!",
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    "Xóa rồi đó!",
                    "Đã tèo rồi, sướng chưa.",
                    "success"
                );
                // gui request xoa du lieu mockapi
                let removeUrl = `${this.baseApiUrl}/${id}`;
                fetch(removeUrl, { method: "DELETE" })
                    .then((res) => res.json())
                    .then((data) => {
                        // xoa DOM tren trinh duyet
                        document.querySelector(`#data-${data.id}`).remove();
                    });
            }
        });
    },
};

/*
function encodeImageFileAsURL(element) {
    var file = element.files[0];
    if (file === undefined) {
        $("#preview-img").attr("src", `${data.image}`);
        return false;
    }
    var reader = new FileReader();
    reader.onloadend = function () {
        $("#preview-img").attr("src", reader.result);
    };
    reader.readAsDataURL(file);
}
*/
