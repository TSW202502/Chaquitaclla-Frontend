<script>
const defaultStyle = { width: '450px'};

export default {
  name: "product-create-and-edit-dialog",
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
  <pv-dialog :visible="visible" :modal="true" :style="getDialogStyle()" :closable="false" @hide="onCancel">
    <template #header>
      <div class="flex justify-content-start">
        <div>{{ getHeaderTitle() }}</div>
      </div>
    </template>
    <div class="p-fluid">
      <div class="field mt-5">
        <pv-float-label>
          <label for="type">{{$t('type')}}</label>
          <pv-input-text id="type" v-model="entity.type" :class="{'p-invalid':!entity.type}"/>
          <small v-if="!entity.type" class="p-invalid">{{$t('typeRequired')}}</small>
        </pv-float-label>
      </div>
      <div class="p-field mt-5">
        <pv-float-label>
          <label for="name">{{$t('name')}}</label>
          <pv-input-text id="name" v-model="entity.name" :class="{'p-invalid':!entity.name}"/>
          <small v-if="!entity.name" class="p-invalid">{{$t('nameRequired')}}</small>
        </pv-float-label>
      </div>
      <div class="p-field mt-5">
        <pv-float-label>
          <label for="quantity">{{$t('quantity')}}</label>
          <pv-input-text id="quantity" v-model="entity.quantity" :class="{'p-invalid':!entity.quantity}"/>
          <small v-if="!entity.quantity" class="p-invalid">{{$t('quantityRequired')}}</small>
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