import { defineStore } from 'pinia';
import axios from 'axios';

export const useStockStore = defineStore('stock', {
  state: () => ({
    holdings: [],
    investmentKing: null,
    selectedStock: null,
    chartData: null,
    searchResults: [],
    error: null,
  }),

  actions: {
    // 보유종목 조회
    async fetchHoldings() {
      try {
        const response = await axios.get('http://localhost:8080/api/invest');
        this.holdings = response.data;
        this.error = null;
      } catch (error) {
        console.error('보유종목 조회 실패:', error);
        this.error = '보유종목을 불러오는데 실패했습니다.';
      }
    },

    // 종목 매수
    async buyStock(items) {
      try {
        const response = await axios.post(`http://localhost:8080/api/invest/${items}`);
        await this.fetchHoldings(); // 보유종목 갱신
        this.error = null;
        return response.data;
      } catch (error) {
        console.error('종목 매수 실패:', error);
        this.error = '종목 매수에 실패했습니다.';
      }
    },

    // 종목 매도
    async sellStock(items) {
      try {
        const response = await axios.post(`http://localhost:8080/api/invest/${items}`);
        await this.fetchHoldings(); // 보유종목 갱신
        this.error = null;
        return response.data;
      } catch (error) {
        console.error('종목 매도 실패:', error);
        this.error = '종목 매도에 실패했습니다.';
      }
    },

    // 이 달의 투자왕 조회
    async fetchInvestmentKing(date) {
      try {
        const response = await axios.get(`http://localhost:8080/api/invest?date=${date}`);
        this.investmentKing = response.data;
        this.error = null;
      } catch (error) {
        console.error('투자왕 조회 실패:', error);
        this.error = '이 달의 투자왕을 조회하는데 실패했습니다.';
      }
    },

    async searchStocks(query) {
      try {
        const response = await axios.get(`http://localhost:8080/api/invest/search?query=${query}`);
        this.searchResults = response.data;
        this.error = null;
      } catch (error) {
        console.error('주식 검색 실패:', error);
        this.error = '주식 검색에 실패했습니다.';
        this.searchResults = [];
      }
    },

    // 선택된 주식 설정
    setSelectedStock(stock) {
      this.selectedStock = stock;
    },

    
    async fetchStockChart(stockCode) {
      try {
        const response = await axios.get(`http://localhost:8080/api/invest/${stockCode}/chart`);
        this.chartData = response.data;
        this.error = null;
      } catch (error) {
        console.error('차트 데이터 로딩 실패:', error);
        this.error = '차트 데이터를 불러오는데 실패했습니다.';
        this.chartData = null;
      }
    },
  },
});
