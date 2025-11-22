
<script>
import CropsAmountStatsCard from '/src/crops/components/crops-amount-stats-card.component.vue';
import ControlsByCropStats from '/src/crops/components/controls-by-crop-stats-card.component.vue';

export default {
  name: "crops-statistics",
  components: {
    CropsAmountStatsCard,
    ControlsByCropStats
  }
}
</script>

<template>
  <h1>{{$t('welcomeStatistics')}}, Roberto Juarez</h1>
  <div class="flex-container">
    <crops-amount-stats-card />
    <controls-by-crop-stats />
  </div>
</template>


<style scoped>
.flex-container {
  display: flex;
  justify-content: space-between;
}
h1{
  color:black;
  font-size: 2.7rem;
  margin-bottom:10%;
}
</style>