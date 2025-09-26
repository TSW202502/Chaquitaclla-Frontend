<script>
import CustomTable from "./custom-table.component.vue";

export default {
  name: "ProductsUsed",
  components: {CustomTable},
  data() {

    return {
      date: null,
      tableHeaders: ['Date', 'Type', 'Name', 'Quantity'],
      tableData: [
        ['25/07/2024', 'Fertilizer', 'Aminofol Plus', '10 Kg'],
        ['25/07/2024', 'Pesticide', 'Beta-Baytroide', '10 Kg'],
        ['25/07/2024', 'Fertilizer', 'Antracol', '2 L'],
        ['25/07/2024', 'Fungicide', 'Aminofol Plus', '15 Kg'],
        ['25/07/2024', 'Pesticide', 'Beta-Baytroide', '10 Kg']
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
