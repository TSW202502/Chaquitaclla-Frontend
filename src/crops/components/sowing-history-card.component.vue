<script>
import { SowingsApiService } from "../services/sowings-api.service.js";

export default {
  name: 'sowing-history-card',
  props: ['sowingId'],
  data() {
    return {
      sowing: null,
      visible: false
    };
  },
  watch: {
    sowingId: {
      immediate: true,
      handler(newVal, oldVal) {
        console.log('sowingId changed from', oldVal, 'to', newVal);
        this.loadSowing();
      }
    }
  },
  methods: {
    loadSowing() {
      if (!this.sowingId) {
        return;
      }
      const sowingService = new SowingsApiService();
      sowingService.getById(this.sowingId)
          .then((response) => {
            this.sowing = response.data;
          });
    },
    getDialogStyle() {
      return { width: '500px' };
    }
  }
};
</script>

<template>
  <pv-dialog class="bg-green border-none p-1 " v-model:visible="visible" modal header="Header" :style="getDialogStyle()" >
    <div class="flex flex-column align-items-center">
      <h2>{{ sowing && sowing.crop_name ? sowing.crop_name : '' }}</h2>
      <img :src="sowing && sowing.crop_info ? sowing.crop_info.image : ''" alt="Crop image" class="dialog-image">
      <p class="dialog-description">{{ sowing && sowing.crop_info ? sowing.crop_info.description : '' }}</p>
      <p v-if="sowing && sowing.status === 'true'">The harvest was a success</p>
      <p v-else>The harvest was either cancelled or a failure</p>
    </div>
  </pv-dialog>
</template>



<style scoped>

.dialog-image {
  width: 50%;
  height: auto;
}

.dialog-description {
  font-size: 1.2em;
  color: #333;
}
</style>