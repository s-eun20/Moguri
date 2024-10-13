<template>
  <div class="attendance-page">
    <h1 class="attendance-title">출석 체크</h1>
    
    <div v-if="isLoading" class="loading-message">
      데이터 불러오는 중...
    </div>
    
    <div v-else class="attendance-content-wrapper">
      <div class="attendance-calendar-container">
        <AttendanceCalendar />
      </div>
      <div class="attendance-roulette-container">
        <AttendanceRouletteCheck />
      </div>
    </div>
    <div class="attendance-icon-wrapper">
      <img
        @click="showAttendanceModal"
        src="@/assets/img/roulettemoguri.png"
        alt="출석 현황 아이콘"
        class="attendance-status-icon"
      />
      <div class="tooltip">이번달 출석한 횟수는??</div>
    </div>

    <!-- 출석 현황 모달 -->
    <AttendanceStatusModal v-if="isModalVisible" @close="closeModal" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import AttendanceCalendar from '@/components/Event/AttendanceCalendar.vue';
import AttendanceRouletteCheck from '@/components/Event/AttendanceRouletteCheck.vue';
import AttendanceStatusModal from '@/components/Event/AttendanceStatusModal.vue';
import { useAttendanceStore } from '@/stores/attendanceStore';

export default {
  components: {
    AttendanceCalendar,
    AttendanceRouletteCheck,
    AttendanceStatusModal,
  },
  setup() {
    const isModalVisible = ref(false);
    const isLoading = ref(true);
    const attendanceStore = useAttendanceStore();

    const showAttendanceModal = () => {
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

    onMounted(async () => {
      try {
        // 여기에 필요한 모든 데이터 로딩 작업을 추가합니다.
        await attendanceStore.fetchMemberAttendance(1); // 예시 memberId
        await attendanceStore.fetchHasRoulette(1); // 예시 memberId
        isLoading.value = false;
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error);
        isLoading.value = false; // 에러 발생 시에도 로딩 상태를 false로 변경
      }
    });

    return {
      isModalVisible,
      isLoading,
      showAttendanceModal,
      closeModal,
    };
  },
};
</script>
  
    
<style scoped>
  .attendance-page {
    padding: 30px;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'HakgyoansimWoojuR';
    font-weight: bold;
  }

  .attendance-title {
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
    flex: 1.7; /* 70% 더 길게 */
    width: calc(65% - 15px); /* 대략적인 비율 조정 */
  }

  .attendance-roulette-container {
    flex: 0.7; /* 30% 더 좁게 */
    width: calc(35% - 15px); /* 대략적인 비율 조정 */
  }

  .attendance-calendar-container,
  .attendance-roulette-container {
    height: 600px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 1024px) {
    .attendance-content-wrapper {
      flex-direction: column;
    }
    
    .attendance-calendar-container,
    .attendance-roulette-container {
      width: 100%;
    }
  }

  .attendance-status-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #FFCC00;
    color: #000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  }

  .attendance-status-btn:hover {
    background-color: #FFD700;
  }
  .attendance-icon-wrapper {
    position: fixed;
    bottom: 50px;
    right: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .attendance-status-icon {
    width: 100px;
    height: 100px;
    cursor: pointer;
  }

  .tooltip {
    position: absolute;
    bottom: 115px; /* 아이콘 위에 말풍선 배치 */
    right: -35px;
    background-color: #333;
    color: #fff;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 14px;
    white-space: nowrap;
    opacity: 1;  /* 항상 보이도록 설정 */
    transform: translateY(0); /* 위치 유지 */
  }

  .attendance-status-icon:hover {
    opacity: 0.8;
  }

  .loading-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 20px;
    color: #666;
  }
</style>
  