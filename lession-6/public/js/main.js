window.SystemCore = {
    baseApiUrl: "https://5f1a7521610bde0016fd292c.mockapi.io/quannh/hotels",

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
                                        <td>${item.address}</td>
                                        <td><img src="${item.logo}" class="img-fluid" /></td>
                                        <td>
                                            <button class="btn btn-outline-primary"
                                                onclick="SystemCore.removeHotel(${item.id})">Xoa</button>
                                        </td>
                                    </tr>`;
                    });
                    document.querySelector("tbody").innerHTML = content;
                }
            });
    },

    removeHotel: function (id) {
        // gui request xoa du lieu mockapi
        let removeUrl = `${this.baseApiUrl}/${id}`;

        fetch(removeUrl, { method: "DELETE" })
            .then((res) => res.json())
            .then((data) => {
                // xoa DOM tren trinh duyet
                document.querySelector(`#data-${data.id}`).remove();
            });
    },
};
