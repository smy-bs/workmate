function initMap() {
    let countryTimes = []; // 각 나라의 시간을 저장할 배열

    // 맵을 생성하고 초기 위치에 표시합니다.
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {lat: 37.64275523214001 , lng: 126.94799898696702 }
    });

    const teammembers = [
        {label: "정민", name: "Sydney", lat: -33.88048572951443  , lng: 151.1931490741418  }, 
        {label: "미영", name: "France", lat: 48.87635330855851   , lng: 2.3435917310731167  },        
        {label: "나리", name: "Melbourne", lat: -37.81467389117771   , lng: 145.02000657985997  },
        {label: "동진", name: "Perth", lat: -31.942164290956356   , lng: 115.87872855699194  }
    ];

    const bounds = new google.maps.LatLngBounds();
    const infoWindow = new google.maps.InfoWindow();

    const countryTimeList = document.getElementById('country-time-list'); // countryTimeList 변수 정의

    teammembers.forEach(({label, name, lat, lng}) => {
        const marker = new google.maps.Marker({
            position: {lat, lng},
            map: map,
            label: label
        });
        bounds.extend(marker.position);

        marker.addListener("click", () => {
            map.panTo(marker.position);
            const timezonePromise = getTimezone(lat, lng);
            timezonePromise.then((timezone) => {
                const date = new Date().toLocaleString("en-US", {timeZone: timezone});
                const formattedTime = new Date(date).toLocaleTimeString();
                infoWindow.setContent(`${name} - 현재 시간: ${formattedTime}`);
                infoWindow.open({
                    anchor: marker,
                    map
                });

                // 나라와 시간 정보를 리스트에 추가
                const countryTime = `${label} - ${name} - 현재 시간: ${formattedTime}`;
                countryTimes.push(countryTime);
                updateCountryTimeList(countryTimes, countryTimeList);

                // 생성된 정보를 구글 캘린더에 추가하는 버튼 생성
                createAddToCalendarButton(countryTime, countryTimeList); // countryTimeList 변수를 함수로 전달
                }).catch((error) => {
                console.error("시간을 가져오는 중 오류가 발생했습니다:", error);
            });
        });
    });
    map.fitBounds(bounds);        
}

function createAddToCalendarButton(countryTime,countryTimeList) {
    const addButton = document.createElement('button');
    addButton.textContent = '구글 캘린더에 추가';
    addButton.addEventListener('click', () => {
        createGoogleCalendarEvent([countryTime]);
            });
    countryTimeList.appendChild(addButton);
}

function createGoogleCalendarEvent(eventDetails) {
    // 구글 캘린더 API 엔드포인트 URL
    const apiUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    
    // 이벤트 생성에 필요한 데이터
    const eventData = {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: {
            dateTime: eventDetails.startDateTime,
            timeZone: eventDetails.timeZone
        },
        end: {
            dateTime: eventDetails.endDateTime,
            timeZone: eventDetails.timeZone
        }
    };

    // POST 요청을 보내기 위한 fetch 사용
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': '126718981060-mcfkesl8pl5k9qb8vhpbtalhni185tst.apps.googleusercontent.com', // 여기에는 구글 OAuth2 인증을 통해 발급받은 엑세스 토큰을 사용합니다.
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('구글 캘린더에 이벤트가 성공적으로 추가되었습니다.', data);
    })
    .catch(error => {
        console.error('구글 캘린더에 이벤트를 추가하는 중 오류가 발생했습니다.', error);
    });
}



function getTimezone(lat, lng) {
    return new Promise((resolve, reject) => {
        const timestamp = Math.floor(Date.now() / 1000);
        const apiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=AIzaSyAreQKWwntyiu5a-GTvi59_R5T5__oLUj4`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.timeZoneId) {
                    resolve(data.timeZoneId);
                } else {
                    reject("타임존을 가져올 수 없습니다.");
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}
function updateCountryTimeList(countryTimes, countryTimeList) {
    // 기존 리스트를 지우고 새로운 리스트로 대체합니다.
    countryTimeList.innerHTML = "";
    countryTimes.forEach(countryTime => {
        const listItem = document.createElement('li');
        listItem.textContent = countryTime;
        countryTimeList.appendChild(listItem);
    });
}
// initMap() 함수 호출
initMap();