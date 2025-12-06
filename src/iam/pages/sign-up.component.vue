<script>
import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignUpRequest} from "../model/sign-up.request.js";

export default {
  name: "sign-up",
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      isLoading: false,
      errorMessage: '',
      usernameError: '',
      passwordError: '',
      confirmPasswordError: ''
    };
  },
  computed: {
    isFormValid() {
      return this.username &&
          this.password &&
          this.confirmPassword &&
          !this.usernameError &&
          !this.passwordError &&
          !this.confirmPasswordError &&
          !this.isLoading;
    }
  },
  methods: {
    async onSignUp() {
      if (!this.username || !this.password || !this.confirmPassword) {
        this.errorMessage = 'Por favor completa todos los campos';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Las contraseñas no coinciden';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      try {
        let authenticationStore = useAuthenticationStore();
        let signUpRequest = new SignUpRequest(this.username, this.password);
        await authenticationStore.signUp(signUpRequest, this.$router);
      } catch (error) {
        console.error('Error en registro:', error);
        this.errorMessage = 'Error al crear la cuenta. Intenta nuevamente.';
      } finally {
        this.isLoading = false;
      }
    },

    validateUsername() {
      if (!this.username) {
        this.usernameError = 'El usuario es requerido';
      } else if (this.username.length < 3) {
        this.usernameError = 'Mínimo 3 caracteres';
      } else {
        this.usernameError = '';
      }
    },

    validatePassword() {
      if (!this.password) {
        this.passwordError = 'La contraseña es requerida';
      } else if (this.password.length < 6) {
        this.passwordError = 'Mínimo 6 caracteres';
      } else {
        this.passwordError = '';
      }
      this.validateConfirmPassword();
    },

    validateConfirmPassword() {
      if (!this.confirmPassword) {
        this.confirmPasswordError = 'Confirma tu contraseña';
      } else if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Las contraseñas no coinciden';
      } else {
        this.confirmPasswordError = '';
      }
    },

    clearErrors() {
      if (this.errorMessage) this.errorMessage = '';
    },

    handleSignIn() {
      this.$router.push('/sign-in');
    }
  }
}
</script>

<template>
  <div class="register-container">
    <div class="left-section">
      <div class="brand-header">
        <img src="/src/assets/images/ChaquitacllaLogoNuevo-no-bg.png" alt="Chaquitaclla" class="brand-logo" />
      </div>

      <div class="hero-content">
        <div class="hero-image-container">
          <img
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1200"
              alt="Agricultura Moderna"
              class="hero-image"
          />
          <div class="image-overlay"></div>
          <div class="hero-text-overlay">
            <h1 class="overlay-title">Únete a la Revolución</h1>
            <p class="overlay-subtitle">Miles de agricultores ya transformaron sus cultivos</p>
          </div>
        </div>
      </div>

      <div class="decorative-elements">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
      </div>
    </div>

    <div class="right-section">
      <div class="form-container">
        <div class="form-header">
          <h2>Crear Cuenta</h2>
          <p>Comienza tu experiencia agrícola</p>
        </div>

        <form class="register-form" @submit.prevent="onSignUp">

          <div class="input-group">
            <label for="username">Usuario</label>
            <div class="input-wrapper">
              <i class="pi pi-user input-icon"></i>
              <pv-input-text
                  id="username"
                  v-model="username"
                  type="text"
                  class="custom-input"
                  :class="{ 'input-error': usernameError }"
                  placeholder="Elige tu nombre de usuario"
                  @input="validateUsername(); clearErrors()"
                  @blur="validateUsername()"
              />
            </div>
            <span v-if="usernameError" class="error-text">{{ usernameError }}</span>
          </div>

          <div class="input-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <i class="pi pi-lock input-icon"></i>
              <pv-password
                  id="password"
                  v-model="password"
                  class="custom-password"
                  :class="{ 'input-error': passwordError }"
                  placeholder="Crea una contraseña segura"
                  toggle-mask
                  :feedback="false"
                  @input="validatePassword(); clearErrors()"
                  @blur="validatePassword()"
              />
            </div>
            <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
          </div>

          <div class="input-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <div class="input-wrapper">
              <i class="pi pi-lock input-icon"></i>
              <pv-password
                  id="confirmPassword"
                  v-model="confirmPassword"
                  class="custom-password"
                  :class="{ 'input-error': confirmPasswordError }"
                  placeholder="Confirma tu contraseña"
                  toggle-mask
                  :feedback="false"
                  @input="validateConfirmPassword(); clearErrors()"
                  @blur="validateConfirmPassword()"
              />
            </div>
            <span v-if="confirmPasswordError" class="error-text">{{ confirmPasswordError }}</span>
          </div>

          <transition name="fade">
            <div v-if="errorMessage" class="alert-error">
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ errorMessage }}</span>
            </div>
          </transition>

          <div class="form-actions">
            <pv-button
                type="submit"
                :label="isLoading ? 'Creando cuenta...' : 'Crear Cuenta'"
                class="btn-primary"
                :disabled="!isFormValid"
                :loading="isLoading"
            />

            <div class="divider">
              <span>o</span>
            </div>

            <pv-button
                type="button"
                label="Ya tengo cuenta"
                class="btn-secondary"
                @click="handleSignIn"
                :disabled="isLoading"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.register-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #ffffff;
}

