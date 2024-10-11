<template>
  <div class="stock-info-page">
    <div class="stock-search">
      <div class="search-container">
        <input
          v-model="searchQuery"
          @input="searchStocks"
          @keydown.enter="searchStocks"
          placeholder="주식 종목 검색"
          class="search-input"
        />
        <img src="@/assets/img/search.png" alt="Search" class="search-icon" />
      </div>
      <ul v-if="filteredStocks.length > 0" class="search-results">
        <li
          v-for="stock in filteredStocks"
          :key="stock.stockCode"
          @click="selectStock(stock)"
        >
          {{ stock.stockNameKR }} ({{ stock.stockCode }})
          <span class="market-type" style="float: right">{{
            stock.marketType
          }}</span>
        </li>
      </ul>
      <p v-else-if="searchQuery && filteredStocks.length === 0">
        검색 결과가 없습니다.
      </p>
    </div>

    <div v-if="selectedStock" class="stock-detail">
      <div class="stock-header">
        <h2>
          {{ selectedStock.stockNameKR }}
          <span class="stock-code">{{ selectedStock.stockCode }}</span>
          <span class="stock-marketType">{{ selectedStock.marketType }}</span>
        </h2>
        <div class="stock-price">
          {{
            selectedStock.currentPrice
              ? selectedStock.currentPrice.toLocaleString()
              : "N/A"
          }}
          <span
            :class="[
              'price-change',
              selectedStock.priceChange > 0 ? 'positive' : 'negative',
            ]"
          >
            ({{
              selectedStock.priceChangePercent
                ? selectedStock.priceChangePercent
                : "N/A"
            }}%)
          </span>
        </div>
      </div>

      <div class="stock-info-grid">
        <div class="info-item">
          <span class="label">시가</span>
          <span class="value">{{
            selectedStock.openPrice
              ? selectedStock.openPrice.toLocaleString()
              : "N/A"
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">고가</span>
          <span class="value">{{
            selectedStock.highPrice
              ? selectedStock.highPrice.toLocaleString()
              : "N/A"
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">저가</span>
          <span class="value">{{
            selectedStock.lowPrice
              ? selectedStock.lowPrice.toLocaleString()
              : "N/A"
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">거래량</span>
          <span class="value">{{
            selectedStock.volume ? selectedStock.volume.toLocaleString() : "N/A"
          }}</span>
        </div>
      </div>

      <StockChart
        v-if="selectedStock"
        :stockName="selectedStock.stockNameKR"
        :stockCode="selectedStock.stockCode"
        :key="selectedStock.stockCode"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStockStore } from "@/stores/stockStore";
import StockChart from "./StockChart.vue";

export default {
  components: {
    StockChart,
  },
  setup(_, { emit }) {
    const stockStore = useStockStore();
    const searchQuery = ref("");
    const filteredStocks = computed(() => stockStore.searchResults);
    let intervalId = null;

    const selectedStock = ref(null); // 초기값을 null로 설정

    const searchStocks = async () => {
      const trimmedQuery = searchQuery.value.trim(); // 공백 제거
      if (trimmedQuery === "") {
        stockStore.searchResults = [];
        return;
      }
      console.log("Searching for:", trimmedQuery);
      try {
        await stockStore.fetchStocks(trimmedQuery); // 트리밍된 검색어 사용
        console.log("Search results:", stockStore.searchResults);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    const selectStock = async (stock) => {
  try {
    const priceData = await stockStore.fetchCurrentPrice(stock.stockCode);
    if (priceData) {
      const latestData = await stockStore.fetchLatestStockData(stock.stockCode);
      if (latestData) {
        selectedStock.value = {
          ...stock,
          currentPrice: priceData.currentPrice,
          priceChangePercent: priceData.priceChangePercent,
          openPrice: latestData.open,
          highPrice: latestData.high,
          lowPrice: latestData.low,
          volume: latestData.volume,
        };
        emit("updateCurrentPrice", priceData.currentPrice);
        emit("updateStockCode", stock.stockCode); // stockCode emit
        await stockStore.setSelectedStock({ ...selectedStock.value });
        localStorage.setItem("selectedStock", JSON.stringify(selectedStock.value));
      } else {
        console.error("Failed to fetch latest stock data.");
      }
    } else {
      console.error("Failed to fetch current price.");
    }
  } catch (error) {
    console.error("Error selecting stock:", error);
  }
};

const updateStockPrice = async () => {
  try {
    const updatedPriceData = await stockStore.fetchCurrentPrice(selectedStock.value.stockCode);
    if (updatedPriceData) {
      selectedStock.value.currentPrice = updatedPriceData.currentPrice;
      selectedStock.value.priceChangePercent = updatedPriceData.priceChangePercent;
      emit("updateCurrentPrice", updatedPriceData.currentPrice);
      emit("updateStockCode", selectedStock.value.stockCode); // stockCode emit
    } else {
      console.error("Failed to fetch updated price.");
    }
  } catch (error) {
    console.error("Error fetching updated price:", error);
  }
};

    onMounted(() => {
      const savedStock = localStorage.getItem("selectedStock");
      if (savedStock) {
        selectedStock.value = JSON.parse(savedStock);
      }
      updateStockPrice();
      intervalId = setInterval(updateStockPrice, 3000);
    });

    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId);
    });

    return {
      searchQuery,
      selectStock,
      filteredStocks,
      selectedStock,
      searchStocks,
    };
  },
};
</script>

<style scoped>
.stock-info-page {
  max-width: 1600px;
  margin: 0 auto;
  box-sizing: border-box;
  font-family: "HakgyoansimWoojuR";
  font-weight: bold;
}

.stock-search {
  position: relative;
  margin-bottom: 20px;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 16px;
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 400px;
  margin-top: 5px;
  padding: 0;
  list-style: none;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.stock-marketType {
  font-size: 17px;
  margin-left: 15px;
  color: #888;
}

.search-results li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-results li:hover {
  background-color: #f5f5f5;
}

.stock-detail {
  margin-top: 30px;
  background-color: #ffffff;
  border: 1px solid #dfdada;
  border-radius: 8px;
  padding: 20px;
  font-weight: bold;
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stock-header h2 {
  font-weight: bold;
  font-size: 30px;
  margin: 0;
}

.stock-code {
  font-weight: bold;
  font-size: 0.8em;
  color: #888;
  margin-left: 10px;
}

.stock-price {
  font-size: 24px;
  font-weight: bold;
}

.price-change {
  font-size: 0.8em;
  margin-left: 10px;
}

.positive {
  color: #4caf50;
}
.negative {
  color: #f44336;
}

.stock-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.info-item {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e9e8e5;
}

.label {
  font-size: 0.9em;
  color: #666;
}

.value {
  display: block;
  font-size: 1.1em;
  margin-top: 5px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .stock-info-page {
    padding: 15px;
  }

  .stock-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
