<script>
import GeneralInformation from "../components/general-information.component.vue";
import CropCare from "../components/crop-care.component.vue";
import DiseasesOrPests from "../components/diseases-or-pests.component.vue";
import ProductsUsed from "../components/products-used.component.vue";
import Controls from "../components/controls.component.vue";
import {CropsRecomendationApiService} from "../services/crops-recomendation-api.service.js";

export default {
  name: "crop-information-management",
  components: {ProductsUsed, DiseasesOrPests, Controls, CropCare, GeneralInformation},
  data() {
    return {
      selectedSowingId: this.$route.params.id,
      crop: null,
    };
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newVal, oldVal) {
        console.log('selectedSowingId changed from', oldVal, 'to', newVal);
        this.selectedSowingId = newVal;
      }
    }
  }
}
</script>

<template>
  <div>
    <h2 style="color:black;">{{$t('cropInformationManagement')}}</h2>
    <pv-tab-view>
      <pv-tab-panel header="General Information">
        <general-information :sowing-id="selectedSowingId"/>
      </pv-tab-panel>
      <pv-tab-panel header="Crop Care">
        <crop-care :sowing-id="selectedSowingId"/>
      </pv-tab-panel>
      <pv-tab-panel header="Controls">
        <controls :sowing-id="selectedSowingId"/>
      </pv-tab-panel>
      <pv-tab-panel header="Diseases or Pest">
        <diseases-or-pests :sowing-id="selectedSowingId"/>
      </pv-tab-panel>
      <pv-tab-panel header="Products Used">
        <products-used :sowing-id="Number(selectedSowingId)"/>
      </pv-tab-panel>
    </pv-tab-view>
  </div>
</template>

<style scoped>

</style>