<template>
  <div class="card-wrapper">
    <div class="header">
      <h3>{{ dayTitle }}</h3>
      <button @click="toggleAllTransactions" class="view-all-btn">
        {{ showAllMode ? '선택한 날짜 보기' : '전체 내역 조회' }}
      </button>
    </div>
    <div class="summary">
      <div class="income">
        <span>수입: +{{ formatCurrency(totalIncome) }}</span>
      </div>
      <div class="expense">
        <span>지출: -{{ formatCurrency(totalExpense) }}</span>
      </div>
      <div class="savings">
        <span>저축: +{{ formatCurrency(totalSavings) }}</span>
      </div>
    </div>
    <div class="transactions">
      <div v-if="paginatedTransactions.length === 0">
        표시할 거래 내역이 없습니다.
      </div>
      <div
        v-for="transaction in paginatedTransactions"
        :key="transaction.accountBookId"
        class="transaction-card"
      >
        <img
          v-if="transaction.type === '수입'"
          src="@/assets/img/income.png"
          width="30px"
        />
        <img
          v-if="transaction.type === '지출'"
          src="@/assets/img/expense.png"
          width="30px"
        />
        <img
          v-if="transaction.type === '저축'"
          src="@/assets/img/savings.png"
          width="30px"
        />
        <div class="transaction-info">
          <span
            class="transaction-type"
            :class="getTransactionClass(transaction.type)"
          >
            {{ transaction.category || '저축' }}
          </span>
          <span class="transaction-details">
            {{ transaction.description }}
          </span>
          <span
            class="transaction-amount"
            :class="getTransactionClass(transaction.type)"
          >
            {{ getTransactionSign(transaction.type) }}{{ formatCurrency(transaction.amount) }}
          </span>
        </div>
        <div class="transaction-actions">
          <button @click="editTransaction(transaction)" class="edit-btn">수정</button>
          <button @click="deleteTransaction(transaction.accountBookId)" class="delete-btn">삭제</button>
        </div>
      </div>
    </div>
    <div v-if="showAllMode" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  props: {
    selectedDate: [String, Number, Date],
    transactions: {
      type: Array,
      default: () => []
    },
    allTransactions: {
      type: Array,
      default: () => []
    },
  },
  setup(props, { emit }) {
    const showAllMode = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 5;

    const currentTransactions = computed(() => {
      console.log("Current transactions:",  props.allTransactions);
      return showAllMode.value ? props.allTransactions : props.transactions;
    });

    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const result = currentTransactions.value.slice(start, end);
      console.log("Paginated transactions:", result);
      return result;
    });

    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(currentTransactions.value.length / itemsPerPage));
    });

    const totalIncome = computed(() => {
      return currentTransactions.value
        .filter((item) => item && item.type === '수입')
        .reduce((sum, item) => sum + (item.amount || 0), 0);
    });

    const totalExpense = computed(() => {
      return currentTransactions.value
        .filter((item) => item && item.type === '지출')
        .reduce((sum, item) => sum + (item.amount || 0), 0);
    });

    const totalSavings = computed(() => {
      return currentTransactions.value
        .filter((item) => item && item.type === '저축')
        .reduce((sum, item) => sum + (item.amount || 0), 0);
    });

    const totalAssets = computed(() => {
      return props.allTransactions.reduce((total, transaction) => {
        if (transaction.type === '수입' || transaction.type === '저축') {
          return total + transaction.amount;
        } else if (transaction.type === '지출') {
          return total - transaction.amount;
        }
        return total;
      }, 0);
    });

    watch(totalAssets, (newTotalAssets) => {
      emit('update:totalAssets', newTotalAssets);
    }, { immediate: true });

    const dayTitle = computed(() => {
      if (!props.selectedDate || props.selectedDate === '') return '날짜를 선택하세요';
      
      let date;
      if (props.selectedDate instanceof Date) {
        date = props.selectedDate;
      } else if (typeof props.selectedDate === 'string') {
        date = new Date(props.selectedDate);
      } else if (typeof props.selectedDate === 'number') {
        date = new Date(props.selectedDate);
      } else {
        console.error('Invalid date type:', typeof props.selectedDate);
        return '유효하지 않은 날짜';
      }
      
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', props.selectedDate);
        return '유효하지 않은 날짜';
      }
      
      return `Day ${date.getDate()}`;
    });

    const formatCurrency = (amount) => {
      return amount.toLocaleString('ko-KR');
    };

    const toggleAllTransactions = () => {
      showAllMode.value = !showAllMode.value;
      currentPage.value = 1;
      console.log("Toggle all transactions:", showAllMode.value);
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const editTransaction = (transaction) => {
      emit('edit', transaction);
    };

    const deleteTransaction = (accountBookId) => {
      console.log(accountBookId);
      emit('delete', accountBookId);
    };

    const getTransactionClass = (type) => {
      switch (type) {
        case '수입':
          return 'income';
        case '지출':
          return 'expense';
        case '저축':
          return 'savings';
        default:
          return '';
      }
    };

    const getTransactionSign = (type) => {
      return type === '지출' ? '-' : '+';
    };

    watch(() => props.selectedDate, () => {
      showAllMode.value = false;
      currentPage.value = 1;
    });

    return {
      showAllMode,
      currentPage,
      dayTitle,
      totalIncome,
      totalExpense,
      totalSavings,
      paginatedTransactions,
      totalPages,
      formatCurrency,
      toggleAllTransactions,
      prevPage,
      nextPage,
      editTransaction,
      deleteTransaction,
      totalAssets,
      getTransactionClass,
      getTransactionSign,
    };
  },
};
</script>

<style src='./IncomeExpenseCard.css' scoped>
</style>