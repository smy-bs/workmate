




function initMap() {
    
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

    const countryTimeList = document.getElementById('country-time-list');

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
                const countryTime = `${name} - 현재 시간: ${formattedTime}`;
                updateCountryTimeList(countryTime, countryTimeList);

                // 시간대 선택이 변경될 때마다 협업 가능한 시간을 업데이트합니다.
                updateCollaborationTime();
            }).catch((error) => {
                console.error("시간을 가져오는 중 오류가 발생했습니다:", error);
            });
        });
    });
    map.fitBounds(bounds);        
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

function updateCountryTimeList(time, listElement) {
    const listItem = document.createElement("li");
    listItem.textContent = time;
    listElement.appendChild(listItem);
}

function updateCollaborationTime() {
    const selectedTimezone = document.getElementById('timezones').value;
    const collaborationTimeList = document.getElementById('collaboration-time-list');
    const collaborationTimeListItems = [];
    
    // 선택된 시간대에 따라 팀원들의 현재 시간을 변환하여 리스트에 추가
    teammembers.forEach(({name, lat, lng}) => {
        const timezonePromise = getTimezone(lat, lng, selectedTimezone);
        timezonePromise.then((timezone) => {
            const date = new Date().toLocaleString("en-US", {timeZone: timezone});
            const formattedTime = new Date(date).toLocaleTimeString();
            collaborationTimeListItems.push(`${name}: ${formattedTime}`);
            updateCollaborationTimeList(collaborationTimeListItems, collaborationTimeList);
        }).catch((error) => {
            console.error("시간을 가져오는 중 오류가 발생했습니다:", error);
        });
    });
}

function checkAvailability() {
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    // 선택된 시간대를 표시
    document.getElementById('selected-time').textContent = `선택된 시간대: ${startTime} - ${endTime}`;

    // 여기에 선택된 시간대를 이용하여 일정 확인하는 로직 추가
    // 예를 들어, 특정 시간대에 팀원들이 모두 일정이 있는지 확인하고 결과를 표시하는 등의 동작을 수행
}





const teammembers = [
    {label: "정민", location: "시드니"}, 
    {label: "미영", location: "파리"},     
    {label: "나리", location: "멜버른"}, 
    {label: "동진", location: "퍼스"}
];





// 각 팀원의 협업 가능한 시간을 랜덤으로 설정합니다.
function setRandomAvailability() {
    teammembers.forEach(member => {
        const startTime = getRandomTime(0, 24); // 0시부터 24시 사이
        const endTime = getRandomTime(0, 24); // 0시부터 24시 사이
        member.availability = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    });
}



// 팀원들의 협업 가능한 시간을 저장하는 배열
let teamAvailability = [];









// 협업 가능한 시간을 테이블에 추가하는 함수
function addScheduleToTable() {
    const tableBody = document.getElementById('schedule-body');
    teammembers.forEach(member => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = member.label;
        row.appendChild(nameCell);
        const locationCell = document.createElement('td');
        locationCell.textContent = member.location;
        row.appendChild(locationCell);
        const availabilityCell = document.createElement('td');
        availabilityCell.textContent = member.availability;
        row.appendChild(availabilityCell);
        tableBody.appendChild(row);
    });
}


// 팀원들의 협업 가능한 시간을 배열에 저장하는 함수
function updateTeamAvailabilityArray() {
    teamAvailability = [];
    teammembers.forEach(member => {
        teamAvailability.push(member.availability);
    });
}







// 지정된 범위 내에서 랜덤한 시간을 생성합니다.
function getRandomTime(minHour, maxHour) {
    const startTimestamp = new Date();
    startTimestamp.setHours(minHour, 0, 0, 0);
    const endTimestamp = new Date();
    endTimestamp.setHours(maxHour, 0, 0, 0);
    const randomTimestamp = startTimestamp.getTime() + Math.random() * (endTimestamp.getTime() - startTimestamp.getTime());
    const randomTime = new Date(randomTimestamp);
    return randomTime;
}

// 시간을 "HH:MM" 형식의 문자열로 변환합니다.
function formatTime(time) {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}




// 협업 가능한 시간을 표시하는 리스트를 업데이트합니다.
function updateCollaborationTimeList(times, listElement) {
    listElement.innerHTML = ""; // 기존 목록 비우기
    times.forEach(time => {
        const listItem = document.createElement("li");
        listItem.textContent = time;
        listElement.appendChild(listItem);
    });
}







// 중복된 구간을 표시하는 함수
function showOverlapTable(overlapRanges) {
    // 중복된 구간을 보여줄 div 요소 생성
    const overlapTableDiv = document.createElement('div');
    overlapTableDiv.setAttribute('id', 'overlap-table');

    // 테이블 요소 생성
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');
    
    // 테이블 헤더 생성
    const headerRow = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.textContent = '중복된 구간';
    headerRow.appendChild(headerCell);
    tableBody.appendChild(headerRow);
    
    // 중복된 구간 추가
    overlapRanges.forEach(range => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = range;
        row.appendChild(cell);
        tableBody.appendChild(row);
    });

    // 테이블에 테이블 본문 추가
    table.appendChild(tableBody);
    
    // 중복된 구간을 보여줄 div에 테이블 추가
    overlapTableDiv.appendChild(table);

    // 기존의 중복 테이블을 삭제하고 새로운 중복 테이블을 추가
    const existingOverlapTable = document.getElementById('overlap-table');
    if (existingOverlapTable) {
        existingOverlapTable.parentNode.removeChild(existingOverlapTable);
    }
    document.body.appendChild(overlapTableDiv);
}








// 초기화 함수
function init() {
    setRandomAvailability();
    addScheduleToTable();
    updateTeamAvailabilityArray();
}

init(); // 초기화 함수 호출





initMap(); // 맵 초기화
