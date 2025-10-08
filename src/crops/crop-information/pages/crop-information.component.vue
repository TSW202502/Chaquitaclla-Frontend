<script>
import CropinfoToolbar from "../components/cropinfo-toolbar.vue";

import DiseasesOrPests from "../../../crops/crop-information/components/diseases-or-pests.component.vue";
import GeneralInformation from "../../../crops/crop-information/components/general-information.component.vue";
import Controls from "../../../crops/crop-information/components/controls.component.vue";
import ProductsUsed from "../../../crops/crop-information/components/products-used.component.vue";
import CropCare from "../../../crops/crop-information/components/crop-care.component.vue";


export default {
  name: 'CropInformation',
  components: {CropCare, ProductsUsed, DiseasesOrPests, Controls, GeneralInformation, CropinfoToolbar},
}
</script>

<template>
  <div class="container">
    <cropinfo-toolbar class="toolbar"></cropinfo-toolbar>
    <router-view/>
  </div>

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
.toolbar {
  margin-bottom: 100px;
}
</style>

