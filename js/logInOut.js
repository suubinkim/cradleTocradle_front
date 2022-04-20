$(document).ready(function () {
    if (localStorage.getItem("token") == null) {
        $('#login-button').show()
        $('#logout-button').hide()
    } else {
        $('#login-button').hide()
        $('#logout-button').show()
        //유저 닉네임 가져오기
        userInfo();
    }
})

function registerUser() {

    let rePassword = $("#RepeatPassword").val();
    let password = $("#InputPassword").val();

    if (password !== rePassword) {
        alert("비밀번호가 일치하지 않습니다.")
        return;
    }

    if ($("#inlineFormInput").val() == "" || $("#inlineFormInputGroup").val() == "") {
        alert("이메일을 공란 없이 입력하세요")
        return;
    } else if ($("#InputNickname").val() == "") {
        alert("닉네임을 입력하세요")
        return;
    }

    let email = $("#inlineFormInput").val() + "@" + $("#inlineFormInputGroup").val()

    let data = {
        "username": $("#InputNickname").val(),
        "email": email,
        "password": $("#InputPassword").val(),
    }
    console.log(data)

    if (checkNumber === 0) {
        alert("이메일 중복확인이 필요합니다")
    } else if (checkNumber === 1) {
        $.ajax({
            type: "POST",
            url: `https://api.subinee.shop/signup`,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                alert("회원가입 되었습니다.");
                window.location.href = "login.html"
            },
            error: function () {
                alert("다시 시도해주세요.")
            }
        });
    }


}

let checkNumber = 0;

//이메일 중복확인
function doubleCheck() {

    if ($("#inlineFormInput").val() == "" || $("#inlineFormInputGroup").val() == "") {
        alert("이메일을 공란 없이 입력하세요")
        return
    }

    let email = $("#inlineFormInput").val() + "@" + $("#inlineFormInputGroup").val()

    $.ajax({
        type: "GET",
        url: `https://api.subinee.shop/doubleCheck`,
        contentType: "application/json",
        data: {email: email},
        success: function (response) {
            checkNumber = 1;
            alert(response['msg'])
        },
        error: function () {
            alert("중복된 이메일입니다.")
        }
    })

}

function userInfo() {
    $.ajax({
        type: "GET",
        url: `https://api.subinee.shop/getUsername`,
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
        },
        success: function (response) {
            let username = response['username']
            $('#username span').text(username);
        }
    })
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function login() {
    let data = {
        email: $("#InputEmail").val(),
        password: $("#InputPassword").val()
    }

    $.ajax({
        type: "POST",
        url: `https://api.subinee.shop/login`,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
            localStorage.setItem("token", response['token']);
            localStorage.setItem("email", response['email']);
            location.href = 'index.html';
        },
        error: function (error) {
            alert("로그인 정보가 잘 못 되었습니다.")
        }
    })
}