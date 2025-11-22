<script>

import ToolbarContent from "./public/components/toolbar-content.component.vue";
import ControlPanelPage
  from "./public/pages/control-panel/components/control-panel-page.component.vue";

export default {
  name: "app",
  components: {ControlPanelPage, ToolbarContent},
}
</script>

<template>
  <div class="app-container">
    <toolbar-content></toolbar-content>
    <div class="content-container">
      <router-view></router-view>
    </div>
  </div>

</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
}

.content-container {
  margin-top: 64px;
}
</style>