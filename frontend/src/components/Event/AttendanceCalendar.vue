<template>
    <FullCalendar
      :options="calendarOptions"
      class="custom-calendar"
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
    data() {
      return {
        calendarOptions: {
          plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',  
            right: ''
          },
          selectable: true,
          dateClick: this.handleDateClick,
          events: [
            { start: '2024-09-10', className: 'custom-attendance-event' },
            { start: '2024-09-12', className: 'custom-attendance-event' },
          ],
        }
      };
    },
    methods: {
      handleDateClick(info) {
        this.$emit('date-selected', info.dateStr);
      }
    }
  }
  </script>
  
  <style>
 
/* 캘린더 전체 영역 스타일 */
.custom-calendar .fc {  
  border: 1px solid #ffd698;
  border-radius: 10px;
  padding: 15px;
  background-color: #fff8e1;
  
}

/* 달력 헤더 스타일 (제목과 버튼 간격 조정) */


.custom-calendar .fc-toolbar-title {

  font-weight:1000;
  font-size: 30px;
  color: #a06d36;
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
}

/* 달력 헤더 버튼 스타일 */
.custom-calendar .fc-button {
  
  background-color: #ffd698;
  border: none;
  border-radius: 4px;
  color: white;
  padding: 5px 10px;
}

.custom-calendar .fc-button:hover {
  background-color: #f7b500;
}

/* 선택된 버튼 스타일 (month, week, list 선택 시) */
.custom-calendar .fc-button-active {
  background-color: #ffe4b5; 
  color: #a06d36; 
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
  background-color: #ffebcd;
  border: 2px solid #ffa500;
  color: #a06d36;
}

/* 날짜 클릭 시 스타일 */
.custom-calendar .fc-daygrid-day:hover {
  background-color: #ffe4e1;
}

/* 이벤트 스타일 */
.custom-attendance-event {
  background-image: url('@/assets/img/racoon-icon.png');
  background-size: auto;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #ffebcd00;
  border: 2px solid #ffebcd00;
  color: #a06d36;
}

/* 달력 날짜 헤더 스타일 (일, 월, 화 등) */
.custom-calendar .fc-col-header-cell-cushion {
  color: #a06d36;
}

/* 달력 날짜 선택 스타일 (파란색 강조 제거) */
.custom-calendar .fc-daygrid-day-number {
  color: #a06d36;
}

/* 주말 스타일 */
.custom-calendar .fc-day-sat, 
.custom-calendar .fc-day-sun {
  background-color: #fff2cc;
}
</style>
