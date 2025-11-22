<!-- authentication-page.component.vue -->
<script>
import SignIn from "/src/users/components/sign-in.component.vue";
import SignUp from "../components/sign-up.component.vue";

export default {
  name: "authentication-page",
  components: {
    SignIn,
    SignUp
  },
  data() {
    return {
      isSignIn: true
    };
  },
  methods: {
    toggleSignIn(value) {
      this.isSignIn = value;
    }
  }
}
</script>

<template>
    <sign-in v-if="isSignIn" @toggle="toggleSignIn"/>
    <sign-up v-else @toggle="toggleSignIn"/>
</template>

<style scoped>

</style>