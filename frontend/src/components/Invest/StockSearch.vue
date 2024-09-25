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
    <ul v-if="stockStore.searchResults.length > 0" class="search-results">
      <li v-for="stock in stockStore.searchResults" :key="stock.code" @click="selectStock(stock)">
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
      if (searchQuery.value.length > 0) {
        await stockStore.searchStocks(searchQuery.value);
      } else {
        stockStore.searchResults = [];
      }
    };

    const selectStock = (stock) => {
      stockStore.setSelectedStock(stock);
      stockStore.fetchStockChart(stock.code);
      searchQuery.value = '';
      stockStore.searchResults = [];
    };

    return {
      stockStore,
      searchQuery,
      searchStocks,
      selectStock,
      searchResults: computed(() => stockStore.searchResults),
    };
  }
}
</script>

<style scoped>
.stock-search {
  position: relative;
  width: 100%;
  max-width: 300px;
}

.search-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 10px;
  padding-right: 40px; /* 아이콘을 위한 공간 */
  border: 3px solid #ffcc00;
  border-radius: 5px;
  font-size: 16px;
}

.search-icon {
  position: absolute;
  right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-top: none;
  list-style-type: none;
  padding: 0;
  margin: 0;
  z-index: 1000;
}

.search-results li {
  padding: 10px;
  cursor: pointer;
}

.search-results li:hover {
  background-color: #f0f0f0;
}
</style>
