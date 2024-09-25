<template>
  <div class="card-wrapper">
    <h3>{{ dayTitle }}</h3>
    <div class="summary">
      <div class="income">
        <span>수입: +{{ formatCurrency(totalIncome) }}</span>
      </div>
      <div class="expense">
        <span>지출: -{{ formatCurrency(totalExpense) }}</span>
      </div>
    </div>
    <div class="transactions">
      <div
        v-for="transaction in transactions"
        :key="transaction.accountBookId"
        class="transaction-card"
      >
        <img
          v-if="transaction.type === '수입'"
          src="../../assets/income.png"
          width="30px"
        />
        <img
          v-if="transaction.type === '지출'"
          src="../../assets/expense.png"
          width="30px"
        />
        <div class="transaction-info">
          <span
            class="transaction-type"
            :class="transaction.type === '수입' ? 'income' : 'expense'"
          >
            {{ transaction.type }}
          </span>
          <span class="transaction-details">
            {{ transaction.description }}
          </span>
          <span
            class="transaction-amount"
            :class="transaction.type === '수입' ? 'income' : 'expense'"
          >
            {{ transaction.type === '수입' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
          </span>
        </div>
        <div class="transaction-actions">
          <button @click="editTransaction(transaction)" class="edit-btn">수정</button>
          <button @click="deleteTransaction(transaction.accountBookId)" class="delete-btn">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedDate: [String, Number, Date],
    transactions: Array,
  },
  computed: {
    dayTitle() {
      if (!this.selectedDate || this.selectedDate === '') return '날짜를 선택하세요';
      
      let date;
      if (this.selectedDate instanceof Date) {
        date = this.selectedDate;
      } else if (typeof this.selectedDate === 'string') {
        date = new Date(this.selectedDate);
      } else if (typeof this.selectedDate === 'number') {
        date = new Date(this.selectedDate);
      } else {
        console.error('Invalid date type:', typeof this.selectedDate);
        return '유효하지 않은 날짜';
      }
      
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', this.selectedDate);
        return '유효하지 않은 날짜';
      }
      
      return `Day ${date.getDate()}`;
    },
    totalIncome() {
      return this.transactions
        .filter((item) => item.type === '수입')
        .reduce((sum, item) => sum + item.amount, 0);
    },
    totalExpense() {
      return this.transactions
        .filter((item) => item.type === '지출')
        .reduce((sum, item) => sum + item.amount, 0);
    },
  },
  methods: {
    formatCurrency(amount) {
      return amount.toLocaleString('ko-KR');
    },
    editTransaction(transaction) {
      this.$emit('edit', transaction);
    },
    deleteTransaction(accountBookId) {
      this.$emit('delete', accountBookId);
    },
  },
};
</script>

<style src='./IncomeExpenseCard.css' scoped>

</style>
