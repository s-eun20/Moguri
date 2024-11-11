<template>
  <div class="calendar-wrapper">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <FullCalendar
      :options="calendarOptions"
      class="custom-calendar"
    />
    <div v-if="showAttendanceModal" class="modal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">확인</button>
      </div>
    </div>
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
              click: this.checkAttendance,
              classNames: this.getAttendanceButtonClass,
            }
          },
          events: [],
          height: '100%',
        },
        memberId: authStore.state.user.memberId,
        isLoading: false,
        isCheckedToday: false,
        showAttendanceModal: false,
        modalMessage: '',
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
        this.checkTodayAttendance();
      },
      updateCalendarEvents() {
        this.calendarOptions.events = this.memberAttendance.map(attendance => ({
          start: attendance.attendanceDate,
          className: 'custom-attendance-event'
        }));
      },
      checkTodayAttendance() {
        const today = new Date().toISOString().split('T')[0];
        this.isCheckedToday = this.memberAttendance.some(attendance => attendance.attendanceDate === today);
        this.updateAttendanceButton();
      },
      updateAttendanceButton() {
        if (this.isCheckedToday) {
          this.calendarOptions.customButtons.attendanceButton.text = '체크 완료';
          this.calendarOptions.customButtons.attendanceButton.click = this.showCompletedMessage;
        } else {
          this.calendarOptions.customButtons.attendanceButton.text = '출석체크';
          this.calendarOptions.customButtons.attendanceButton.click = this.checkAttendance;
        }
        this.calendarOptions.customButtons.attendanceButton.classNames = this.getAttendanceButtonClass;
      },
      showCompletedMessage() {
        this.modalMessage = '오늘 출석체크가 완료됐어요';
        this.showAttendanceModal = true;
      },
      async checkAttendance() {
        if (this.isCheckedToday) {
          this.showCompletedMessage();
          return;
        }
        
        this.isLoading = true;
        
        try {
          const newAttendance = { memberId: this.memberId };
          const result = await this.addAttendance(newAttendance);
          
          if (result === '0000') {
            await this.fetchAttendanceData();
            this.isLoading = false;
            this.modalMessage = '출석이 완료되었습니다.';
            this.showAttendanceModal = true;
            this.isCheckedToday = true;
            this.updateAttendanceButton();
          }
        } catch (error) {
          console.error('출석체크 중 오류 발생:', error);
          this.isLoading = false;
          alert('출석체크 중 오류가 발생했습니다.');
        }
      },
      closeModal() {
        this.showAttendanceModal = false;
        this.modalMessage = '';
      },
    },
    async created() {
      await this.fetchAttendanceData();
    },
    getAttendanceButtonClass() {
      return this.isCheckedToday ? 'fc-attendanceButton-button fc-button-disabled' : 'fc-attendanceButton-button';
    }
  }
</script>

<style scoped>
.calendar-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
  min-width: 300px; /* 최소 너비 설정 */
  overflow-x: auto; /* 가로 스크롤 허용 */
}

.custom-calendar {
  height: 100%;
  width: 100%;
  min-height: 400px; /* 최소 높이 설정 */
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

.attendance-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: white;
    padding: 15px;
    border-radius: 5px;
    z-index: 9999;
  }

  .modal {
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 300px;
  text-align: center;
  border-radius: 5px;
}

.modal-content p {
  margin-bottom: 20px;
}

.modal-content button {
  padding: 10px 20px;
  background-color: #ffd698;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #f7b500;
}

.fc-event-title-container {
  background-color: transparent !important;
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
  width: 100%;
  min-width: 300px; /* 최소 너비 설정 */
}

/* 달력 헤더 스타일 (제목과 버튼 간격 조정) */
.custom-calendar .fc-toolbar {
  display: flex;
  flex-wrap: wrap; /* 줄 바꿈 허용 */
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 10px; /* 요소 간 간격 */
}

.custom-calendar .fc-toolbar-title {
  font-weight: 1000;
  font-size: 30px; /* 폰트 크기 조정 */
  color: #a06d36;
  text-align: center;
  flex-grow: 1;
  width: 100%; /* 전체 너비 사용 */
}

/* 달력 헤더 버튼 스타일 */
.custom-calendar .fc-button {
  background-color: #ffd698;
  border: none;
  border-radius: 4px;
  color: white;
  padding: 5px 10px;
  font-size: 14px; /* 폰트 크기 조정 */
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
  background-image: url('@/assets/img/moguri_stamp_circle.png');
  background-size: 100% 100%; 
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  width: 60px; /* 너비 증가 */
  height: 60px; /* 높이 증가 */
  position: absolute; /* 절대 위치 설정 */
  top: 50%; /* 상단에서 50% 위치 */
  left: 50%; /* 좌측에서 50% 위치 */
  transform: translate(-50%, -45%); /* 중앙 정렬 */
  z-index: 1; /* 다른 요소들 위에 표시 */
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
  transition: all 0.3s ease;
}

.custom-calendar .fc-attendanceButton-button:hover:not(.fc-button-disabled) {
  background-color: #f7b500;
}

.custom-calendar .fc-attendanceButton-button.fc-button-disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
    pointer-events: none;
  }

.custom-calendar .fc-daygrid-day-top {
  position: relative; /* 상대 위치 설정 */
  z-index: 2; /* 이미지 위에 표시되도록 설정 */
}

/* 날짜 숫자에 대한 스타일 추가 */
.custom-calendar .fc-daygrid-day-number {
  position: relative; /* 상대 위치 설정 */
  z-index: 3; /* 이미지와 셀 위에 표시되도록 설정 */
}

.fc-event-title-container {
    background-color: transparent;
  }

@media (max-width: 768px) {
  .custom-calendar .fc-toolbar-title {
    font-size: 20px;
  }

  .custom-calendar .fc-button {
    padding: 3px 8px;
    font-size: 12px;
  }

  .custom-attendance-event {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .custom-calendar .fc-toolbar-title {
    font-size: 18px;
  }

  .custom-calendar .fc-button {
    padding: 2px 6px;
    font-size: 10px;
  }

  .custom-attendance-event {
    width: 30px;
    height: 30px;
  }
}
</style> 