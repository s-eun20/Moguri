<template>
  <div class="income-expense-page">
    <h1 class="page-title">수입/지출 관리</h1>
    
    <div class="content-wrapper">
      <div class="calendar-container">
        <Calendar @dateSelected="fetchTransactions" />
      </div>
      <div class="transactions-container">
        <IncomeExpenseCard 
          :selectedDate="selectedDate" 
          :transactions="transactions" 
        />
      </div>
    </div>

    <button class="add-transaction-btn" @click="openModal">
      <i class="fas fa-plus"></i> 거래 추가
    </button>

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
    padding: 30px;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'HakgyoansimWoojuR';
    font-weight: bold;
  }

  .page-title {
    font-size: 28px;
    font-weight: 600;
    color: #000000;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 2px solid #FFCC00;
  }

  .content-wrapper {
    display: flex;
    gap: 30px;
    margin-top: 30px;
  }

  .calendar-container,
  .transactions-container {
    flex: 1;
    width: calc(50% - 15px); /* 간격의 절반을 뺀 50% */
    height: 600px; /* 고정 높이 설정 */
  }

  .calendar-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow: auto;
  }

  .add-transaction-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: #FFCC00;
    color: #000000;
    border: none;
    border-radius: 50px;
    padding: 15px 30px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .add-transaction-btn:hover {
    background-color: #E6B800;
  }

  @media (max-width: 1024px) {
    .content-wrapper {
      flex-direction: column;
    }
    
    .calendar-container,
    .transactions-container {
      width: 100%;
      height: auto;
      margin-bottom: 20px;
    }
  }
  </style>
