// 시작 시간과 종료 시간 선택 요소 참조
const startTimeSelect = document.getElementById("start-time");
const endTimeSelect = document.getElementById("end-time");

// 시작 시간과 종료 시간 옵션 추가 함수
function addTimeOptions() {
  for (let i = 0; i <= 23; i++) {
    for (let j = 0; j <= 45; j += 15) {
      const time = `${i}:${j < 10 ? "0" + j : j}`;
      const option = new Option(time, time);
      startTimeSelect.add(option);
      endTimeSelect.add(option.cloneNode(true));
    }
  }
}

// 초기에 한 번 시작 시간과 종료 시간 옵션 추가
addTimeOptions();

// 일정 확인 버튼 클릭 이벤트 핸들러 등록
document
  .getElementById("check-availability-btn")
  .addEventListener("click", function () {
    const startDate = new Date(document.getElementById("start-date").value);
    const startTime = document.getElementById("start-time").value.split(":");
    startDate.setHours(parseInt(startTime[0], 10));
    startDate.setMinutes(parseInt(startTime[1], 10));

    const endDate = new Date(document.getElementById("end-date").value);
    const endTime = document.getElementById("end-time").value.split(":");
    endDate.setHours(parseInt(endTime[0], 10));
    endDate.setMinutes(parseInt(endTime[1], 10));

    const selectedTimeDiv = document.getElementById("selected-time");
    selectedTimeDiv.innerHTML = `시작 시간: ${startDate.toLocaleString()}, 종료 시간: ${endDate.toLocaleString()}`;

    // 각 도시의 시차 (시드니: +10, 퍼스: +8, 멜버른: +10, 파리: +1)
    const timeOffsets = {
      시드니: 10 * 60 * 60 * 1000,
      퍼스: 8 * 60 * 60 * 1000,
      멜버른: 10 * 60 * 60 * 1000,
      파리: 1 * 60 * 60 * 1000,
    };

    // 겹치는 협업 가능한 시간을 저장할 객체
    const overlapTimes = {};

    // 각 도시의 협업 가능한 시작 시간과 종료 시간 계산 및 저장
    for (const city in timeOffsets) {
      const cityOffset = timeOffsets[city];
      const cityStartTime = new Date(startDate.getTime() + cityOffset);
      const cityEndTime = new Date(endDate.getTime() + cityOffset);

      // 협업 가능한 시간 표시
      const cooperationStartTime = new Date(cityStartTime);
      cooperationStartTime.setHours(9); // 협업 가능한 시작 시간 (오전 9시)
      const cooperationEndTime = new Date(cityEndTime);
      cooperationEndTime.setHours(17); // 협업 가능한 종료 시간 (오후 5시)

      // 협업 가능한 시간을 정확하게 설정하기 위해 각 도시의 시차를 고려하여 시작 시간과 종료 시간 조정
      if (cooperationStartTime.getHours() < 9) {
        cooperationStartTime.setHours(9, 0, 0, 0); // 시작 시간이 9시 이전이면 9시로 설정
      }
      if (
        cooperationEndTime.getHours() > 17 ||
        (cooperationEndTime.getHours() === 17 &&
          cooperationEndTime.getMinutes() > 0)
      ) {
        cooperationEndTime.setHours(17, 0, 0, 0); // 종료 시간이 17시 이후이면 17시로 설정
      }

      // 겹치는 시간 확인하여 협업 가능한 시간으로 표시
      if (startDate <= cooperationEndTime && endDate >= cooperationStartTime) {
        overlapTimes[city] = {
          start: cooperationStartTime.toLocaleTimeString(),
          end: cooperationEndTime.toLocaleTimeString(),
        };
      }
    }

    // 겹치는 협업 가능한 시간 출력
    const overlapInfoTable = document.getElementById("overlap-info-table");
    overlapInfoTable.innerHTML = `
        <thead>
            <tr>
                <th>이름</th>
                <th>지역</th>
                <th>협업 가능한 시간</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>정민</td>
                <td>시드니</td>
                <td>${
                  overlapTimes["시드니"]
                    ? overlapTimes["시드니"].start +
                      " - " +
                      overlapTimes["시드니"].end
                    : "협업 불가"
                }</td>
            </tr>
            <tr>
                <td>미영</td>
                <td>파리</td>
                <td>${
                  overlapTimes["파리"]
                    ? overlapTimes["파리"].start +
                      " - " +
                      overlapTimes["파리"].end
                    : "협업 불가"
                }</td>
            </tr>
            <tr>
                <td>나리</td>
                <td>멜버른</td>
                <td>${
                  overlapTimes["멜버른"]
                    ? overlapTimes["멜버른"].start +
                      " - " +
                      overlapTimes["멜버른"].end
                    : "협업 불가"
                }</td>
            </tr>
            <tr>
                <td>동진</td>
                <td>퍼스</td>
                <td>${
                  overlapTimes["퍼스"]
                    ? overlapTimes["퍼스"].start +
                      " - " +
                      overlapTimes["퍼스"].end
                    : "협업 불가"
                }</td>
            </tr>
        </tbody>
    `;
    // 협업 가능한 시간을 정리하여 h6 태그로 출력
    const overlapSummary = document.getElementById("overlap-summary");
    overlapSummary.innerHTML = "<h6>협업 가능한 시간</h6>";
    for (const city in overlapTimes) {
      overlapSummary.innerHTML += `<h6>${city}: ${
        overlapTimes[city]
          ? overlapTimes[city].start + " - " + overlapTimes[city].end
          : "협업 불가"
      }</h6>`;
    }
  });

 