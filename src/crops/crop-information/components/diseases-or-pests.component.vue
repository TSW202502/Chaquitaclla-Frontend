<script>
import CustomTable from "./custom-table.component.vue";

export default {
  name: "DiseasesOrPests",
  components: {CustomTable},
  data() {

    return {
      date: null,
      tableHeaders: ['Name', 'Description', 'Solution'],
      tableData: [
        [
          'Bacterial Stain',
          'Bacterial disease that causes necrotic spots on leaves, stems and panicles of rice. It can cause seedling death and reduce crop yield.',
          'Copper-based fungicides can help control rice bacterial spot. Dosage and application recommendations provided by agricultural experts or local authorities should be followed.'
        ],
        [
          'Rice Beetle',
          'This beetle feeds on stored rice grains, causing significant damage to warehouses and silos.',
          'In cases of severe infestations, it may be necessary to resort to the use of pesticides. Dosage and application recommendations provided by agricultural experts or local authorities should be followed.'
        ],
        [
          'Rice Moth',
          'The larvae of this moth feed on rice leaves and stems, creating galleries and causing considerable crop damage.',
          'In cases of severe infestations, specific insecticides may be applied. Dosage and application recommendations provided by agricultural experts or local authorities should be followed.'
        ]
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
