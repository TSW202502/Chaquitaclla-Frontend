<script>
export default {
  name: 'SowingItemCreateAndEditDialog',
  props: {
    entity: { type: Object, required: true },
    visible: { type: Boolean, default: false },
    entityName: { type: String, default: 'Sowing' },
    edit: { type: Boolean, default: false }
  },
  emits: ['canceled', 'saved', 'update:visible'],
  data() {
    return {
      local: {
        crop_name: this.entity?.crop_name ?? "",
        area_land: Number(this.entity?.area_land ?? 0)
      }
    };
  },
  watch: {
    entity: {
      immediate: true,
      deep: true,
      handler(v) {
        this.local.crop_name = v?.crop_name ?? "";
        this.local.area_land = Number(v?.area_land ?? 0);
      }
    }
  },
  methods: {
    onCancel() {
      this.$emit('update:visible', false);
      this.$emit('canceled');
    },
    onSave() {
      this.$emit('saved', {
        ...this.entity,
        crop_name: this.local.crop_name,
        area_land: Number(this.local.area_land)
      });
      this.$emit('update:visible', false);
    }
  }
};
</script>

<template>
  <pv-dialog
      :visible="visible"
  :modal="true"
  :draggable="false"
  :closable="true"
  :dismissableMask="true"
  class="p-fluid"
  :header="entityName"
  @hide="onCancel"
  >
  <div class="p-fluid">
    <div class="field mt-3">
      <label class="mb-2">Crop Name</label>
      <pv-input-text
          v-model="local.crop_name"
          placeholder="Crop Name"
          class="w-full"
          :class="{ 'p-invalid': !local.crop_name || !local.crop_name.trim() }"
      />
      <small v-if="!local.crop_name || !local.crop_name.trim()" class="p-error">
        Crop Name is required
      </small>
    </div>

    <div class="field mt-4">
      <label class="mb-2">Area(m2)</label>
      <pv-input-number v-model.number="local.area_land" inputId="area_land" class="w-full" :min="1" />
    </div>
  </div>

  <template #footer>
    <div class="flex justify-content-end gap-2">
      <pv-button type="button" label="save" class="button-green" icon="pi pi-check" @click="onSave" />
      <pv-button type="button" label="cancel" severity="secondary" class="button-brown" icon="pi pi-times" @click="onCancel" />
    </div>
  </template>
  </pv-dialog>
</template>

<style scoped></style>