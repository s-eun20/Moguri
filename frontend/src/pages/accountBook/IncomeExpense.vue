<template>
  <div class="income-expense-page">
    <h1 class="page-title">수입/지출 관리</h1>
    
    <div class="content-wrapper">
      <div class="calendar-container">
        <Calendar @dateSelected="handleDateSelected" />
      </div>
      <div class="transactions-container">
        <IncomeExpenseCard 
          :selectedDate="selectedDate" 
          :transactions="filteredTransactions"
          @edit="openEditModal"
          @delete="deleteTransaction"
        />
      </div>
    </div>

    <button class="add-transaction-btn" @click="openAddModal">
      <i class="fas fa-plus"></i> 거래 추가
    </button>

    <AccountModal 
      :isVisible="isAddModalVisible" 
      @close="closeAddModal" 
      @add="addTransaction" 
    />

    <EditModal
      :isVisible="isEditModalVisible"
      :transaction="editingTransaction"
      @close="closeEditModal"
      @update="updateTransaction"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useAccountStore } from '@/stores/accountStore';
import { storeToRefs } from 'pinia';
import IncomeExpenseCard from '@/components/AccountBook/IncomeExpenseCard.vue';
import Calendar from '@/components/AccountBook/Calendar.vue';
import AccountModal from '@/components/AccountBook/AccountModal.vue';
import EditModal from '@/components/AccountBook/editModal.vue';

export default {
  components: {
    IncomeExpenseCard,
    Calendar,
    AccountModal,
    EditModal
  },
  setup() {
    const accountStore = useAccountStore();
    const { transactions } = storeToRefs(accountStore);
    const selectedDate = ref(null);
    const isAddModalVisible = ref(false);
    const isEditModalVisible = ref(false);
    const editingTransaction = ref(null);

    const handleDateSelected = (date) => {
      if (date instanceof Date) {
        selectedDate.value = date.toISOString().split('T')[0];
      } else if (typeof date === 'string') {
        selectedDate.value = date.split('T')[0];
      } else {
        console.error('Invalid date format:', date);
        selectedDate.value = null;
      }
    };

    const openAddModal = () => {
      isAddModalVisible.value = true;
    };

    const closeAddModal = () => {
      isAddModalVisible.value = false;
    };

    const addTransaction = async (newTransaction) => {
      try {
        await accountStore.addTransaction(newTransaction);
        closeAddModal();
      } catch (error) {
        console.error('거래 추가 중 오류가 발생했습니다:', error);
      }
    };

    const openEditModal = (transaction) => {
      editingTransaction.value = { ...transaction };
      isEditModalVisible.value = true;
    };

    const closeEditModal = () => {
      isEditModalVisible.value = false;
      editingTransaction.value = null;
    };

    const updateTransaction = async (updatedTransaction) => {
      try {
        await accountStore.updateTransaction(updatedTransaction);
        closeEditModal();
      } catch (error) {
        console.error('거래 수정 중 오류가 발생했습니다:', error);
      }
    };

    const deleteTransaction = async (accountBookId) => {
      if (confirm('정말로 이 거래 내역을 삭제하시겠습니까?')) {
        try {
          await accountStore.deleteTransaction(accountBookId);
        } catch (error) {
          console.error('거래 내역 삭제 중 오류가 발생했습니다:', error);
        }
      }
    };

    const filteredTransactions = computed(() => {
      console.log('Computed 실행 - 선택된 날짜:', selectedDate.value);
      console.log('Computed 실행 - 전체 거래:', transactions.value);
      
      if (!selectedDate.value) return [];
      
      let selectedDateString;
      if (selectedDate.value instanceof Date) {
        selectedDateString = selectedDate.value.toISOString().split('T')[0];
      } else if (typeof selectedDate.value === 'string') {
        selectedDateString = selectedDate.value.split('T')[0];
      } else {
        console.error('Invalid selectedDate format:', selectedDate.value);
        return [];
      }
      
      const filtered = transactions.value.filter(transaction => {
        const transactionDateString = transaction.transactionDate.split('T')[0];
        const result = transactionDateString === selectedDateString;
        console.log('거래 날짜:', transactionDateString, '선택된 날짜:', selectedDateString, '일치:', result);
        return result;
      });
      
      console.log('필터링된 거래 내역:', filtered);
      return filtered;
    });

    onMounted(() => {
      accountStore.fetchTransactions();
    });

    watch(transactions, (newTransactions) => {
      console.log('거래 내역이 업데이트되었습니다:', newTransactions);
    });

    return {
      selectedDate,
      filteredTransactions,
      isAddModalVisible,
      isEditModalVisible,
      editingTransaction,
      handleDateSelected,
      openAddModal,
      closeAddModal,
      addTransaction,
      openEditModal,
      closeEditModal,
      updateTransaction,
      deleteTransaction
    };
  }
};
</script>

<style scoped>
  .income-expense-page {
    padding: 30px;
    max-width: 1600px;
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

  .calendar-container {
    flex: 2; /* 달력 컨테이너의 비율을 3으로 증가 */
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow: auto;
    height: 700px; /* 높이를 증가 */
  }

  .transactions-container {
    flex: 1; /* 거래 내역 컨테이너의 비율을 2로 설정 */
    height: 700px; /* 높이를 달력 컨테이너와 동일하게 설정 */
    overflow: auto; /* 내용이 넘칠 경우 스크롤 추가 */
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

    .calendar-container {
      height: 500px; /* 모바일 화면에서의 달력 높이 조정 */
    }

    .transactions-container {
      height: auto; /* 모바일 화면에서는 내용에 맞게 높이 조정 */
    }
  }
</style>