.left-section {
  position: relative;
  background: linear-gradient(135deg, #0a3d20 0%, #15542d 25%, #1e6b3a 50%, #278247 75%, #2f9954 100%);
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
}

.brand-header {
  position: absolute;
  top: 40px;
  left: 60px;
  z-index: 3;
}

.brand-logo {
  width: 160px;
  height: auto;
  transition: transform 0.3s ease;
}
.brand-logo:hover { transform: scale(1.05); }

.hero-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  animation: slowZoom 20s ease-in-out infinite alternate;
}

@keyframes slowZoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      135deg,
      rgba(10, 61, 32, 0.85) 0%,
      rgba(21, 84, 45, 0.75) 25%,
      rgba(30, 107, 58, 0.65) 50%,
      rgba(39, 130, 71, 0.55) 75%,
      rgba(47, 153, 84, 0.45) 100%
  );
  z-index: 1;
}

.hero-text-overlay {
  position: absolute;
  bottom: 80px;
  left: 60px;
  right: 60px;
  z-index: 2;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.overlay-title {
  font-size: 56px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin-bottom: 16px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.overlay-subtitle {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
  line-height: 1.5;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.decorative-elements {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 2; pointer-events: none;
}
.blob {
  position: absolute; border-radius: 50%; filter: blur(100px);
  opacity: 0.2; animation: float 25s ease-in-out infinite;
}
.blob-1 { width: 500px; height: 500px; background: #34d399; top: -150px; right: -150px; animation-delay: 0s; }
.blob-2 { width: 400px; height: 400px; background: #10b981; bottom: -100px; left: -100px; animation-delay: 8s; }
.blob-3 { width: 350px; height: 350px; background: #059669; top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 16s; }

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -40px) scale(1.15); }
  66% { transform: translate(-30px, 30px) scale(0.85); }
}

.right-section {
  background: #ffffff; display: flex; align-items: center; justify-content: center; padding: 60px;
}
.form-container { width: 100%; max-width: 480px; }
.form-header { margin-bottom: 48px; }
.form-header h2 { font-size: 36px; font-weight: 700; color: #0f172a; margin-bottom: 8px; letter-spacing: -0.5px; }
.form-header p { font-size: 16px; color: #64748b; font-weight: 400; }
.register-form { display: flex; flex-direction: column; gap: 24px; }

.input-group { display: flex; flex-direction: column; gap: 8px; }
.input-group label { font-size: 14px; font-weight: 600; color: #334155; }
.input-wrapper { position: relative; display: flex; align-items: center; }

.input-icon {
  position: absolute; left: 16px; color: #94a3b8; font-size: 18px; z-index: 1; pointer-events: none;
}

.input-group :deep(.p-inputtext),
.input-group :deep(.p-password input) {
  width: 100%; padding: 14px 16px 14px 48px;
  border: 2px solid #e2e8f0; border-radius: 12px;
  font-size: 16px; color: #0f172a; background: #f8fafc;
  transition: all 0.2s ease;
}
.input-group :deep(.p-inputtext::placeholder),
.input-group :deep(.p-password input::placeholder) { color: #94a3b8; }

.input-group :deep(.p-inputtext:hover),
.input-group :deep(.p-password input:hover) { border-color: #cbd5e1; background: #ffffff; }

.input-group :deep(.p-inputtext:focus),
.input-group :deep(.p-password input:focus) {
  border-color: #15542d; background: #ffffff;
  box-shadow: 0 0 0 4px rgba(21, 84, 45, 0.1); outline: none;
}
.input-group :deep(.input-error),
.input-group :deep(.input-error input) {
  border-color: #ef4444 !important; background: #fef2f2 !important;
}
.input-group :deep(.p-password) { width: 100%; }

.error-text { font-size: 13px; color: #ef4444; font-weight: 500; display: flex; align-items: center; gap: 4px; }

.alert-error {
  display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px;
  color: #dc2626; font-size: 14px; font-weight: 500;
}
.alert-error i { font-size: 18px; flex-shrink: 0; }

.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }

.form-actions { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
.form-actions :deep(.p-button) {
  width: 100%; padding: 14px 24px; font-size: 16px; font-weight: 600;
  border-radius: 12px; transition: all 0.2s ease; border: none;
}

.form-actions :deep(.btn-primary) {
  background: linear-gradient(135deg, #15542d 0%, #2f9954 100%);
  color: white; box-shadow: 0 4px 12px rgba(21, 84, 45, 0.3);
}
.form-actions :deep(.btn-primary:hover:not(:disabled)) {
  background: linear-gradient(135deg, #0a3d20 0%, #15542d 100%);
  box-shadow: 0 6px 20px rgba(21, 84, 45, 0.4); transform: translateY(-2px);
}
.form-actions :deep(.btn-primary:disabled) { opacity: 0.6; cursor: not-allowed; transform: none; }

.form-actions :deep(.btn-secondary) {
  background: transparent; color: #15542d; border: 2px solid #e2e8f0;
}
.form-actions :deep(.btn-secondary:hover:not(:disabled)) {
  background: #f8fafc; border-color: #15542d; transform: translateY(-2px);
}

.divider { display: flex; align-items: center; text-align: center; margin: 8px 0; }
.divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #e2e8f0; }
.divider span { padding: 0 16px; color: #94a3b8; font-size: 14px; font-weight: 500; }

@media (max-width: 1200px) {
  .register-container { grid-template-columns: 1fr 1fr; }
  .brand-header { left: 40px; top: 30px; }
  .brand-logo { width: 140px; }
  .hero-text-overlay { bottom: 60px; left: 40px; right: 40px; }
  .overlay-title { font-size: 44px; }
  .overlay-subtitle { font-size: 18px; }
}

@media (max-width: 968px) {
  .register-container { grid-template-columns: 1fr; }
  .left-section { display: none; }
  .right-section { padding: 40px 24px; }
  .form-container { max-width: 100%; }
}

@media (max-width: 640px) {
  .right-section { padding: 32px 20px; }
  .form-header h2 { font-size: 28px; }
  .form-header p { font-size: 14px; }
  .input-group :deep(.p-inputtext),
  .input-group :deep(.p-password input) { padding: 12px 14px 12px 44px; font-size: 16px; }
}
</style>