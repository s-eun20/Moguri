<template>
  <div class="income-expense-page">
    <div class="header">
      <h1 class="page-title">수입/지출</h1>
      <div class="total-assets">내 자산: {{ formatCurrency(totalAssets) }}</div>
    </div>
    
    <div class="content-wrapper">
      <div class="calendar-container">
        <Calendar @dateSelected="handleDateSelected" />
      </div>
      <div class="transactions-container">
        <IncomeExpenseCard 
          :selectedDate="selectedDate" 
          :transactions="filteredTransactions"
          :allTransactions="transactions"
          @update:totalAssets="updateTotalAssets"
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
import EditModal from '@/components/AccountBook/EditModal.vue';

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
    const totalAssets = ref(0);

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

    const updateTotalAssets = (newTotalAssets) => {
      totalAssets.value = newTotalAssets;
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
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
      
      return transactions.value.filter(transaction => {
        const transactionDateString = transaction.transactionDate.split('T')[0];
        return transactionDateString === selectedDateString;
      });
    });

    onMounted(async () => {
      try {
        await accountStore.fetchAllTransactions();
      } catch (error) {
        console.error('거래 내역을 불러오는 중 오류가 발생했습니다:', error);
      } 
    });

    watch(transactions, (newTransactions) => {
      console.log('거래 내역이 업데이트되었습니다:', newTransactions);
    });

    return {
      transactions,
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
      deleteTransaction,
      totalAssets,
      updateTotalAssets,
      formatCurrency
    };
  }
};
</script>

<style scoped>
  .income-expense-page {
    width: 70%;
  margin: 0 auto;
  padding: 20px;
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
  margin-top: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size : 35px;
  color: #333;
  font-weight: bold;
}
  .content-wrapper {
    display: flex;
    gap: 30px;
    margin-top: 30px;
  }

  .calendar-container {
    height: calc(75vh - 70px); 
  max-height: 600px;
    flex: 2; 
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow: auto;
  }

  .transactions-container {
    flex: 1.2; 
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

  :deep(.fc) {
  height: 100% !important;
  font-size: 0.85em; /* 폰트 크기를 더 줄임 */
}

/* 헤더 (요일 표시) 부분의 패딩 줄임 */
:deep(.fc-col-header-cell) {
  padding: 4px 0 !important;
}

/* 날짜 셀의 패딩 줄임 */
:deep(.fc-daygrid-day) {
  padding: 1px !important;
}

/* 날짜 숫자 크기 줄임 */
:deep(.fc-daygrid-day-number) {
  font-size: 0.9em;
  padding: 2px;
}

/* 이벤트 텍스트 크기 줄임 */
:deep(.fc-event-title) {
  font-size: 0.85em;
}

@media (max-width: 768px) {
  .income-expense-page {
    padding: 10px;
  }
  
  .calendar-container {
    height: calc(65vh - 60px); /* 모바일에서 높이 더 줄임 */
    max-height: 500px;
  }

  :deep(.fc) {
    font-size: 0.75em; /* 모바일에서 폰트 크기 더 줄임 */
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.total-assets {
  font-size: 18px;
  font-weight: bold;
  color: #4a4a4a;
}

/* ... 기존 스타일 ... */
</style>