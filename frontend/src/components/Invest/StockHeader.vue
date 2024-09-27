<template>
    <div class="stock-header">
      <h1>{{ stockData.name }}</h1>
      <p>{{ stockData.price }}원</p>
      <p :class="{'price-up': stockData.change > 0, 'price-down': stockData.change < 0}">
        {{ stockData.change }} ({{ stockData.changeRate }}%)
      </p>
    </div>
  </template>
  
  <script>
  import { useStockStore } from '@/stores/stockStore';
  
  export default {
    computed: {
      stockData() {
        const store = useStockStore();
        return store.stockData || {};
      },
    },
  };
  </script>
  
  <style>
  .stock-header {
    background-color: #222;
    color: white;
    padding: 20px;
  }
  .price-up {
    color: #4caf50;
  }
  .price-down {
    color: #f44336;
  }
  </style>
  