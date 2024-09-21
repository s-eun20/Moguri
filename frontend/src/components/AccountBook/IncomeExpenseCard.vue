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
        v-for="(transaction, index) in transactions"
        :key="index"
        class="transaction-card"
      >
        <img
          v-if="transaction.type === 'income'"
          src="../../assets/income.png"
          width="30px"
        />
        <img
          v-if="transaction.type === 'expense'"
          src="../../assets/expense.png"
          width="30px"
        />
        <div class="transaction-info">
          <span
            class="transaction-type"
            :class="transaction.type === 'income' ? 'income' : 'expense'"
          >
            {{ transaction.type === 'income' ? '수입' : '지출' }}
          </span>
          <span class="transaction-category">
            {{ transaction.category }}
          </span>
          <span
            class="transaction-amount"
            :class="transaction.type === 'income' ? 'income' : 'expense'"
          >
            {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
          </span>
        </div>
        <div class="transaction-actions">
          <button @click="editTransaction(index)" class="edit-btn">수정</button>
          <button @click="deleteTransaction(index)" class="delete-btn">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedDate: String,
    transactions: Array,
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

<style src='./IncomeExpenseCard.css' scoped>

</style>
