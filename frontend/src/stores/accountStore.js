import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';  // auth 스토어 가져오기

export const useAccountStore = defineStore('account', {
  state: () => ({
    transactions: [],
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
  }),

  actions: {
    // 거래 내역 조회
    async fetchTransactions(page = 0, limit = 30) {
      const authStore = useAuthStore(); // auth 스토어에서 memberId 가져오기
      const memberId = authStore.state.user.memberId; // 로그인된 사용자의 memberId

      try {
        const response = await axios.get('/api/accountbook', {
          params: { page, limit, memberId }
        });

        if (response.data.returnCode === '0000') {
          if (!response.data.data.accountBooks || !Array.isArray(response.data.data.accountBooks)) {
            throw new Error('거래 내역이 없습니다.');
          }

          this.transactions = response.data.data.accountBooks;
          this.totalItems = response.data.data.totalCount;
          this.totalPages = Math.ceil(this.totalItems / limit);
          this.currentPage = page;
        } else {
          throw new Error(response.data.returnMessage || '거래 내역을 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('거래 내역을 가져오는 중 오류가 발생했습니다:', error);
        throw error;
      }
    },

    async fetchAllTransactions() {
      const authStore = useAuthStore(); // auth 스토어에서 memberId 가져오기
      const memberId = authStore.state.user.memberId;

      try {
        let allTransactions = [];
        let currentPage = 0;
        let hasMorePages = true;

        while (hasMorePages) {
          await this.fetchTransactions(currentPage, 30); // memberId는 fetchTransactions 안에서 처리
          allTransactions = [...allTransactions, ...this.transactions];
          currentPage++;
          hasMorePages = currentPage < this.totalPages;
        }

        this.transactions = allTransactions;
        return allTransactions;
      } catch (error) {
        console.error('모든 거래 내역을 가져오는 중 오류가 발생했습니다:', error);
        throw error;
      }
    },

    // 개별 거래 내역 조회
    async fetchTransaction(accountBookId) {
      const authStore = useAuthStore();
      const memberId = authStore.state.user.memberId;

      try {
        const response = await axios.get(`http://localhost:8080/api/accountbook/${accountBookId}`, {
          params: { memberId }
        });
        return response.data.data;
      } catch (error) {
        console.error('Error fetching transaction:', error);
      }
    },

    // 거래 내역 추가
    async addTransaction(newTransaction) {
      const authStore = useAuthStore();
      const memberId = authStore.state.user.memberId;

      try {
        const response = await axios.post('/api/accountbook', { ...newTransaction, memberId }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.returnCode === '0000') {
          await this.fetchAllTransactions();
        } else {
          console.error('Error adding transaction:', response.data.returnMessage);
        }
      } catch (error) {
        console.error('Error adding transaction:', error.response ? error.response.data : error.message);
        throw error;
      }
    },

    // 거래 내역 수정
    async updateTransaction(updatedTransaction) {
      const authStore = useAuthStore();
      const memberId = authStore.state.user.memberId;

      try {
        const response = await axios.patch(`http://localhost:8080/api/accountbook/${updatedTransaction.accountBookId}`, updatedTransaction, {
          params: { memberId }
        });

        if (response.data.returnCode === '0000') {
          const index = this.transactions.findIndex(t => t.accountBookId === updatedTransaction.accountBookId);
          if (index !== -1) {
            this.transactions[index] = updatedTransaction;
          }
          return true;
        } else {
          throw new Error(response.data.returnMessage || '거래 수정에 실패했습니다.');
        }
      } catch (error) {
        console.error('거래 수정 중 오류가 발생했습니다:', error);
        throw error;
      }
    },

    // 거래 내역 삭제
    async deleteTransaction(accountBookId) {
      const authStore = useAuthStore();
      const memberId = authStore.state.user.memberId;

      try {
        const response = await axios.delete(`http://localhost:8080/api/accountbook/${accountBookId}`, {
          params: { memberId }
        });

        if (response.data.returnCode === '0000') {
          await this.fetchAllTransactions();
          return true;
        } else {
          throw new Error(response.data.returnMessage || '거래 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('거래 삭제 중 오류가 발생했습니다:', error);
        throw error;
      }
    },
  },

  getters: {
    filteredTransactions: (state) => (selectedDate) => {
      if (!selectedDate) return [];

      return state.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transactionDate);
        return transactionDate.toDateString() === selectedDate.toDateString();
      });
    }
  }
});
