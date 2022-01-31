function saveShop(title, address, link, mapx, mapy) {
    console.log(title, address, link)
    let data = {
        title: title,
        address: address,
        link: link,
        mapx: mapx,
        mapy: mapy
    }
    $.ajax({
        type: "POST",
        url: `http://localhost:8080/shop/favorite`,
        contentType: "application/json",
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
        },
        success: function (response) {
            alert(response['msg']);
        },
        error: function () {
            alert("로그인을 해주세요.");
        }
    })
}

function getShops() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/shop/favorite`,
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
        },
        success: function (response) {
            console.log(response)
        },
        error: function () {
            alert("로그인 해주세요");
        }
    })
}