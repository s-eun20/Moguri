<template>
    <div class="overlay" v-if="transaction">
      <div class="modal">
        <h3>수입/지출 내역 수정</h3>
        <div class="form-group">
          <label for="transactionDate">날짜</label>
          <input type="date" id="transactionDate" v-model="editedTransaction.transactionDate" />
        </div>
        <div class="form-group">
          <label for="type">유형</label>
          <select id="type" v-model="editedTransaction.type" @change="handleTypeChange">
            <option value="수입">수입</option>
            <option value="지출">지출</option>
            <option value="저축">저축</option>
          </select>
        </div>
        <div class="form-group" v-if="editedTransaction.type === '수입'">
          <label for="incomeType">수입 유형</label>
          <select id="incomeType" v-model="editedTransaction.category">
            <option value="고정수입">고정수입</option>
            <option value="부수입">부수입</option>
          </select>
        </div>
        <div class="form-group" v-if="editedTransaction.type === '지출'">
          <label for="category">카테고리</label>
          <select id="category" v-model="editedTransaction.category">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="amount">금액</label>
          <input type="number" id="amount" v-model="editedTransaction.amount" />
        </div>
        <div class="form-group">
          <label for="description">거래 상세내역</label>
          <input type="text" id="description" v-model="editedTransaction.description" />
        </div>
        <div class="form-group" v-if="editedTransaction.type === '지출'">
          <label for="paymentMethod">결제 방법</label>
          <select id="paymentMethod" v-model="editedTransaction.paymentMethod">
            <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
          </select>
        </div>
        <div class="buttons">
          <button @click="updateTransaction">수정</button>
          <button @click="close">취소</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';

  export default {
    props: {
      transaction: Object,
    },
    setup(props, { emit }) {
      const editedTransaction = ref({ ...props.transaction });
      const categories = ['식비', '교통비', '건강', '쇼핑', '통신비','주거비'];
      const paymentMethods = ['현금', '신용카드', '체크카드', '계좌이체'];

      watch(() => props.transaction, (newTransaction) => {
        editedTransaction.value = { ...newTransaction };
      });

      const handleTypeChange = () => {
        // 저축일 경우 카테고리와 결제 방법을 초기화
        if (editedTransaction.value.type === '저축') {
          editedTransaction.value.category = null;
          editedTransaction.value.paymentMethod = null;
          editedTransaction.value.incomeType = null; // 수입 유형 초기화
        }
      };

      const updateTransaction = () => {
        emit('update', editedTransaction.value);
      };

      const close = () => {
        emit('close');
      };

      return {
        editedTransaction,
        categories,
        paymentMethods,
        updateTransaction,
        close,
        handleTypeChange,
      };
    },
  };
  </script>
  
  <style src="./Modal.css" scoped>
  </style>

