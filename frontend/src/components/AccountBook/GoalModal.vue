<template>
  <div class="overlay" v-if="isVisible">
    <div class="modal">
      <h3>목표 입력</h3>
      <form @submit.prevent="submitGoal">
        <div class="form-group">
          <label for="goalName">목표 이름</label>
          <input type="text" v-model="goal.goalName" id="goalName" required />
        </div>
        <div class="form-group">
          <label for="goalAmount">목표 금액</label>
          <input type="number" v-model="goal.goalAmount" id="goalAmount" step="0.01" required />
        </div>
        <div class="form-group">
          <label for="currentAmount">현재 금액</label>
          <input type="number" v-model="goal.currentAmount" id="currentAmount" step="0.01" required />
        </div>
        <div class="form-group">
          <label for="startDate">시작일</label>
          <input type="date" v-model="goal.startDate" id="startDate" required />
        </div>
        <div class="form-group">
          <label for="endDate">종료일</label>
          <input type="date" v-model="goal.endDate" id="endDate" required />
        </div>
        <div class="buttons">
          <button type="submit">추가</button>
          <button type="button" @click="closeModal">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      goal: {
        goalName: '',
        goalAmount: 0,
        currentAmount: 0,
        startDate: '',
        endDate: '',
      },
    };
  },
  methods: {
    submitGoal() {
      if (new Date(this.goal.startDate) >= new Date(this.goal.endDate)) {
        alert('종료일은 시작일보다 늦어야 합니다.');
        return;
      }
      this.$emit('add-goal', this.goal);
      this.closeModal();
    },
    closeModal() {
      this.goal = {
        goalName: '',
        goalAmount: 0,
        currentAmount: 0,
        startDate: '',
        endDate: '',
      };
      this.$emit('close');
    },
  },
};
</script>

<style src="./Modal.css" scoped>
  </style>
