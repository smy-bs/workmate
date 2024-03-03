$(document).ready(function() {
  // 시작 시간과 종료 시간 선택 요소 참조
  const startTimeSelect = $('#start-time');
  const endTimeSelect = $('#end-time');

  // 시작 시간과 종료 시간 옵션 추가 함수
  function addTimeOptions() {
      for (let i = 0; i <= 23; i++) {
          for (let j = 0; j <= 45; j += 15) {
              const hour = i < 10 ? "0" + i : i;
              const minute = j < 10 ? "0" + j : j;
              const time = `${hour}:${minute}`;
              const option = `<option value="${time}">${time}</option>`;
              startTimeSelect.append(option);
              endTimeSelect.append(option);
          }
      }
  }

  // 초기에 한 번 시작 시간과 종료 시간 옵션 추가
  addTimeOptions();

  $('#check-availability-btn').click(function() {
      // 서울 기준 시작 시간과 종료 시간
      const seoulStartTime = moment.tz($('#start-date').val(), 'Asia/Seoul');
      const seoulEndTime = moment.tz($('#end-date').val(), 'Asia/Seoul');

      // 각 도시의 협업 가능한 시간 계산
      const overlapTimes = calculateOverlapTimes(seoulStartTime, seoulEndTime);

      // 결과 표시
      const overlapInfoTable = $('#overlap-info-table');
      overlapInfoTable.empty();
      for (const city in overlapTimes) {
          const message = overlapTimes[city].start && overlapTimes[city].end ?
              `${city}: ${overlapTimes[city].start.format('YYYY-MM-DD HH:mm')} - ${overlapTimes[city].end.format('YYYY-MM-DD HH:mm')}` :
              `${city}: ${overlapTimes[city]}`;
          overlapInfoTable.append(`<tr><td>${city}</td><td>${message}</td></tr>`);
      }

      // 협업 가능한 시간을 정리하여 요약 표시
      const overlapSummary = $('#overlap-summary');
      overlapSummary.empty().append("<h6>협업 가능한 시간</h6>");
      for (const city in overlapTimes) {
          overlapSummary.append(`<h6>${city}: ${
              overlapTimes[city]
                  ? overlapTimes[city].start.format('YYYY-MM-DD HH:mm') + " - " + overlapTimes[city].end.format('YYYY-MM-DD HH:mm')
                  : "협업 불가"
          }</h6>`);
      }
  });

  // 협업 가능한 시간 계산 함수
  function calculateOverlapTimes(seoulStartTime, seoulEndTime) {
      const cities = ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Europe/Paris'];
      const overlapTimes = {};

      cities.forEach(city => {
          const cityStartTime = seoulStartTime.clone().tz(city);
          const cityEndTime = seoulEndTime.clone().tz(city);

          overlapTimes[city] = {
              start: cityStartTime,
              end: cityEndTime
          };
      });

      return overlapTimes;
  }

  // 메일로 보내기 버튼 클릭 이벤트 핸들러 등록
  $('#send-email-btn').click(function () {
      // 요약된 정보를 메일로 보냅니다.
      sendSummaryByEmail();
  });

  // 요약된 정보를 메일로 보내는 함수
  function sendSummaryByEmail() {
      // 여기에 요약된 정보를 메일로 보내는 코드를 작성합니다.
      // 예시로 간단한 알림창을 띄웁니다.
      alert('메일로 요약된 정보를 보냈습니다.');

      // 요약된 정보를 화면에서 지웁니다.
      const overlapInfoTable = $('#overlap-info-table');
      overlapInfoTable.empty();

      const overlapSummary = $('#overlap-summary');
      overlapSummary.empty().append("<h6>협업 가능한 시간</h6>");
  }
});