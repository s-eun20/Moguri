<template>
    <div class="attedance-page">
      <h1 class="attedance-title">출석 체크</h1>
      
      <div class="attendance-content-wrapper">
        <div class="attendance-calendar-container">
          <AttendanceCalendar @dateSelected="fetchAttendances"/>
        </div>
        <div class="attendance-month-container">
            <AttendanceMonthCheck
              :Attendances="Attendances"/>
        </div>
      </div>
    </div>
  </template>
    
    
<script>
  import AttendanceCalendar from '@/components/Event/AttendanceCalendar.vue';
  import AttendanceMonthCheck from '@/components/Event/AttendanceMonthCheck.vue';
  
  export default {
    components: {
      AttendanceCalendar,
      AttendanceMonthCheck,
    },
    data() {
      return {
        AttendanceSelectedDate: '',
        Attendances: [
          { month: '10', count: '15' },
          { month: '9', count: '31' },
          { month: '8', count: '28' },
          { month: '7', count: '30' },
          { month: '6', count: '17' },
        ]
      };
    },
    methods: {
      fetchAttendances(date) {
        this.AttendanceSelectedDate = date;
      },
    }
  };
</script>
  
    
<style scoped>
  .attedance-page {
    padding: 30px;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'HakgyoansimWoojuR';
    font-weight: bold;
  }

  .attedance-title {
    font-size: 28px;
    font-weight: 600;
    color: #000000;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 2px solid #FFCC00;
  }

  .attendance-content-wrapper {
    display: flex;
    gap: 30px;
    margin-top: 30px;
  }

  .attendance-calendar-container {
    flex: 1;
    width: calc(50% - 15px); /* 간격의 절반을 뺀 50% */
    height: 600px; /* 고정 높이 설정 */
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow: auto;
  }

  .attendance-month-container {
    flex: 1;
    width: calc(50% - 15px); /* 간격의 절반을 뺀 50% */
    height: 600px; /* 고정 높이 설정 */
    width: 100%;
    height: auto;
    margin-bottom: 20px; 
  }

  @media (max-width: 1024px) {
    .attendanceContent-wrapper {
      flex-direction: column;
    }
    
  }
</style>
  