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
        <div class="title-container">
          <h3>Sign In</h3>
          <i class="pi pi-user"></i>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <pv-input-text
                id="email"
                v-model="email"
                type="email"
                class="w-full"
                placeholder="Enter your email"
                required
            />
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <pv-password
                id="password"
                v-model="password"
                class="w-full"
                placeholder="Enter your password"
                required
                toggle-mask
            />
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div class="button-container">
            <pv-button type="submit" label="Sign In" class="w-full"></pv-button>
            <pv-button type="button" label="Sign Up" class="w-full secondary" @click="handleSignUp"></pv-button>
          </div>
        </form>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title-container h3 {
  margin: 0;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.title-container i {
  font-size: 32px;
  color: #005f40;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group :deep(.p-inputtext) {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group :deep(.p-inputtext:focus) {
  border-color: #005f40;
  box-shadow: 0 0 0 3px rgba(0, 95, 64, 0.1);
  outline: none;
}

.form-group :deep(.p-password) {
  width: 100%;
}

.form-group :deep(.p-password .p-inputtext) {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group :deep(.p-password .p-inputtext:focus) {
  border-color: #005f40;
  box-shadow: 0 0 0 3px rgba(0, 95, 64, 0.1);
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #dc3545;
  font-size: 14px;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
}

.button-container :deep(.p-button) {
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 6px;
  transition: all 0.3s ease;
  background-color: #005f40;
  border-color: #005f40;
}

.button-container :deep(.p-button:hover) {
  background-color: #004d33;
  border-color: #004d33;
}

.button-container :deep(.p-button.secondary) {
  background-color: #6c757d;
  border-color: #6c757d;
}

.button-container :deep(.p-button.secondary:hover) {
  background-color: #5a6268;
  border-color: #5a6268;
}

.w-full {
  width: 100%;
}
</style>