<script>
import { useRouter } from 'vue-router';

export default {
  name: "sign-up",
  setup() {
    const router = useRouter();
    const handleSignup = () => {
      router.push('/membership-selector');
    };
    return {
      handleSignup
    };
  },
  methods: {
    handleSignIn() {
      this.$emit('toggle', true);
    }
  }
}
</script>
<template>
  <div class="register-container">
    <pv-card class="register-card">
      <template #title>
        <h3>Sign-up</h3>
        <i class="pi pi-user" style="font-size: 32px;"></i>
      </template>
      <template #content>
        <form @submit.prevent="handleSignup">
          <div class="form-group">
            <input
                type="text"
                id="firstName"
                v-model="firstName"
                placeholder="First Name"
                required
            />
          </div>
          <div class="form-group">
            <input
                type="text"
                id="lastName"
                v-model="lastName"
                placeholder="Last Name"
                required
            />
          </div>
          <div class="form-group">
            <input
                type="email"
                id="email"
                v-model="Email"
                placeholder="E-mail"
                required
            />
          </div>
          <div class="form-group">
            <input
                type="password"
                id="password"
                v-model="password"
                placeholder="Password"
                required
            />
          </div>
          <div class="button-container">
            <button type="button" class="auth-button" @click="handleSignIn">Sign in</button>
            <button type="submit" class="auth-button">Sign up</button>
          </div>
        </form>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.auth-button {
  background-color: #005f40;
  padding: 10px 20px;
  color: white;
}
</style>