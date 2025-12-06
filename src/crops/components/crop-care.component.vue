<script>
import http from "../../shared/services/http-common.js";
import CustomTable from "./custom-table.component.vue";
import { SowingsApiService } from '../services/sowings-api.service.js';
import {CropCaresApiService} from "../services/crop-cares-api.service.js";

export default {
  name: 'CropCare',
  components: {CustomTable},
  props: ['sowingId'],
  data() {
    return {
      date: null,
      tableHeaders: ['Date', 'Suggestion'],
      tableData: []
    };
  },
  async created() {
    const sowingsAPI = new SowingsApiService();
    const caresAPI = new CropCaresApiService();

    try {
      const sowingResponse = await sowingsAPI.getById(this.sowingId);
      const selectedSowing = sowingResponse.data;
      console.log('Sowing Response:', sowingResponse.data);  // Log sowing data

      // Check if selectedSowing is defined
      if (selectedSowing) {
        const caresResponse = await caresAPI.getByCropId(selectedSowing.cropId);
        const cares = caresResponse.data || [];
        console.log('Cares Response:', cares);

        const response = await http.get(`/crops/${selectedSowing.cropId}/cares`);
        const newCares = response.data || [];
        console.log('New Cares Response:', newCares);

        const caresData = cares.map(care => ({
          date: care.date,
          suggestion: care.suggestion
        }));
        console.log('Cares Data:', caresData);

        this.tableData = caresData;
        console.log('Table Data:', this.tableData);
      } else {
        console.log('selectedSowing is undefined');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};
</script>

<template>
  <div>
    <pv-calendar  class="calendar" v-model="date" inline showWeek />
    <custom-table class="table" :headers="tableHeaders" :data="tableData" />
  </div>
</template>

<style scoped>
  div{
    display: flex;
  }

  .calendar{
    margin-right: 100px;
  }

  .table{
    margin-left: 100px;
    min-width: 500px;
  }
</style>