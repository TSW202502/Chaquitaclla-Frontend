<script>
import CustomTable from "./custom-table.component.vue";
import { SowingsApiService } from '../services/sowings-api.service.js';
import { DiseasesApiService } from '../services/diseases-api.service.js';

export default {
  name: 'DiseasesOrPests',
  components: {CustomTable},
  props: ['sowingId'],
  data() {
    return {
      tableHeaders: ['Name', 'Description', 'Solution'],
      tableData: []
    };
  },
  created() {
    const sowingsAPI = new SowingsApiService();
    const diseasesAPI = new DiseasesApiService();
    sowingsAPI.getAll().then(response => {
      const sowings = response.data;
      const selectedSowing = sowings.find(sowing => Number(sowing.id) === Number(this.sowingId));
      if (selectedSowing) {
        diseasesAPI.getAll().then(response => {
          const diseases = response.data;
          const selectedDiseases = diseases.filter(disease => Number(disease.crop_id) === Number(selectedSowing.crop_id));
          this.tableData = selectedDiseases.map(disease => [disease.name, disease.description, disease.solution]);
        });
      }
    });
  }
};
</script>

<template>
  <div>
    <custom-table class="table" :headers="tableHeaders" :data="tableData" />
  </div>
</template>

<style scoped>
</style>
