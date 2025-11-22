<script>
export default {
  name: "page-not-found",
  methods: {
    goHome() {
      this.$router.replace('/control-panel');
    }
  }
}
</script>

<template>
  <div class="centered-content">
    <div>
      <h1 class="text-color">Page not found</h1>
      <p class="text-color">We are sorry, the page you were looking for, does not exist</p>
      <pv-button class="button-style" @click="goHome">Volver al inicio</pv-button>
    </div>
  </div>
</template>

<style scoped>
.centered-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.text-color {
  color: #000000 !important;
}

.text-color h1 {
  color: #000000 !important;
}

.text-color p {
  color: #000000 !important;
}

.button-style {
  background-color: var(--primary-main-green);
  color: #ffffff;
}
</style>