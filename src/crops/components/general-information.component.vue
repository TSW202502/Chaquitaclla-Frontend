<script>
import { SowingsApiService } from "../services/sowings-api.service.js";
import { CropsRecomendationApiService } from "../services/crops-recomendation-api.service.js";
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
      const cropApiService = new CropsRecomendationApiService();
      sowingService.getById(this.sowingId)
          .then((response) => {
            this.sowing = response.data;
            console.log('Received sowing:', this.sowing);
            if (!this.sowing.cropId) {
              throw new Error('Crop ID is undefined');
            }
            return cropApiService.getCropById(this.sowing.cropId);
          })
          .then((response) => {
            this.sowing.crop_info = response.data;
            console.log('Received crop:', this.sowing.crop_info);
            const dateParts = this.sowing.startDate.split('T');
            const dateOnly = dateParts[0];
            this.rows = [
              ['Crop Name', this.sowing.crop_info.name],
              ['Date Created', dateOnly],
              ['Planted Area (m2)', this.sowing.areaLand]
            ];
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
    }
  }
};
</script>

<template>
  <div class="container">
    <div class="image-container">
      <img :src="sowing?.crop_info?.imageUrl" alt="Crop Image"/>
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

.image-container img {
  width: 300px;  /* Adjust as needed */
  height: 300px; /* Adjust as needed */
  object-fit: cover; /* This will ensure that the image is scaled to fill the container while maintaining its aspect ratio */
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

.description {
  background-color: #005f40;
  color: white;
  padding: 10px 20px;
  text-align: center;
  border-radius: 5px;
}
</style>