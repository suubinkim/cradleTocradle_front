function aroundShop() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/shop/offline",
        dataType: "json",
        success: function (data) {
            console.log(data)
        }
    })
}