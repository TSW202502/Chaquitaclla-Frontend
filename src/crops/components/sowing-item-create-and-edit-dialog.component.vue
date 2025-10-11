<script>

import {CropsRecomendationApiService} from "../services/crops-recomendation-api.service.js";

const defaultStyle = { width: '450px'};

export default {
  name: "sowing-item-create-and-edit-dialog",
  props: { entity: null, visible: Boolean, entityName: '', edit: Boolean, size: 'default' },
  data () {
    return {
      cropsService: null,
      cropList : [],
    }
  },

  methods: {
    onSave() {
      this.$emit('saved', this.entity);
    },
    onCancel() {
      this.$emit('canceled');
    },
    getHeaderTitle() {
      return `${this.edit ? 'Edit' : 'New'} ${this.entityName}`;
    },
    getSubmitLabel() {
      return this.edit ? 'Update' : 'Create';
    },
    getDialogStyle() {
      let dialogStyle = defaultStyle;
      dialogStyle = this.size === 'standard' ? { width: '600px'} : defaultStyle;
      dialogStyle = this.size === 'large' ? { width: '900px'} : defaultStyle;
      return dialogStyle;
    }
  }
  ,
  async created(){
    this.cropsService = new CropsRecomendationApiService();
    const response =  await this.cropsService.getAllCrops();
    this.cropList = response.data.map(crop => ({ name: crop.name, id: crop.id }));
    console.log(this.cropList);
    console.log('Created');
  }
}
</script>

<template>
  <pv-dialog v-bind:visible="visible" :modal="true" :style="getDialogStyle()" class="p-fluid" :header="entityName">
    <template #header>
      <div class="flex justify-content-start">
        <div>{{ getHeaderTitle() }}</div>
      </div>
    </template>
    <div class="p-fluid">
      <div class="field mt-5">
        <pv-float-label>
          <label for="crop_name">{{$t('cropName')}}</label>
          <pv-dropdown id="crop_name" v-model="entity.crop_name" :options="cropList" :class="{'p-invalid':!entity.crop_name}" optionLabel="name"/>
          <small v-if="!entity.crop_name" class="p-invalid">{{$t('cropNameRequired')}}</small>
        </pv-float-label>
      </div>
      <div class="p-field mt-5">
        <pv-float-label>
          <label for="area_land">{{$t('areaLand')}}</label>
          <input id="area_land" v-model="entity.area_land" class="p-inputtext p-component" type="number"/>
        </pv-float-label>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-content-end">
        <pv-button type="button" :label="getSubmitLabel()" class="p-button-text button-green" icon="pi pi-check" @click="onSave"/>
        <pv-button type="button" label="Cancel" severity="secondary" class="p-button-text button-brown" icon="pi pi-times" @click="onCancel"/>
      </div>
    </template>
  </pv-dialog>


</template>




<style scoped>

</style>