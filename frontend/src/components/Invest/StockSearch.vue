<template>
  <div class="stock-search">
    <div class="search-container">
      <input 
        v-model="searchQuery" 
        @keyup.enter="searchStocks"
        placeholder="주식 종목 검색" 
        class="search-input"
      />
      <img 
        src="@/assets/search.png" 
        alt="Search" 
        class="search-icon" 
        @click="searchStocks"
      />
    </div>
    <!-- 검색 결과가 있을 때만 ul을 렌더링 -->
    <ul v-if="searchResults.length > 0" class="search-results">
      <li v-for="stock in searchResults" :key="stock.code" @click="selectStock(stock)">
        {{ stock.name }} ({{ stock.code }})
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStockStore } from '@/stores/stockStore';

export default {
  setup() {
    const stockStore = useStockStore();
    const searchQuery = ref('');

    const searchStocks = async () => {
      if (searchQuery.value.trim()) { // 공백 제거 후 검색
        await stockStore.searchStocks(searchQuery.value);
      } else {
        stockStore.searchResults = []; // 빈 검색어일 경우 결과 초기화
      }
    };

    const selectStock = (stock) => {
      stockStore.setSelectedStock(stock);
      stockStore.fetchStockChart(stock.code);
      searchQuery.value = ''; // 선택 후 검색창 초기화
      stockStore.searchResults = []; // 선택 후 결과 리스트 비우기
    };

    // 검색 결과를 컴퓨티드로 감싸서 자동 갱신
    const searchResults = computed(() => stockStore.searchResults);

    return {
      searchQuery,
      searchStocks,
      selectStock,
      searchResults,
    };
  },
};
</script>

<style scoped>
.stock-search {
  position: relative;
  width: 100%;
  max-width: 350px; /* 검색창 폭을 넓게 */
}

.search-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 10px;
  padding-right: 40px; /* 검색 아이콘 공간 */
  border: 2px solid #ffcc00;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

.search-input:focus {
  border-color: #ff9933;
}

.search-icon {
  position: absolute;
  right: 10px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 250px; /* 최대 높이 증가 */
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ddd;
  border-top: none;
  list-style-type: none;
  padding: 0;
  margin: 0;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.search-results li {
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-results li:hover {
  background-color: #fffbcc; /* hover 시 배경색 변경 */
}
</style>
