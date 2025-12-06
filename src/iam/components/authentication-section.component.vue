<script>
import { useAuthenticationStore } from "../services/authentication.store.js";
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

export default {
  name: "authentication-section",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authenticationStore = useAuthenticationStore();

    const isSignedIn = computed(() => authenticationStore.isSignedIn);
    const currentUsername = computed(() => authenticationStore.currentUsername);

    const showWelcomeMessage = computed(() => {
      return isSignedIn.value && route.path !== '/user-profile-create';
    });

    const onSignIn = () => router.push({ name: "sign-in" });
    const onSignUp = () => router.push({ name: "sign-up" });
    const onSignOut = () => authenticationStore.signOut(router);

    return {
      isSignedIn,
      currentUsername,
      showWelcomeMessage,
      onSignIn,
      onSignUp,
      onSignOut
    }
  }
}
</script>

<template>
  <div>
    <div v-if="isSignedIn">
      <span class="p-button" v-if="showWelcomeMessage"> Welcome, {{ currentUsername }}</span>
      <pv-button @click="onSignOut">Sign Out</pv-button>
    </div>
    <div v-else>
      <pv-button @click="onSignIn">Sign In</pv-button>
      <pv-button @click="onSignUp">Sign Up</pv-button>
    </div>
  </div>
</template>

<style scoped>
</style>