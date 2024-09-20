<template>
    <div class="overlay" v-if="isVisible">
      <div class="modal">
        <h3>소비/지출 내역 추가</h3>
        <div class="form-group">
          <label for="date">날짜</label>
          <input type="date" id="date" v-model="date" />
        </div>
        <div class="form-group">
          <label for="category">카테고리</label>
          <select id="category" v-model="category">
            <option value="">카테고리 선택</option>
            <option v-for="cat in categories" :key="cat">{{ cat }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="amount">금액</label>
          <input type="number" id="amount" v-model="amount" />
        </div>
        <div class="form-group">
          <label for="details">거래 상세내역</label>
          <input type="text" id="details" v-model="details" />
        </div>
        <div class="buttons">
          <button @click="addTransaction">추가</button>
          <button @click="closeModal">취소</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: Boolean
    },
    data() {
      return {
        date: '',
        category: '',
        amount: 0,
        details: '',
        categories: ['식비', '교통비', '건강', '쇼핑','통신비']
      };
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      addTransaction() {
        if (!this.category || this.amount <= 0) {
          alert('카테고리와 금액을 올바르게 입력해 주세요.');
          return;
        }
        const newTransaction = {
          type: this.category === '수입' ? 'income' : 'expense',
          category: this.category,
          amount: this.amount,
          details: this.details
        };
        this.$emit('add', newTransaction);
        this.closeModal();
      }
    }
  };
  </script>
  
  <style src="./Modal.css" scoped>
  </style>
  
  
  