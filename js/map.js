let geocoder;
let Curlocation;
let Splitlocation;

$(document).ready(function () {
    //가게 리스트 리셋
    $('#cardList').empty();
    // 주소-좌표 변환 객체를 생성합니다
    geocoder = new kakao.maps.services.Geocoder();

    // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, 'idle', function () {
        searchAddrFromCoords(map.getCenter(), displayCenterInfo);
    });
})

function CurrentLocation() {

    if (navigator.geolocation) {

        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function (position) {

            let lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도

            let locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다

            // 마커와 인포윈도우를 표시합니다
            displayMarker(locPosition, message);
            //현재 위치 주소 가져오기
            searchAddrFromCoords(locPosition, displayCenter);
        });

    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

        let locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
            message = 'geolocation을 사용할수 없어요..'

        displayMarker(locPosition, message);
        searchAddrFromCoords(locPosition, displayCenter);
    }

}

// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition, message) {

    // 마커를 생성합니다
    let marker = new kakao.maps.Marker({
        map: map,
        position: locPosition
    });

    let iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

    // 인포윈도우를 생성합니다
    let infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable
    });

    // 인포윈도우를 마커위에 표시합니다
    infowindow.open(map, marker);

    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);
}

// 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomIn() {
    map.setLevel(map.getLevel() - 1);
}

// 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomOut() {
    map.setLevel(map.getLevel() + 1);
}

function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
function displayCenterInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        let infoDiv = document.getElementById('centerAddr');

        for (let i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H' 이므로
            if (result[i].region_type === 'H') {
                infoDiv.innerHTML = result[i].address_name;
                Curlocation = result[i].address_name;
                break;
            }
        }
    }
}

function displayCenter(result, status) {
    console.log(result)
    if (status === kakao.maps.services.Status.OK) {

        for (let i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H' 이므로
            if (result[i].region_type === 'H') {
                Curlocation = result[i].address_name;
                break;
            }
        }
        let locationArr = Curlocation.split(" ");
        Splitlocation = locationArr[0] + " " + locationArr[1]
        aroundShop(Splitlocation)
    }
}

function showOnMap(data) {
    // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
    var bounds = new kakao.maps.LatLngBounds();

    for (let i = 0; i < data['display']; i++) {
        let title = data['items'][i]['title'];
        let address = data['items'][i]['address'];

        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(address, function (result, status) {

            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {

                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과값으로 받은 위치를 마커로 표시합니다
                // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
                let marker = new kakao.maps.Marker({position: coords});
                marker.setMap(map);

                // LatLngBounds 객체에 좌표를 추가합니다
                bounds.extend(coords);

                // var marker = new kakao.maps.Marker({
                //     map: map,
                //     position: coords
                // });

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                var infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="width:150px;text-align:center;padding:6px 0;">${title}</div>`
                });
                infowindow.open(map, marker);

                // LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정합니다
                // 이때 지도의 중심좌표와 레벨이 변경될 수 있습니다
                map.setBounds(bounds);

                // // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                // map.setCenter(coords);
            }
        });
    }
}


