function initMap() {
  // 맵을 생성하고 초기 위치에 표시합니다.
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: { lat: 37.64275523214001, lng: 126.94799898696702 },
  });

  const teammembers = [
    {
      label: "JM",
      name: "Sydney",
      lat: -33.88048572951443,
      lng: 151.1931490741418,
    },
    {
      label: "MY",
      name: "France",
      lat: 48.87635330855851,
      lng: 2.3435917310731167,
    },
    {
      label: "NR",
      name: "Melbourne",
      lat: -37.81467389117771,
      lng: 145.02000657985997,
    },
    {
      label: "DJ",
      name: "Perth",
      lat: -31.942164290956356,
      lng: 115.87872855699194,
    },
  ];

  const bounds = new google.maps.LatLngBounds();
  const infoWindow = new google.maps.InfoWindow();

  const countryTimeList = document.getElementById("country-time-list");

  teammembers.forEach(({ label, name, lat, lng }) => {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      label: label,
    });
    bounds.extend(marker.position);

    marker.addListener("click", () => {
      map.panTo(marker.position);
      const timezonePromise = getTimezone(lat, lng);
      timezonePromise
        .then((timezone) => {
          const date = new Date().toLocaleString("en-US", {
            timeZone: timezone,
          });
          const formattedTime = new Date(date).toLocaleTimeString();
          infoWindow.setContent(`${name} - 현재 시간: ${formattedTime}`);
          infoWindow.open({
            anchor: marker,
            map,
          });

          // 나라와 시간 정보를 리스트에 추가
          const countryTime = `${name} - 현재 시간: ${formattedTime}`;
          updateCountryTimeList(countryTime, countryTimeList);

          // 시간대 선택이 변경될 때마다 협업 가능한 시간을 업데이트합니다.
          updateCollaborationTime();
        })
        .catch((error) => {
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
      .then((response) => response.json())
      .then((data) => {
        if (data.timeZoneId) {
          resolve(data.timeZoneId);
        } else {
          reject("타임존을 가져올 수 없습니다.");
        }
      })
      .catch((error) => {
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
  const selectedTimezone = document.getElementById("timezones").value;
  const collaborationTimeList = document.getElementById(
    "collaboration-time-list"
  );
  const collaborationTimeListItems = [];

  // 선택된 시간대에 따라 팀원들의 현재 시간을 변환하여 리스트에 추가
  teammembers.forEach(({ name, lat, lng }) => {
    const timezonePromise = getTimezone(lat, lng, selectedTimezone);
    timezonePromise
      .then((timezone) => {
        const date = new Date().toLocaleString("en-US", { timeZone: timezone });
        const formattedTime = new Date(date).toLocaleTimeString();
        collaborationTimeListItems.push(`${name}: ${formattedTime}`);
        updateCollaborationTimeList(
          collaborationTimeListItems,
          collaborationTimeList
        );
      })
      .catch((error) => {
        console.error("시간을 가져오는 중 오류가 발생했습니다:", error);
      });
  });
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
      let startTime, endTime;

      // startTime이 endTime보다 항상 시간상으로 먼저가 되도록 설정
      do {
          startTime = getRandomTime(0, 24); // 0시부터 24시 사이
          endTime = getRandomTime(0, 24); // 0시부터 24시 사이
      } while (startTime >= endTime);

      member.availability = `${formatDateTime(startTime)} ~ ${formatDateTime(endTime)}`;
  });
}


// 협업 가능한 시간을 "YYYY-MM-DD HH:MM" 형식의 문자열로 변환합니다.
function formatDateTime(datetime) {
  const year = datetime.getFullYear();
  const month = (datetime.getMonth() + 1).toString().padStart(2, '0');
  const day = datetime.getDate().toString().padStart(2, '0');
  const hours = datetime.getHours().toString().padStart(2, '0');
  const minutes = datetime.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 랜덤한 날짜와 시간을 반환합니다.
function getRandomTime(minHour, maxHour) {
  const year =  2024; // 2022년부터 2030년 사이의 랜덤 년도 선택
  const month =  3; // 1부터 12까지의 랜덤 월 선택
  const day = 3; // 선택한 월의 일수까지의 랜덤 일 선택
  const hour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour; // minHour부터 maxHour까지의 랜덤 시간 선택
  const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)]; // 00, 15, 30, 45 중에서 랜덤 선택
  return new Date(year, month - 1, day, hour, minutes); // 월은 0부터 시작하므로 month에서 1을 빼줌
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










// 초기화 함수
function init() {
  setRandomAvailability();
  addScheduleToTable();
  updateTeamAvailabilityArray();
  
}

init(); // 초기화 함수 호출





initMap(); // 맵 초기화




