<script>
import LanguageSwitcher from "./language-switcher.component.vue";
import AuthenticationSection from "../../iam/components/authentication-section.component.vue";
import { useAuthenticationStore } from "../../iam/services/authentication.store.js";
import { useRoute } from "vue-router";
import { computed } from "vue";

export default {
  name: "toolbar-content",
  components: { LanguageSwitcher, AuthenticationSection },
  setup() {
    const authenticationStore = useAuthenticationStore();
    const route = useRoute();

    const currentUsername = computed(() => authenticationStore.currentUsername); //
    const isSignedIn = computed(() => authenticationStore.isSignedIn);

    const shouldShowUserInfo = computed(() => {
      return isSignedIn.value && route.path !== '/user-profile-create';
    });

    return {
      currentUsername,
      shouldShowUserInfo
    };
  }
}
</script>

<template>
  <pv-toolbar class="fixed-toolbar pv-toolbar" style="padding: 1rem 1rem 1rem 1.5rem">
    <template #start>
      <span class="toolbar-section">
        <img src="/src/assets/images/ChaquitacllaLogoNuevo-no-bg.png" alt="Logo" style="width: 10rem; height: auto; border-radius: 10%; margin-right: 1rem" />
      </span>
    </template>

    <template #center>
      <div class="toolbar-section center-start">
        <router-link to="/control-panel">
          <pv-button class="bg-transparent mr-4">
            <p>{{ $t('toolbarControlPanel') }}</p>
          </pv-button>
        </router-link>
        <router-link to="/crop-list-and-registration">
          <pv-button class="bg-transparent mr-4">
            <p>{{ $t('toolbarCropsRegistration')}}</p>
          </pv-button>
        </router-link>
      </div>
    </template>

    <template #end>
      <language-switcher/>

      <router-link to="/user-profile-edit" v-if="shouldShowUserInfo">
        <pv-button class="toolbar-section user" :Ripple="false">
          <i class="pi pi-user" style="font-size: 2rem"></i>
          <p class="ml-3">{{ currentUsername }}</p>
        </pv-button>
      </router-link>

    </template>
  </pv-toolbar>
</template>

<style scoped>
.toolbar-section {
  display: inline-block;
  flex-direction: row;
  justify-content: space-between;
}


.user {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  align-items: center;
    font-size: 1rem;
    padding: 0.5rem;
    height: auto !important;
    width: auto !important;
  transform: none !important;
}

.user:active, .user:focus {
  transform: none !important;
}


.fixed-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.pv-toolbar {
  display: flex;
  justify-content: space-between;
  background-color: var(--primary-main-green)
}

.center-start {
  display: flex;
  justify-content: flex-start;
}
</style>