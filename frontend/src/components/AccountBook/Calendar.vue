<template>
  <FullCalendar
    :options="calendarOptions"
    class="custom-calendar"
    :events="events"
  />
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

export default {
  components: {
      FullCalendar,
  },
  props: {
      events: {
          type: Array,
          default: () => []
      }
  },
  data() {
      return {
          calendarOptions: {
              plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
              initialView: 'dayGridMonth',
              headerToolbar: {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth' // week와 list 제거
              },
              selectable: true,
              dateClick: this.handleDateClick,
              events: this.events, // 추가된 부분
              eventBackgroundColor: '#ffd698',
              eventTextColor: '#333333',
          }
      };
  },
  methods: {
      handleDateClick(info) {
          this.$emit('date-selected', info.dateStr);
      },
  },
   mounted() {
      console.log('Events:', this.events); // 이벤트 확인
  }
}
</script>

<style>
/* 캘린더 전체 영역 스타일 */
/* 캘린더 전체 영역 스타일 */
.custom-calendar .fc {
    border: 1px solid #ffd698;
    border-radius: 10px;
    padding: 15px;
    background-color: #fff8e1;
}

/* 달력 헤더 스타일 (제목과 버튼 간격 조정) */
.custom-calendar .fc-toolbar-title {
    font-weight: 1000;
    font-size: 30px;
    color: #a06d36;
    text-align: center;
    margin-left: 10px;
    margin-right: 50px;
}

/* 달력 헤더 버튼 스타일 */
.custom-calendar .fc-button {
    background-color: #ffd698; /* 통일된 배경색 */
    border: none;
    color: #000000;
    font-weight: bold;
    border-radius: 4px;
    padding: 5px 10px;
}

.custom-calendar .fc-button:hover {
    background-color: #f7b500; /* Hover 시 색상 */
}

/* 선택된 버튼 스타일 (month 선택 시) */
.custom-calendar .fc-button-active {
    background-color: #ffe4b5; 
    color: #a06d36; 
}

/* 비활성화된 버튼 스타일 */
.custom-calendar .fc-button-primary:disabled {
    background-color: #e0e0e0; /* 원하는 배경색 */
    border-color: #b0b0b0; /* 원하는 테두리 색상 */
    color: #a0a0a0; /* 원하는 텍스트 색상 */
    cursor: not-allowed; /* 커서 모양 변경 */
}

/* 달력의 각 날짜 스타일 */
.custom-calendar .fc-daygrid-day {
    font-weight: bold;
    border-radius: 6px;
    background-color: #fffaf0;
    transition: background-color 0.3s ease;
    color: #a06d36;
}

/* 선택된 날짜 스타일 */
.custom-calendar .fc-daygrid-day.fc-day-today {
    background-color: #ffebcd; /* 오늘 날짜 색상 */
    border: 2px solid #ffa500;
    color: #a06d36;
}

/* 날짜 클릭 시 스타일 */
.custom-calendar .fc-daygrid-day:hover {
    background-color: #ffe4e1;
}

/* 이벤트 스타일 */
.custom-event {
    background-color: #ffd700;
    color: #fff;
    border-radius: 4px;
    padding: 5px;
}

/* 달력 날짜 헤더 스타일 (일, 월, 화 등) */
.custom-calendar .fc-col-header-cell-cushion {
    color: #a06d36;
}

/* 달력 날짜 선택 스타일 (파란색 강조 제거) */
.custom-calendar .fc-daygrid-day-number {
    color: #a06d36;
}
.fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active {
  background-color: #ffd698;
  color: #000000;
  font-weight: bold;
}
.fc-event-title-container {
  background-color: #ffd698;
}
.fc-event-main {
  border-color: none;
}
.fc-daygrid-event {
  font-size: 15px;
}
.custom-calendar .fc-day-sat, 
.custom-calendar .fc-day-sun {
    background-color: #fff2cc;
}
</style>