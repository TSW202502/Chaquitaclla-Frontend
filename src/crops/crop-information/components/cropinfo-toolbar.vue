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
