<template>
  <div class="modal-backdrop" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <h2>이번 달 출석 현황</h2>
      <div class="attendance-graph">
        <div class="progress-bar" :style="{ width: `${progressPercentage}%` }"></div>
        <img src="@/assets/img/roulettemoguri.png" alt="Raccoon" class="raccoon-image" :style="{ left: `${progressPercentage}%` }">
      </div>
      <p>{{ attendanceDays }}일 출석 ({{ daysLeft }}일 남음)</p>
      <div class="rewards">
        <div 
          v-for="(reward, index) in rewards" 
          :key="index" 
          class="reward" 
          :class="{ 
            achieved: attendanceDays >= reward.days, 
            clickable: attendanceDays >= reward.days && !reward.received
          }"
          @click="claimReward(reward.days)"
        >
          {{ reward.days }}일 출석: {{ reward.amount }} 솜사탕
          <span v-if="reward.received">(수령 완료)</span>
        </div>
      </div>
      <button @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>

<script>
import { useAttendanceStore } from '../../stores/attendanceStore.js';
import { useAuthStore } from '@/stores/auth'; 
import axios from 'axios';

export default {
  data() {
    const authStore = useAuthStore();
    return {
      attendanceDays: 0,
      totalDays: 30,
      rewards: [
        { days: 10, amount: 1000, received: false },
        { days: 20, amount: 5000, received: false },
        { days: 30, amount: 10000, received: false },
      ],
      memberId: authStore.state.user.memberId, // memberId를 '1'로 설정
      rewardPoint: 0,
    };
  },
  computed: {
    progressPercentage() {
      return (this.attendanceDays / this.totalDays) * 100;
    },
    daysLeft() {
      return this.totalDays - this.attendanceDays;
    },
  },
  mounted() {
    this.loadMonthCount();
    this.checkReceivedRewards();
  },
  methods: {
    async loadMonthCount() {
      const attendanceStore = useAttendanceStore();
      await attendanceStore.fetchMonthCount(this.memberId);
      this.attendanceDays = attendanceStore.memberMonthCount;
    },
    async checkReceivedRewards() {
      const checkPromises = this.rewards.map(reward =>
        axios.get(`http://localhost:8080/api/attendance/reward/${this.memberId}/${reward.days}`)
      );

      try {
        const results = await Promise.all(checkPromises);
        results.forEach((response, index) => {
          this.rewards[index].received = response.data.data.receivedCheck;
        });
      } catch (error) {
        console.error('리워드 체크 중 오류 발생:', error);
      }

      this.rewardPoint = 0;
    },
    async claimReward(days) {
      if (this.attendanceDays >= days) {
        const reward = this.rewards.find(r => r.days === days);
        if (!reward.received) {
          try {
            await axios.post('http://localhost:8080/api/attendance/reward', {
              memberId: this.memberId,
              receivedType: days.toString()
            });
            reward.received = true;
            this.rewardPoint = reward.amount;
            const candyAmount = parseInt(this.rewardPoint);
            if (!isNaN(candyAmount)) {
                const authStore = useAuthStore();
                await authStore.updateCottonCandy(candyAmount);
            }
            console.log(this.rewardPoint);
            alert(`${days}일 출석 보상 ${reward.amount} 솜사탕을 받았습니다!`);
          } catch (error) {
            console.error('리워드 수령 중 오류 발생:', error);
            alert('리워드 수령 중 오류가 발생했습니다.');
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
}

.attendance-graph {
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 15px;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.5s ease-in-out;
}

.raccoon-image {
  position: absolute;
  bottom: 100%;
  width: 40px;
  transform: translateX(-50%);
  transition: left 0.5s ease-in-out;
}

.rewards {
  margin-top: 20px;
}

.reward {
  margin: 5px 0;
  padding: 5px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.reward.achieved {
  background-color: #4CAF50;
  color: white;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.reward.clickable {
  cursor: pointer;
}

.reward.clickable:hover {
  opacity: 0.8;
}
</style>