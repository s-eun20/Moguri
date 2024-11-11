<template>
  <div class="income-expense-page">
    <div class="header">
      <h1 class="page-title">가계부</h1>
      <div class="total-assets">내 자산: {{ formatCurrency(totalAssets) }}</div>
    </div>
    
    <div class="content-wrapper">
      <div class="calendar-container">
        <Calendar 
        v-if="calendarEvents.length > 0"
          @dateSelected="handleDateSelected" 
          :events="calendarEvents" 
        />
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
import { ref, computed, onMounted } from 'vue';
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
    const calendarEvents = ref([]); // 이벤트를 저장할 ref 추가

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
        calculateAndSaveEvents(); 
        saveEventsToLocalStorage(); 
        loadEventsFromLocalStorage(); 
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
        calculateAndSaveEvents(); 
        saveEventsToLocalStorage(); // 이벤트 저장
        loadEventsFromLocalStorage(); // 로컬 스토리지에서 이벤트 불러오기
      } catch (error) {
        console.error('거래 수정 중 오류가 발생했습니다:', error);
      }
    };

    const deleteTransaction = async (accountBookId) => {
 {
        try {
          await accountStore.deleteTransaction(accountBookId);
          calculateAndSaveEvents(); 
          saveEventsToLocalStorage(); // 이벤트 저장
          loadEventsFromLocalStorage(); // 로컬 스토리지에서 이벤트 불러오기
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
      if (!selectedDate.value) return [];
      
      return transactions.value.filter(transaction => {
        const transactionDateString = transaction.transactionDate.split('T')[0];
        return transactionDateString === selectedDate.value;
      });
    });

    const saveEventsToLocalStorage = () => {
      const events = calendarEvents.value;
      localStorage.setItem('calendarEvents', JSON.stringify(events));
    };

    const loadEventsFromLocalStorage = () => {
      const storedEvents = localStorage.getItem('calendarEvents');
      if (storedEvents) {
        calendarEvents.value = JSON.parse(storedEvents); // 로컬 스토리지에서 이벤트 불러오기
        console.log('Loaded events from local storage:', calendarEvents.value); // 로드된 이벤트 확인
      }
    };
    const calculateAndSaveEvents = async () => {
      try {
        const response = await accountStore.fetchAllTransactions(); // 사용자 거래 내역을 가져오는 API 호출
        const events = [];

        // 수입과 지출 계산
        response.forEach(transaction => {
      const date = transaction.transactionDate; // 거래 날짜
      const amount = transaction.amount; // 거래 금액
      const type = transaction.type; // 거래 유형 (수입/지출)

      if (!events[date]) {
        events[date] = { income: 0, expense: 0 };
      }

      if (type === '수입') {
        events[date].income += amount; // 수입 합산
      } else if(type === '지출') {
        events[date].expense += amount; // 지출 합산
      }
    });

    // 이벤트 배열 생성
    const eventArray = [];
    for (const date in events) {
      const totalIncome = events[date].income;
      const totalExpense = events[date].expense;

      if (totalIncome > 0) {
        eventArray.push({ title: `+₩${totalIncome}`, date }); // 총 수입 이벤트
      }
      if (totalExpense > 0) {
        eventArray.push({ title: `-₩${totalExpense}`, date }); // 총 지출 이벤트
      }
    }

    calendarEvents.value = eventArray; // 캘린더 이벤트 설정
    saveEventsToLocalStorage(); // 로컬 스토리지에 저장
  } catch (error) {
    console.error('이벤트 계산 중 오류가 발생했습니다:', error);
  }
    };

    onMounted(async () => {
      try {
        await accountStore.fetchAllTransactions(); // 거래 내역 불러오기
        await calculateAndSaveEvents(); 
        saveEventsToLocalStorage();
        loadEventsFromLocalStorage(); // 로컬 스토리지에서 이벤트 불러오기
      } catch (error) {
        console.error('거래 내역을 불러오는 중 오류가 발생했습니다:', error);
      } 
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
      formatCurrency,
      calendarEvents, // calendarEvents를 반환
    };
  }
};
</script>

<style scoped>
.income-expense-page {
  width: 75%;
  margin: 0 auto;
  padding: 20px;
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
  margin-top: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 35px;
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
  max-height: 700px;
  flex: 2;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow: auto;
  min-width: 300px; /* 최소 너비 설정 */
}

.transactions-container {
  flex: 1.3;
  overflow: auto; /* 스크롤 가능하도록 설정 */
  min-width: 300px; /* 최소 너비 설정 */
  min-height: 400px; /* 최소 높이 설정 */
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
  font-size: 0.85em;
}

:deep(.fc-col-header-cell) {
  padding: 4px 0 !important;
}

:deep(.fc-daygrid-day) {
  padding: 1px !important;
}

:deep(.fc-daygrid-day-number) {
  font-size: 0.9em;
  padding: 2px;
}

:deep(.fc-event-title) {
  font-size: 0.85em;
}

/* 반응형 스타일 추가 */
@media (max-width: 768px) {
  .income-expense-page {
    padding: 10px;
  }

  .content-wrapper {
    flex-direction: column;
  }

  .calendar-container {
    height: calc(65vh - 60px);
    max-height: 500px;
    margin-bottom: 20px; 
  }

  .transactions-container {
    flex: none; 
  }

  :deep(.fc) {
    font-size: 0.75em;
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
</style>
