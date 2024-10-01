<template>
    <div class="attendance-month-wrapper">
      <h3>지금까지 모은 너구리 수는??</h3>
      <div class="attendance-table">
        <div
        v-for="(Attendance, index) in Attendances"
          :key="index"
          class="attendance-row"
        >
          <div class="month">{{ Attendance.month }}월</div>
          <div class="count">{{ Attendance.count }}번</div>
        </div>
      </div>
      <div class="checkbtn-wrapper">
        <button class="check-btn" v-on:click="check-btn">출석 체크</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      selectedDate: String,
      transactions: Array,
      Attendances: {
        type: Array,
        Required: true
      },
    },
    computed: {
      dayTitle() {
        return this.selectedDate ? `Day ${new Date(this.selectedDate).getDate()}` : '날짜를 선택하세요';
      },
      totalIncome() {
        return this.transactions
          .filter((item) => item.type === 'income')
          .reduce((sum, item) => sum + item.amount, 0);
      },
      totalExpense() {
        return this.transactions
          .filter((item) => item.type === 'expense')
          .reduce((sum, item) => sum + item.amount, 0);
      },
    },
    methods: {
      formatCurrency(amount) {
        return amount.toLocaleString('ko-KR');
      },
      editTransaction(index) {
        // 수정 기능 구현
      },
      deleteTransaction(index) {
        // 삭제 기능 구현
      },
    },
  };
  </script>
  
  <style src='./MonthCheck.css' scoped>
  
  </style>
  