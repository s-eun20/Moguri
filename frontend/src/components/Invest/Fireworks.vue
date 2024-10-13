<template>
    <canvas ref="canvas" class="fireworks-canvas"></canvas>
  </template>
  
  <script>
  import { Fireworks } from 'fireworks-js';
  
  export default {
    mounted() {
      const canvas = this.$refs.canvas;
      const fireworks = new Fireworks(canvas, {
        // Fireworks options
        autoresize: true,
        opacity: 0.5,
        sound: false,
        // You can customize other options here
      });
  
      fireworks.start();
  
      // Stop fireworks after a certain duration (e.g., 5 seconds)
      setTimeout(() => {
        fireworks.stop();
      }, 5000);
    },
    beforeDestroy() {
      // Cleanup when the component is destroyed
      if (this.fireworks) {
        this.fireworks.stop();
      }
    }
  }
  </script>
  
  <style scoped>
  .fireworks-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Prevent interaction with the canvas */
    z-index: 9999; /* Ensure it appears above other elements */
  }
  </style>