function aroundShop(Curlocation) {
    let locationArr = Curlocation.split(" ");
    let location = locationArr[0] + " " + locationArr[1]
    console.log("검색위치" + location)
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/shop/offline?location=${location}`,
        dataType: "json",
        success: function (data) {
            console.log(data)
        }
    })
}