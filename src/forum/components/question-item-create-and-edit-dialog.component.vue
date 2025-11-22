<script>


const defaultStyle = { width: '450px'};
export default {
  name: "question-item-create-and-edit-dialog",
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

<template>
  <!-- Create / Update Dialog -->

  <pv-dialog v-bind:visible="visible" :modal="true"  :style="getDialogStyle()" class="p-fluid" :header="entityName" :closable="true" @hide="onCancel">
    <template #header>
      <div class="flex justify-content-start">
        <div>{{ getHeaderTitle() }}</div>
      </div>
    </template>
    <div class="p-fluid">
      <div class="field mt-5">
        <pv-float-label>
          <label for="category">{{$t('categoryQuestion')}}</label>
          <pv-input-text id="category" v-model="entity.category" :class="{'p-invalid':!entity.category}"/>
        </pv-float-label>
      </div>
      <div class="field mt-5">
        <pv-float-label>
          <label for="ask">{{$t('askQuestion')}}</label>
          <pv-text-area id="ask" v-model="entity.ask" :class="{'p-invalid':!entity.ask}"/>
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