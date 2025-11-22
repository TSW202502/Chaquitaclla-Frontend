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
          <label for="leave">{{$t('leaveDescription')}}</label>
          <pv-input-text id="leave" v-model="entity.leave" :class="{'p-invalid':!entity.leave}"/>
          <small v-if="!entity.leave" class="p-invalid">{{$t('leaveDescriptionRequired')}}</small>
        </pv-float-label>
      </div>
      <div class="p-field mt-5">
        <pv-float-label>
          <label for="stem">{{$t('stemDescription')}}</label>
          <pv-input-text id="stem" v-model="entity.stem" :class="{'p-invalid':!entity.stem}"/>
          <small v-if="!entity.stem" class="p-invalid">{{$t('stemDescriptionRequired')}}</small>
        </pv-float-label>
      </div>
      <div class="p-field mt-5">
        <pv-float-label>
          <label for="soil">{{$t('soilDescription')}}</label>
          <pv-input-text id="soil" v-model="entity.soil" :class="{'p-invalid':!entity.soil}"/>
          <small v-if="!entity.soil" class="p-invalid">{{$t('soilDescriptionRequired')}}</small>
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


<script>
const defaultStyle = { width: '450px'};

export default {
  name: "control-create-and-edit-dialog",
  props: { entity: null, visible: Boolean, entityName: '', edit: Boolean, size: 'default' },
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
}
</script>

<style scoped>
</style>