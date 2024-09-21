<template>
  <div class="overlay" v-if="isVisible">
    <div class="modal">
      <h3>목표 입력</h3>
      <form @submit.prevent="submitGoal">
        <div class="form-group">
          <label for="content">목표 내용</label>
          <input type="text" v-model="goal.content" id="content" required />
        </div>
        <div class="form-group">
          <label for="amount">목표 금액</label>
          <input type="number" v-model="goal.amount" id="amount" required />
        </div>
        <div class="form-group">
          <label for="start-date">시작일</label>
          <input type="date" v-model="goal.startDate" id="start-date" required />
        </div>
        <div class="form-group">
          <label for="end-date">종료일</label>
          <input type="date" v-model="goal.endDate" id="end-date" required />
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
        content: '',
        amount: 0,
        startDate: '',
        endDate: '',
        progress: 0, // 기본값 설정
      },
    };
  },
  methods: {
    submitGoal() {
      this.$emit('add-goal', this.goal);
      this.closeModal();
    },
    closeModal() {
      this.goal = { content: '', amount: 0, startDate: '', endDate: '', progress: 0 };
      this.$emit('close');
    },
  },
};
</script>

<style src="./Modal.css" scoped>
  </style>
