<template>
    <b-nav-item-dropdown :text="title">
      <b-dropdown-item
        v-for="item in items"
        :key="item.url"
        :href="item.url"
      >
        {{ item.title }}
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    items: Array
  });
  </script>

  