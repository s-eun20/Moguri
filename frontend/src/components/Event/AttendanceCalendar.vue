<template>
  <div class="calendar-wrapper">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <FullCalendar
      :options="calendarOptions"
      class="custom-calendar"
    />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAttendanceStore } from '@/stores/attendanceStore'; 
import { useAuthStore } from '@/stores/auth'; 
import { mapState, mapActions } from 'pinia';

export default {
  components: {
    FullCalendar,
  },
  data() {
    const authStore = useAuthStore();
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',  
          right: 'attendanceButton'
        },
        customButtons: {
          attendanceButton: {
            text: '출석체크',
            click: this.checkAttendance
          }
        },
        events: [],
        height: '100%',
      },
      memberId: authStore.state.user.memberId, // memberId를 '1'로 설정
      isLoading: false,
    };
  },
  computed: {
    ...mapState(useAttendanceStore, ['memberAttendance'])
  },
  methods: {
    ...mapActions(useAttendanceStore, ['fetchMemberAttendance', 'addAttendance']),
    async fetchAttendanceData() {
      await this.fetchMemberAttendance(this.memberId);
      this.updateCalendarEvents();
    },
    updateCalendarEvents() {
      this.calendarOptions.events = this.memberAttendance.map(attendance => ({
        start: attendance.attendanceDate,
        className: 'custom-attendance-event'
      }));
    },
    async checkAttendance() {
      const today = new Date().toISOString().split('T')[0];
      console.log('출석체크:', today);

      if (this.memberAttendance.some(attendance => attendance.attendanceDate === today)) {
        alert('오늘은 이미 출석 체크를 완료했습니다.');
        return;
      }
      
      this.isLoading = true; // 로딩 오버레이 표시
      
      try {
        const newAttendance = { memberId: this.memberId };
        const result = await this.addAttendance(newAttendance);
        
        if (result === '0000') {
          await this.fetchAttendanceData();
          this.isLoading = false; // 로딩 오버레이 숨김
          alert('오늘 출석이 완료 됐습니다.');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      } catch (error) {
        console.error('출석체크 중 오류 발생:', error);
        this.isLoading = false; // 로딩 오버레이 숨김
        alert('출석체크 중 오류가 발생했습니다.');
      }
    } 
  },
  async created() {
    await this.fetchAttendanceData();
  },
}
</script>

<style scoped>
.calendar-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}

.custom-calendar {
  height: 100%;
  width: 100%;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<style>
/* 캘린더 전체 영역 스타일 */
.custom-calendar .fc {  
  border: 1px solid #ffd698;
  border-radius: 10px;
  padding: 15px;
  background-color: #fff8e1;
  height: 100%;
  width: 100%; /* 너비를 100%로 설정 */
}

/* 달력 헤더 스타일 (제목과 버튼 간격 조정) */
.custom-calendar .fc-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* 너비를 100%로 설정 */
}

.custom-calendar .fc-toolbar-title {
  font-weight: 1000;
  font-size: 30px;
  color: #a06d36;
  text-align: center;
  flex-grow: 1; /* 제목이 남은 공간을 차지하도록 설정 */
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

.custom-attendance-event {
  background-image: url('@/assets/img/racoon-icon.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  width: 30px;
  height: 30px;
}

.custom-calendar .fc-attendanceButton-button {
  background-color: #ffd698;
  color: white;
  border: none; 
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.custom-calendar .fc-attendanceButton-button:hover {
  background-color: #f7b500;
}

</style>