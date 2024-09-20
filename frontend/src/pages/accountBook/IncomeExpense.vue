<template>
  <div class="income-expense-page">
    <h1 class="page-title">수입/지출</h1>
    
    <div class="content-wrapper">
      <Calendar @dateSelected="fetchTransactions" />
      <IncomeExpenseCard 
        :selectedDate="selectedDate" 
        :transactions="transactions" 
      />
    </div>

    <div class="add-transaction-icon-container">
      <img
        src="../../assets/plus.png"
        class="add-transaction-icon"
        @click="openModal"
        alt="Add Transaction"
      />
    </div>

    <Modal 
      :isVisible="isModalVisible" 
      @close="closeModal" 
      @add="addTransaction" 
    />
  </div>
</template>
  
  
  <script>
import Calendar from '@/components/AccountBook/Calendar.vue';
import IncomeExpenseCard from '@/components/AccountBook/IncomeExpenseCard.vue';
import Modal from '@/components/AccountBook/AccountModal.vue';  

export default {
  components: {
    Calendar,
    IncomeExpenseCard,
    Modal
  },
  data() {
    return {
      selectedDate: '',
      transactions: [],
      isModalVisible: false  
    };
  },
  methods: {
    fetchTransactions(date) {
      this.selectedDate = date;
      this.transactions = [
        { type: 'income', category: '알바비', amount: 400000 },
        { type: 'expense', category: '올리브영', amount: 27000 },
        { type: 'income', category: '용돈', amount: 10000 },
        { type: 'expense', category: '버스비', amount: 3000 }
      ];
    },
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    addTransaction(newTransaction) {
      this.transactions.push(newTransaction);
    }
  }
};
</script>

  
  <style scoped>
  .income-expense-page {
    padding: 20px;
  }

  .page-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #ffcc99;
  }

  .content-wrapper {
    display: flex;
    margin-top: 20px;
    margin-left: 150px;
  }

  .add-transaction-icon-container {
    position: fixed; 
    bottom: 180px;
    right: 300px;
    z-index: 1000; 
  }

  .add-transaction-icon {
    width: 50px;
    cursor: pointer;
  }
  </style>
