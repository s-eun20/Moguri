<template>
  <div class="stock-info-page">
    <div class="stock-search">
      <div class="search-container">
        <input
          v-model="searchQuery"
          @input="searchStocks"
          placeholder="주식 종목 검색"
          class="search-input"
        />
        <img src="@/assets/img/search.png" alt="Search" class="search-icon" />
      </div>
      <ul v-if="filteredStocks.length > 0" class="search-results">
        <li
          v-for="stock in filteredStocks"
          :key="stock.code"
          @click="selectStock(stock)"
        >
          {{ stock.name }} ({{ stock.code }})
        </li>
      </ul>
    </div>

    <div v-if="selectedStock" class="stock-detail">
      <div class="stock-header">
        <h2>
          {{ selectedStock.name }}
          <span class="stock-code">{{ selectedStock.code }}</span>
        </h2>
        <div class="stock-price">
          {{ selectedStock.currentPrice.toLocaleString() }}
          <span
            :class="[
              'price-change',
              selectedStock.priceChange > 0 ? 'positive' : 'negative',
            ]"
          >
            ({{ selectedStock.priceChangePercent }}%)
          </span>
        </div>
      </div>

      <div class="stock-info-grid">
        <div class="info-item">
          <span class="label">시가</span>
          <span class="value">{{
            selectedStock.openPrice.toLocaleString()
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">고가</span>
          <span class="value">{{
            selectedStock.highPrice.toLocaleString()
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">저가</span>
          <span class="value">{{
            selectedStock.lowPrice.toLocaleString()
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">거래량</span>
          <span class="value">{{ selectedStock.volume.toLocaleString() }}</span>
        </div>
      </div>

      <StockChart
        v-if="selectedStock"
        :stockName="selectedStock.name"
        :stockCode="selectedStock.code"
        :key="selectedStock.code"
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
    let intervalId = null;

    const selectedStock = ref({
      name: "",
      code: "",
      currentPrice: 0,
      priceChange: 0,
      priceChangePercent: 0,
      openPrice: 0,
      highPrice: 0,
      lowPrice: 0,
      volume: 0,
    });

    const stocks = [
      {
        code: "005930",
        name: "삼성전자",
        currentPrice: 63300,
        priceChange: -1300,
        priceChangePercent: -2.01,
        openPrice: 64500,
        highPrice: 64900,
        lowPrice: 63100,
        volume: 9800000,
      },
      {
        code: "000660",
        name: "SK하이닉스",
        currentPrice: 120000,
        priceChange: 2000,
        priceChangePercent: 1.69,
        openPrice: 118500,
        highPrice: 121000,
        lowPrice: 118000,
        volume: 3200000,
      },
      {
        code: "035720",
        name: "카카오",
        currentPrice: 56800,
        priceChange: 1200,
        priceChangePercent: 2.16,
        openPrice: 55900,
        highPrice: 57000,
        lowPrice: 55700,
        volume: 2500000,
      },
      {
        code: "005380",
        name: "현대차",
        currentPrice: 185000,
        priceChange: -3000,
        priceChangePercent: -1.59,
        openPrice: 187500,
        highPrice: 188000,
        lowPrice: 184500,
        volume: 1200000,
      },
      {
        code: "051910",
        name: "LG화학",
        currentPrice: 720000,
        priceChange: 15000,
        priceChangePercent: 2.13,
        openPrice: 708000,
        highPrice: 722000,
        lowPrice: 707000,
        volume: 350000,
      },
      {
        code: "035420",
        name: "NAVER",
        currentPrice: 198000,
        priceChange: -2000,
        priceChangePercent: -1.0,
        openPrice: 199500,
        highPrice: 200000,
        lowPrice: 197500,
        volume: 800000,
      },
    ];

    const filteredStocks = computed(() => {
      if (searchQuery.value.trim() === "") return [];
      return stocks.filter(
        (stock) =>
          stock.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          stock.code.includes(searchQuery.value)
      );
    });

    const searchStocks = () => {
      // 실시간 검색을 위해 별도의 함수 호출 없이 computed 속성 사용
    };

    const selectStock = async (stock) => {
      try {
        const priceData = await stockStore.fetchCurrentPrice(stock.code);
        if (priceData) {
          const latestData = await stockStore.fetchLatestStockData(stock.code);
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
            await stockStore.setSelectedStock({ ...selectedStock.value });
            localStorage.setItem(
              "selectedStock",
              JSON.stringify(selectedStock.value)
            );
          }
        }
        searchQuery.value = "";

        // 이전 인터벌 제거
        if (intervalId) clearInterval(intervalId);

        // 새로운 3초 인터벌 설정
        intervalId = setInterval(updateStockPrice, 3000); // updateStockPrice 함수 사용
      } catch (error) {
        console.error("Error selecting stock:", error);
      }
    };

    const updateStockPrice = async () => {
      try {
        const updatedPriceData = await stockStore.fetchCurrentPrice(
          selectedStock.value.code
        );
        if (updatedPriceData) {
          selectedStock.value.currentPrice = updatedPriceData.currentPrice;
          selectedStock.value.priceChangePercent =
            updatedPriceData.priceChangePercent;
          emit("updateCurrentPrice", updatedPriceData.currentPrice);
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
      searchStocks,
      selectStock,
      filteredStocks,
      selectedStock,
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

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ffcc00;
  width: 1600px;
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

  .page-title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .stock-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
