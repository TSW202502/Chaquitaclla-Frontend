<script>
import CropinfoToolbar from "./cropinfo-toolbar.vue";

export default {
  name: 'CropInformation',
  components: {CropinfoToolbar},
}
</script>

<template>
  <div class="container">
    <cropinfo-toolbar class="toolbar"></cropinfo-toolbar>
    <router-view/>
  </div>

</template>

