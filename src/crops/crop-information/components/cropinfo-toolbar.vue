<script>
export default {
  name: 'CropinfoToolbar',
  data() {
    return {
      title: "Crop Information",
      buttons: ["General Information", "Crop Care", "Controls", "Diseases or Pests", "Products Used"],
      routes: ["/general-information", "/crop-care", "/controls", "/diseases-or-pests", "/products-used"],
      activeButton: 0
    };
  },
  methods: {
    selectButton(index) {
      this.activeButton = index;
    }
  }
}
</script>

<template>
  <div class="container">
    <h1 class="title">{{ title }}</h1>
    <div class="buttons">
      <router-link v-for="(button, index) in buttons" :key="index" :to="routes[index]">
        <button
            :key="index"
            :class="{ active: activeButton === index }"
            @click="selectButton(index)"
        >
          {{ button }}
        </button>
      </router-link>
    </div>
    <div class="line"></div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
}

.title {
  margin-bottom: 50px;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  margin: 0 20px;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}

button.active {
  background-color: #005f40;
  color: white;
}
.line{
  width: 100%;
  height: 1px;
  background: black;
}
</style>