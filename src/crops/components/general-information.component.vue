<script>
import { SowingsApiService } from "../services/sowings-api.service.js";

export default {
  name: 'GeneralInformation',
  props: ['sowingId'],
  data() {
    return {
      sowing: null,
      rows: []
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
            this.rows = [
              ['Crop Name', this.sowing.crop_name],
              ['Date Created', this.sowing.start_date],
              ['Planted Area (m2)', this.sowing.area_land]
            ];
          });
    }
  }
};
</script>

<template>
  <div class="container">
    <div class="image-container">
      <img class="crop-image" :src="sowing?.crop_info?.image" alt="Crop Image"/>
    </div>
    <div class="labels-container">
     <div class="row" v-for="(row, index) in rows" :key="index">
        <div class="column" v-for="(label, columnIndex) in row" :key="columnIndex"
             :class="{ 'grey-label': columnIndex % 2 === 0, 'green-label': columnIndex % 2 !== 0 }">
          {{ label }}
        </div>
        <div class="separator" v-if="index < rows.length - 1"></div>
      </div>
    </div>
  </div>
  <div class="description">
    <p>
      {{ sowing?.crop_info?.description }}
    </p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  margin-bottom: 50px;
}

.image-container {
  flex: 1;
  margin-right: 50px;
}

.labels-container {
  flex: 1;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 50px;
  display: flex;
  flex-direction: column;

}

.row {
  display: flex;
  margin-bottom: 10px;
}

.column {
  flex: 1;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
}

.grey-label {
  background-color: #D9D9D9;
  color: black;
}

.green-label {
  background-color: #005f40;
  color: white;
}

.description{
  background-color: #005f40;
  color: white;
  padding: 10px 20px;
  text-align: center;
  border-radius: 5px;
}
.crop-image {
  width: 400px;
  height: 400px;
  border-radius: 20px;
}
</style>