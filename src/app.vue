<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ToolbarContent from "./public/components/toolbar-content.component.vue";

export default {
  name: "app",
  components: { ToolbarContent },
  setup() {
    const route = useRoute();

    const showToolbar = computed(() => {
      const hiddenRoutes = ['/sign-in', '/sign-up', '/membership-selector'];

      return !hiddenRoutes.includes(route.path);
    });

    return {
      showToolbar
    };
  }
}
</script>

<template>
  <div class="app-container">
    <toolbar-content v-if="showToolbar"></toolbar-content>
    <div :class="['content-container', { 'with-toolbar': showToolbar }]">
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
  width: 100%;
}

.content-container.with-toolbar {
  margin-top: 64px;
}
</style>