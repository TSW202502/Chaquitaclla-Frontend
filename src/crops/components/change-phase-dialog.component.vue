
<script>
export default {
  name: "change-phase-dialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onNo() {
      this.$emit('update:visible', false);
      this.$emit('canceled');
    },
    onYes() {
      this.$emit('update:visible', false);
      this.$emit('confirmed');
    }
  }
}
</script>


<template>
  <pv-dialog :visible="visible" header="Are you sure to change the phenological phase" :modal="true" :closable="false">
    <p>Changing the phenological phase will update the current state of the crop. Are you sure you want to proceed?</p>
    <template #footer>
      <pv-button label="No" class="no-button" @click="onNo" />
      <pv-button label="Yes" class="yes-button" @click="onYes" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.no-button {
  background-color: #005F40;
  color: #fff;
}

.yes-button {
  background-color: #9D7C58;
  color: #fff;
}
</style>