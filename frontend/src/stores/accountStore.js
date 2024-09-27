import { defineStore } from 'pinia';
import axios from 'axios';

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
      try {
        const response = await axios.get('/api/accountbook', {
          params: { page, limit }
        });
        if (response.data.returnCode === '0000') {
          this.transactions = response.data.data.contents;
          this.totalCount = response.data.data.totalCount;
          this.totalPage = response.data.data.totalPage;
          this.currentPage = response.data.data.pageRequest.page;
        } else {
          throw new Error(response.data.returnMessage || '거래 내역을 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('거래 내역을 가져오는 중 오류가 발생했습니다:', error);
        throw error;
      }
    },

    async fetchAllTransactions() {
      try {
        let allTransactions = [];
        let currentPage = 0;
        let hasMorePages = true;

        while (hasMorePages) {
          await this.fetchTransactions(currentPage);
          allTransactions = [...allTransactions, ...this.transactions];
          currentPage++;
          hasMorePages = currentPage < this.totalPage;
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
      try {
        const response = await axios.get(`http://localhost:8080/api/accountbook/${accountBookId}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching transaction:', error);
      }
    },

    // 거래 내역 추가
    async addTransaction(newTransaction) {
      try {
        console.log('Sending transaction data:', newTransaction); // 로그 추가

        const response = await axios.post('/api/accountbook', newTransaction, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Server response:', response.data); // 로그 추가

        if (response.data.returnCode === '0000') {
          console.log('Transaction added successfully');
          await this.fetchTransactions(this.currentPage);
        } else {
          console.error('Error adding transaction:', response.data.returnMessage);
        }
      } catch (error) {
        console.error('Error adding transaction:', error.response ? error.response.data : error.message);
        throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있게 함
      }
    },

    // 거래 내역 수정
    async updateTransaction(updatedTransaction) {
      try {
        const response = await axios.patch(`/api/accountbook/${updatedTransaction.accountBookId}`, updatedTransaction);
        if (response.data.returnCode === '0000') {
          // 성공적으로 업데이트된 경우, 로컬 상태도 업데이트
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
      try {
        const response = await axios.delete(`http://localhost:8080/api/accountbook/${accountBookId}`);
        if (response.data.returnCode === 'SUCCESS') {
          await this.fetchTransactions(this.currentPage);
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    },

    // 저축 목표 삭제
    async deleteSavingGoal(memberId, goalId) {
      try {
        await axios.delete(`http://localhost:8080/api/account/goal/${memberId}/${goalId}`);
        this.savingGoals = this.savingGoals.filter(goal => goal.goalId !== goalId);
      } catch (error) {
        console.error('Error deleting saving goal:', error);
      }
    },

    // 통계 정보 조회
    async fetchStatistics(startDate, endDate) {
      try {
        const response = await axios.get(`http://localhost:8080/api/account`, {
          params: { startDate, endDate },
        });
        this.statistics = response.data; // 통계 데이터 저장
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    },

    async deleteTransaction(accountBookId) {
      try {
        const response = await axios.delete(`/api/accountbook/${accountBookId}`);
        if (response.data.returnCode === '0000') {
          await this.fetchTransactions(this.currentPage);
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
      console.log('필터링 시도 - 선택된 날짜:', selectedDate);
      console.log('필터링 전 전체 거래 내역:', state.transactions);
      
      if (!selectedDate) return [];
      
      const filtered = state.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transactionDate);
        return transactionDate.toDateString() === selectedDate.toDateString();
      });
    }
  }
});
