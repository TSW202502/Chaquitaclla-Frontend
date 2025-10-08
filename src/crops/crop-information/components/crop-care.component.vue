<script>

import CustomTable from "./custom-table.component.vue";

export default {
  components: {CustomTable},
  name: 'crop-care',
  data() {
    return {
      date: null,
      tableHeaders: ['Date', 'Suggestion'],
      tableData: [
        ['25/07/2024', 'Water the crop for 30 min'],
        ['05/08/2024', 'Water the crop for 30 min'],
        ['15/08/2024', 'Water the crop for 30 min'],
        ['10/09/2024', 'Water the crop for 30 min'],
        ['15/09/2024', 'Water the crop for 30 min']
      ]
    };
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


