<script>
import CustomTable from "./custom-table.component.vue";
import { SowingsApiService } from '../services/sowings-api.service.js';
import { DiseasesApiService } from '../services/diseases-api.service.js';
import {CropDiseasesApiService} from "../services/crop-diseases-api.service.js";
import {CropPestsApiService} from "../services/crop-pests-api.service.js"; // Import CropPestsApiService

export default {
  name: 'DiseasesOrPests',
  components: { CustomTable },
  props: ['sowingId'],
  data() {
    return {
      tableHeaders: ['Name', 'Description', 'Solution'],
      tableData: [],
      sowing: null,
    };
  },
  async created() {
    const sowingsAPI = new SowingsApiService();
    const cropDiseasesAPI = new CropDiseasesApiService();
    const cropPestsAPI = new CropPestsApiService();

    try {
      const sowingResponse = await sowingsAPI.getById(this.sowingId);
      const selectedSowing = sowingResponse.data;
      console.log('Sowing Response:', sowingResponse.data);

      let selectedDiseases = [];
      let selectedPests = [];


      if (selectedSowing) {
        const cropDiseasesResponse = await cropDiseasesAPI.getByCropId(selectedSowing.cropId);
        selectedDiseases = cropDiseasesResponse.data || [];
        console.log('Crop Diseases Response:', selectedDiseases);

        const cropPestsResponse = await cropPestsAPI.getByCropId(selectedSowing.cropId);
        selectedPests = cropPestsResponse.data || [];
        console.log('Crop Pests Response:', selectedPests);
      } else {
        console.log('selectedSowing is undefined');
      }

      const diseasesData = selectedDiseases.map(disease => ({
        name: disease.name,
        description: disease.description,
        solution: disease.solution
      }));
      console.log('Diseases Data:', diseasesData);

      const pestsData = selectedPests.map(pest => ({
        name: pest.name,
        description: pest.description,
        solution: pest.solution
      }));
      console.log('Pests Data:', pestsData);

      this.tableData = [...diseasesData, ...pestsData];
      console.log('Table Data:', this.tableData);
    } catch (error) {
      console.error('Error:', error);
    }
  }
};
</script>

<template>
  <div>
    <custom-table class="table" :headers="tableHeaders" :data="tableData"/>
  </div>
</template>

<style scoped>
</style>