import { defineStore } from 'pinia';
import axios from 'axios';

export const useStockStore = defineStore('stock', {
  state: () => ({
    searchResults : [],
    holdings: [],
    investmentKing: null,
    selectedStock: null,
    chartData: null,
    searchResults: [],
    error: null,
    lastPrices: {}, // 각 종목의 마지막으로 조회한 가격을 저장
  }),


  actions: {

    // 주식 검색
    async fetchStocks(keyword) {
      try {
        console.log("Searching for:", keyword); // 검색어 로그
        const response = await axios.get(`http://localhost:8080/api/stocks?keyword=${keyword}`);
        if (response.data.returnCode === '0000') {
          this.searchResults = response.data.data.contents; 
        } else {
          throw new Error(response.data.returnMessage);
        }
      } catch (error) {
        console.error('주식 검색 실패:', error);
        this.error = '주식 검색에 실패했습니다.';
      }
    },
    // 보유종목 조회
    async fetchHoldings() {
      try {
        const response = await axios.get('http://localhost:8080/api/stocks');
        this.holdings = response.data;
        this.error = null;
      } catch (error) {
        console.error('보유종목 조회 실패:', error);
        this.error = '보유종목을 불러오는데 실패했습니다.';
      }
    },

    async fetchStockChart(stockCode, period = 'DAY') {
      try {
        console.log(stockCode);
        const response = await axios.get(`http://localhost:8080/api/stocks/chart/${stockCode}?period=${period}`);
        if (response.data.returnCode === '0000') {
          this.chartData = this.processChartData(response.data.data);
          this.error = null;
        } else {
          throw new Error(response.data.returnMessage);
        }
      } catch (error) {
        console.error('차트 데이터 로딩 실패:', error);
        this.error = '차트 데이터를 불러오는데 실패했습니다.';
        this.chartData = null;
      }
    },
    async fetchLatestStockData(stockCode) {
      try {
        const response = await axios.get(`http://localhost:8080/api/stocks/chart/${stockCode}?period=DAY`);
        if (response.data.returnCode === '0000') {
          const latestData = response.data.data[0]; // 가장 최신 데이터
          return {
            date: latestData.stckBsopDate,
            open: parseFloat(latestData.stckOprc),
            high: parseFloat(latestData.stckHgpr),
            low: parseFloat(latestData.stckLwpr),
            close: parseFloat(latestData.stckClpr),
            volume: parseInt(latestData.acmlVol)
          };
        } else {
          throw new Error(response.data.returnMessage);
        }
      } catch (error) {
        console.error('최신 데이터 조회 실패:', error);
        this.error = '최신 데이터를 불러오는데 실패했습니다.';
        return null;
      }
    },

    processChartData(data) {
      return data
        .filter(item => item.stckBsopDate !== null) // null 데이터 제거
        .map(item => ({
          date: new Date(item.stckBsopDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).getTime(),
          open: parseFloat(item.stckOprc),
          high: parseFloat(item.stckHgpr),
          low: parseFloat(item.stckLwpr),
          close: parseFloat(item.stckClpr),
          volume: parseInt(item.acmlVol)
        }))
        .sort((a, b) => a.date - b.date); // 날짜 오름차순 정렬
    },

    // 현재 주식 가격 조회
    async fetchCurrentPrice(stockCode) {
      try {
        const response = await axios.get(`http://localhost:8080/api/stocks/price/${stockCode}`);
        if (response.data.returnCode === '0000') {
          return {
            currentPrice: parseFloat(response.data.data.stck_prpr),
            priceChangePercent: parseFloat(response.data.data.prdy_ctrt),
          };
        } else {
          throw new Error(response.data.returnMessage);
        }
      } catch (error) {
        console.error('현재 주식 가격 조회 실패:', error);
        this.error = '현재 주식 가격을 불러오는데 실패했습니다.';
        return null;
      }
    },

    // 선택된 주식 설정 및 현재 가격 업데이트
    async setSelectedStock(stock) {
      const currentPrice = await this.fetchCurrentPrice(stock.code);
      if (currentPrice !== null) {
        const lastPrice = this.lastPrices[stock.code] || currentPrice;
        const priceChange = currentPrice - lastPrice;
        const priceChangePercent = ((priceChange / lastPrice) * 100).toFixed(2);

        this.selectedStock = {
          ...stock,
          currentPrice: currentPrice,
          priceChange: priceChange,
          priceChangePercent: priceChangePercent
        };

        // 현재 가격을 lastPrices에 저장
        this.lastPrices[stock.code] = currentPrice;
      } else {
        this.selectedStock = stock;
      }
    },
  },
});
