<script>
import CustomTable from "./custom-table.component.vue";
import { CaresApiService } from '../services/cares-api.service.js';

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
  created() {
    const caresAPI = new CaresApiService();
    caresAPI.getAll().then(response => {
      const cares = response.data;
      const filteredCares = cares.filter(care => Number(care.sowing_id) === Number(this.sowingId));
      this.tableData = filteredCares.map(care => [care.date, care.suggestion]);
    });
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