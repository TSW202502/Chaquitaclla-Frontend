<script>
import CustomTable from "./custom-table.component.vue";

export default {
  components: {CustomTable},
  name:'Controls',
  data() {

    return {
      date: null,
      tableHeaders: ['Date', 'Condition of Leaves', 'Stem Condition', 'Soil Moisture'],
      tableData: [
        ['25/07/2024', 'It presents two spots or wrinkles.', 'It presents lesions and discoloration.', 'The soil is very wet.'],
        ['05/08/2024', 'No stains or wrinkles.', 'It has four perforations.', 'The soil is adequately moist.'],
        ['15/08/2024', 'It presents five spots or wrinkles.', 'No lesions or perforations.', 'The soil is dry.'],
        ['10/09/2024', 'No stains or wrinkles.', 'It presents lesions and discoloration.', 'The soil is adequately moist.'],
        ['15/09/2024', 'It presents three spots or wrinkles.', 'It presents discoloration.', 'The soil is adequately moist.']
      ]
    };
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