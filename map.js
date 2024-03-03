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

initMap();
