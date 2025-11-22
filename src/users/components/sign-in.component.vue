<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UsersApiService } from "../service/users-api.service.js";

export default {
  name: "sign-in",
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const handleLogin = async () => {
      const usersService = new UsersApiService();
      usersService.getAllUsers().then(response => {
        console.log('Response:', response);
        const users = response.data;
        const user = users.find(user => user.email === email.value && user.password === password.value);
        if (user) {
          router.push('/control-panel');
        } else {
          errorMessage.value = 'Invalid email or password';
        }
      }).catch(error => {
        console.error('Error getting users:', error);
      });
    };

    return {
      email,
      password,
      errorMessage,
      handleLogin
    };
  },
  methods: {
    handleSignUp() {
      this.$emit('toggle', false);
    }
  }
}
</script>

<template>
  <div class="login-container">
    <pv-card class="login-card">
      <template #title>
        <h3>Sign-in</h3>
        <i class="pi pi-user" style="font-size: 32px;"></i>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <input
                type="email"
                id="email"
                v-model="email"
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
            <button type="submit" class="auth-button">Sign in</button>
            <button type="button" class="auth-button" @click="handleSignUp">Sign up</button>
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