<script>
import VueApexCharts from 'vue3-apexcharts'
import {StatisticsApiService} from '../services/statistics-api.service.js';

export default {
  name: "controls-by-crop-stats",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      showDialog: false,
      mostControlledCrop: '',
      chartOptions: {
        chart: {
          type: 'pie'
        },
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      series: [],
    };
  },
  created() {
    const statisticsAPI = new StatisticsApiService();
    statisticsAPI.getAllSowings().then(response => {
      const sowings = response.data;
      const controlCounts = {};

      sowings.forEach(sowing => {
        if (sowing.controls.length > 0) {
          if (sowing.id in controlCounts) {
            controlCounts[sowing.id] += sowing.controls.length;
          } else {
            controlCounts[sowing.id] = sowing.controls.length;
          }
        }
      });

      const mostControlledCropId = Object.keys(controlCounts).reduce((a, b) => controlCounts[a] > controlCounts[b] ? a : b);
      this.mostControlledCrop = sowings.find(sowing => sowing.id == mostControlledCropId).crop_name;

      this.chartOptions.labels = Object.keys(controlCounts);
      this.series = Object.values(controlCounts);
    });
  },
  methods: {
    openDialog() {
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
    }
  }
};
</script>

<template>
  <div class="card-container">
    <pv-card class="bg padded-card">
      <template #header>
        <h2>{{$t('mostControlledCrops')}}</h2>
      </template>
      <template #content>
        <apexchart :options="chartOptions" :series="series" type="pie"></apexchart>
        <button @click="openDialog">{{$t('showCropWithMostControls')}}</button>
      </template>
    </pv-card>
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>{{$t('showCropWithMostControls')}}</h3>
        <p>{{ mostControlledCrop }}</p>
        <button @click="closeDialog">{{$t('close')}}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  justify-content: space-between;
}

h2 {
  color: #ffff;
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  padding: 0;
}

.bg {
  background-color: #005f40;
}

.padded-card {
  margin-top: 40px;
  margin-left: 40px;
  padding: 20px;
  border-radius: 15px;
}

button {
  display: block;
  background-color: white;
  color: black;
  margin: auto;
  margin-top: 25px;
  border: 2px solid black;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  color: black;
  padding: 20px;
  border-radius: 5px;
}
</style>