function saveOffline(title, address, link, mapx, mapy) {
    console.log(title, address, link)
    let data = {
        title: title,
        address: address,
        link: link,
        mapx: mapx,
        mapy: mapy,
        locationType: 'OFFLINE',
    }
    $.ajax({
        type: "POST",
        url: `https://api.subinee.shop/shop/favorite`,
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
            window.location.href = "login.html"
        }
    })
}

function saveOnline(title, link, des) {
    let data = {
        title: title,
        link: link,
        description: des,
        locationType: 'ONLINE'
    }
    $.ajax({
        type: "POST",
        url: `https://api.subinee.shop/shop/favorite`,
        contentType: "application/json",
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
        },
        success: function (response) {
            alert(response['msg']);
        },
        error: function (request) {
            if (request.status === 500) {
                alert("이미 저장된 가게입니다.")
            } else {
                alert("로그인을 해주세요.");
            }

        }
    })
}

function getShops() {
    $.ajax({
        type: "GET",
        url: `https://api.subinee.shop/shop/favorite`,
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
        },
        success: function (response) {
            console.log(response)
            for (let i = 0; i < response.length; i++) {
                let title = response[i]['title'];
                let link = response[i]['link'];
                let address = response[i]['address'];
                let des = response[i]['description'];
                let location = response[i]['locationType'];

                if (location === 'OFFLINE') {
                    let tmp = `
                    <div class="col-md-4 mb-4">
                        <div class="card shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
                                        <div style="text-align: right">
                                            <button class="fas fa-trash" style="background-color: white; outline: 0; border: 0" onclick="deleteShop('${title}')"></button>
                                        </div>
                                                <div class="h5 font-weight-bold text-success text-uppercase mb-1">
                                                    ${title}
                                                </div>
                                        <div class="mb-0 font-weight-bold text-gray-800"><a href="${link}">${link}</a></div>
                                        <div class="mb-0 font-weight-bold text-gray-800">${address}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                    $("#offline-fav").append(tmp);
                } else {
                    let temp = `
                    <div class="col-md-2 mb-4">
                        <div class="card shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                            <a class="h5 font-weight-bold text-success text-uppercase mb-1"
                                               href="${link}"
                                               target="_blank">
                                                ${title}
                                            </a>
                                        </div>

                                        <div class="mb-0 font-weight-bold text-gray-800">${des}</div>
                                        <div class="row">
                                            <div class="col-lg-12" style="text-align: right">
                                                <button class="fas fa-trash" style="background-color: white; outline: 0; border: 0" onclick="deleteShop('${title}')"></button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>`
                    $("#online-fav").append(temp);
                }
            }
        },
        error: function () {
            alert("로그인 해주세요");
            window.location.href = "login.html"
        }
    })
}

function deleteShop(title) {
    let con = confirm("찜한 가게에서 삭제하시겠습니까?")
    if (con) {
        $.ajax({
            type: "DELETE",
            url: `https://api.subinee.shop/shop/favorite?title=${title}`,
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
            },
            success: function (response) {
                alert(response['msg']);
                window.location.reload();
            },
            error: function () {
                alert("로그인을 해주세요.");
                window.location.href = "login.html"
            }
        })
    } else {
        alert("삭제 취소되었습니다.")
    }


}

function onlineShop() {
    $.ajax({
        type: "GET",
        url: `https://api.subinee.shop/shop/online`,
        contentType: "application/json",
        success: function (response) {
            console.log(response)
            for (let i = 0; i < response.length; i++) {
                let title = response[i]['title'];
                let des = response[i]['description'];
                let link = response[i]['link'];

                let temp = `
            <div class="col-md-6 mb-4">
                        <div class="card shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
<!--                                        <img src="https://cdn.eroun.net/news/photo/202112/27136_51084_386.jpg"-->
<!--                                             style="width: 200px; float: left; margin-right: 10px">-->
                                        <div>
                                            <div style="text-align: right">
                                                <button class="fas fa-heart" style="background-color: white; outline: 0; border: 0" onclick="saveOnline('${title}','${link}','${des}')"></button>
                                            </div>
                                            <a class="h5 font-weight-bold text-success text-uppercase mb-1"
                                               href="${link}" target="_blank">
                                                ${title}</a>
                                        </div>

                                        <a class="mb-0 font-weight-bold text-gray-800"
                                           href="${link}" target="_blank">${link}</a>
                                        <div class="mb-0 font-weight-bold text-gray-800">${des}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            `
                $('#onlineList').append(temp);
            }
        },
        error: function () {
            alert("온라인 사이트를 가져올 수 없습니다.");
        }
    })
}