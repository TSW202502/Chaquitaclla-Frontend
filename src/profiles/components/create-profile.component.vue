<script>
import { ProfileApiService } from "../service/profile-api.service.js";

const profileApiService = new ProfileApiService();

export default {
  name: "create-profile",
  data() {
    return {
      newName: '',
      newEmail: '',
      newCountry: null,
      newCity: null,
      countries: [
        { id: 1, name: 'Chile', cities: ['Santiago', 'Antofagasta', 'Concepción'] },
        { id: 2, name: 'Colombia', cities: ['Bogotá', 'Barranquilla', 'Medellin'] },
        { id: 3, name: 'Ecuador', cities: ['Guayaquil', 'Quito', 'Cuenca'] },
        { id: 4, name: 'Perú', cities: ['Lima', 'Arequipa', 'Trujillo'] },
      ],
      allCities: [
        { id: 1, name: 'Santiago', countryId: 1 },
        { id: 2, name: 'Antofagasta', countryId: 1 },
        { id: 3, name: 'Concepción', countryId: 1 },
        { id: 4, name: 'Bogotá', countryId: 2 },
        { id: 5, name: 'Barranquilla', countryId: 2 },
        { id: 6, name: 'Medellin', countryId: 2 },
        { id: 7, name: 'Guayaquil', countryId: 3 },
        { id: 8, name: 'Quito', countryId: 3 },
        { id: 9, name: 'Cuenca', countryId: 3 },
        { id: 10, name: 'Lima', countryId: 4 },
        { id: 11, name: 'Arequipa', countryId: 4 },
        { id: 12, name: 'Trujillo', countryId: 4 },
      ],
      cities: [],
      isLoading: false,
      errorMessage: '',
      nameError: '',
      emailError: '',
      countryError: '',
      cityError: ''
    };
  },
  computed: {
    isFormValid() {
      return this.newName &&
          this.newEmail &&
          this.newCountry &&
          this.newCity &&
          !this.nameError &&
          !this.emailError &&
          !this.countryError &&
          !this.cityError &&
          !this.isLoading;
    }
  },
  watch: {
    newCountry(newVal) {
      this.updateCities(newVal);
      this.newCity = null;
    }
  },
  methods: {
    validateName() {
      if (!this.newName) {
        this.nameError = 'El nombre es requerido';
      } else if (this.newName.length < 3) {
        this.nameError = 'Mínimo 3 caracteres';
      } else {
        this.nameError = '';
      }
    },
    validateEmail() {
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (!this.newEmail) {
        this.emailError = 'El email es requerido';
      } else if (!emailRegex.test(this.newEmail)) {
        this.emailError = 'Email inválido';
      } else {
        this.emailError = '';
      }
    },
    validateCountry() {
      if (!this.newCountry) {
        this.countryError = 'Selecciona un país';
      } else {
        this.countryError = '';
      }
    },
    validateCity() {
      if (!this.newCity) {
        this.cityError = 'Selecciona una ciudad';
      } else {
        this.cityError = '';
      }
    },
    clearErrors() {
      if (this.errorMessage) this.errorMessage = '';
    },
    updateCities(countryId) {
      this.cities = this.allCities.filter(city => city.countryId === countryId);
      this.validateCountry();
    },

    async confirmApply() {
      this.validateName();
      this.validateEmail();
      this.validateCountry();
      this.validateCity();

      if (!this.isFormValid) {
        this.errorMessage = 'Por favor completa todos los campos correctamente';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      const nameParts = this.newName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || ".";

      const profileData = {
        firstName: firstName,
        lastName: lastName,
        email: this.newEmail,
        countryId: this.newCountry,
        cityId: this.newCity,
        subscriptionId: 1
      };
      // -----------------------

      try {
        console.log("Enviando datos al backend:", profileData);

        const response = await profileApiService.create(profileData);
        console.log("Perfil creado exitosamente:", response);

        this.$router.push('/membership-selector');

      } catch (error) {
        console.error('Error creating profile:', error);

        if (error.response && error.response.data) {
          console.log("Detalle del error:", error.response.data);
          this.errorMessage = "Datos inválidos. Revisa la consola.";
        } else {
          this.errorMessage = 'Error al crear el perfil. Intenta nuevamente.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<template>
  <div class="profile-page">
    <div class="content-wrapper">
      <div class="profile-container">

        <div class="left-section">
          <div class="page-title">
            <h1>Crea tu Perfil</h1>
            <p>Completa tu información para comenzar</p>
          </div>

          <div class="avatar-section">
            <div class="avatar-wrapper">
              <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg"
                  alt="Avatar"
                  class="avatar-image"
              />
              <div class="avatar-badge">
                <i class="pi pi-camera"></i>
              </div>
            </div>
            <p class="avatar-text">Tu foto de perfil</p>
          </div>
        </div>

        <div class="right-section">
          <form class="profile-form" @submit.prevent="confirmApply">
            <div class="form-grid">
              <div class="input-group">
                <label for="name">Nombre Completo</label>
                <div class="input-wrapper">
                  <i class="pi pi-user input-icon"></i>
                  <pv-input-text
                      id="name"
                      v-model="newName"
                      type="text"
                      class="custom-input"
                      :class="{ 'input-error': nameError }"
                      placeholder="Ingresa tu nombre completo"
                      @input="validateName(); clearErrors()"
                      @blur="validateName()"
                  />
                </div>
                <span v-if="nameError" class="error-text">{{ nameError }}</span>
              </div>

              <div class="input-group">
                <label for="email">Correo Electrónico</label>
                <div class="input-wrapper">
                  <i class="pi pi-envelope input-icon"></i>
                  <pv-input-text
                      id="email"
                      v-model="newEmail"
                      type="email"
                      class="custom-input"
                      :class="{ 'input-error': emailError }"
                      placeholder="tu@email.com"
                      @input="validateEmail(); clearErrors()"
                      @blur="validateEmail()"
                  />
                </div>
                <span v-if="emailError" class="error-text">{{ emailError }}</span>
              </div>

              <div class="input-group">
                <label for="country">País</label>
                <div class="input-wrapper">
                  <i class="pi pi-globe input-icon"></i>
                  <pv-dropdown
                      id="country"
                      v-model="newCountry"
                      :options="countries"
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Selecciona tu país"
                      class="custom-dropdown"
                      :class="{ 'input-error': countryError }"
                      @change="validateCountry(); clearErrors()"
                      @blur="validateCountry()"
                  />
                </div>
                <span v-if="countryError" class="error-text">{{ countryError }}</span>
              </div>

              <div class="input-group">
                <label for="city">Ciudad</label>
                <div class="input-wrapper">
                  <i class="pi pi-map-marker input-icon"></i>
                  <pv-dropdown
                      id="city"
                      v-model="newCity"
                      :options="cities"
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Selecciona tu ciudad"
                      class="custom-dropdown"
                      :class="{ 'input-error': cityError }"
                      :disabled="!newCountry"
                      @change="validateCity(); clearErrors()"
                      @blur="validateCity()"
                  />
                </div>
                <span v-if="cityError" class="error-text">{{ cityError }}</span>
              </div>
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
                  :label="isLoading ? 'Creando perfil...' : 'Crear Perfil'"
                  class="btn-primary"
                  :disabled="!isFormValid"
                  :loading="isLoading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
  padding-top: 80px;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 60px;
}

.profile-container {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 60px;
  align-items: start;
  background: #ffffff;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.page-title h1 {
  font-size: 36px;
  font-weight: 700;
  color: #005f40;
  margin-bottom: 8px;
  line-height: 1.2;
}

.page-title p {
  font-size: 16px;
  color: #64748b;
  font-weight: 400;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 16px;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.avatar-image {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #005f40;
  box-shadow: 0 8px 24px rgba(0, 95, 64, 0.2);
  transition: transform 0.3s ease;
}

.avatar-wrapper:hover .avatar-image {
  transform: scale(1.05);
}

.avatar-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 44px;
  height: 44px;
  background: #005f40;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-badge:hover {
  background: #004830;
  transform: scale(1.1);
}

.avatar-badge i {
  font-size: 18px;
  color: #ffffff;
}

.avatar-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.right-section {
  display: flex;
  flex-direction: column;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
  font-size: 18px;
  z-index: 1;
  pointer-events: none;
}

.input-group :deep(.p-inputtext),
.input-group :deep(.p-dropdown) {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  color: #0f172a;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.input-group :deep(.p-inputtext::placeholder) {
  color: #94a3b8;
}

.input-group :deep(.p-inputtext:hover),
.input-group :deep(.p-dropdown:hover) {
  border-color: #cbd5e1;
  background: #ffffff;
}

.input-group :deep(.p-inputtext:focus),
.input-group :deep(.p-dropdown:focus) {
  border-color: #005f40;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(0, 95, 64, 0.1);
  outline: none;
}

.input-group :deep(.input-error) {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
}

.input-group :deep(.p-dropdown .p-dropdown-label) {
  padding-left: 32px;
}

.input-group :deep(.p-dropdown.p-disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-text {
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
}

.alert-error i {
  font-size: 18px;
  flex-shrink: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.form-actions {
  margin-top: 16px;
}

.form-actions :deep(.p-button) {
  width: 100%;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: none;
}

.form-actions :deep(.btn-primary) {
  background: linear-gradient(135deg, #005f40 0%, #337d50 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(0, 95, 64, 0.3);
}

.form-actions :deep(.btn-primary:hover:not(:disabled)) {
  background: linear-gradient(135deg, #004830 0%, #005f40 100%);
  box-shadow: 0 6px 20px rgba(0, 95, 64, 0.4);
  transform: translateY(-2px);
}

.form-actions :deep(.btn-primary:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 1200px) {
  .content-wrapper {
    padding: 30px 40px;
  }

  .profile-container {
    grid-template-columns: 320px 1fr;
    gap: 40px;
    padding: 40px;
  }
}

@media (max-width: 968px) {
  .profile-container {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 32px;
  }

  .left-section {
    gap: 24px;
  }

  .page-title h1 {
    font-size: 28px;
  }

  .avatar-section {
    padding: 24px;
  }

  .avatar-image {
    width: 140px;
    height: 140px;
  }
}

@media (max-width: 640px) {
  .content-wrapper {
    padding: 20px;
  }

  .profile-container {
    padding: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .page-title h1 {
    font-size: 24px;
  }
}
</style>