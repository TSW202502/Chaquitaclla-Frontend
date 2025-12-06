<script>
import { ProfileApiService } from "../service/profile-api.service.js";

const profileApiService = new ProfileApiService();

export default {
  name: "edit-profile",
  data() {
    return {
      userId: 0,
      isNewProfile: false,

      // Datos del Formulario
      newName: '',
      newEmail: '',
      newSubscription: '',
      newCountry: null,
      newCity: null,

      // Control de edición
      isEditingName: false,
      isEditingEmail: false,
      isEditingLocation: false,

      // Estados
      isLoading: false,
      isSaving: false,
      errorMessage: '',
      successMessage: '',

      // Validaciones
      nameError: '',
      emailError: '',

      // Datos Maestros
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
      cities: []
    };
  },
  computed: {
    countryName() {
      const country = this.countries.find(c => c.id === this.newCountry);
      return country ? country.name : 'No seleccionado';
    },
    cityName() {
      const city = this.allCities.find(c => c.id === this.newCity);
      return city ? city.name : 'No seleccionada';
    }
  },
  mounted() {
    this.loadProfile();
  },
  watch: {
    newCountry(newVal) {
      this.updateCities(newVal);
    }
  },
  methods: {
    async loadProfile() {
      this.isLoading = true;
      this.userId = Number(localStorage.getItem('userId'));

      try {
        const response = await profileApiService.getProfileById(this.userId);
        console.log("Perfil encontrado. Modo: EDICIÓN");
        this.isNewProfile = false;

        const prof = response.data;
        this.newName = prof.fullName;
        this.newEmail = prof.email;
        this.newSubscription = prof.subscriptionId;
        this.newCountry = prof.countryId;
        this.updateCities(this.newCountry);
        this.newCity = prof.cityId;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Perfil no encontrado (404). Modo: CREACIÓN");
          this.isNewProfile = true;
          this.newSubscription = 1;
        } else {
          console.error("Error al cargar perfil:", error);
          this.errorMessage = 'Error al cargar el perfil';
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Control de edición
    enableEditName() {
      this.isEditingName = true;
    },

    cancelEditName() {
      this.isEditingName = false;
      this.nameError = '';
      this.loadProfile(); // Recargar datos originales
    },

    enableEditEmail() {
      this.isEditingEmail = true;
    },

    cancelEditEmail() {
      this.isEditingEmail = false;
      this.emailError = '';
      this.loadProfile();
    },

    enableEditLocation() {
      this.isEditingLocation = true;
    },

    cancelEditLocation() {
      this.isEditingLocation = false;
      this.loadProfile();
    },

    // Validaciones
    validateName() {
      if (!this.newName) {
        this.nameError = 'El nombre es requerido';
        return false;
      } else if (this.newName.length < 3) {
        this.nameError = 'Mínimo 3 caracteres';
        return false;
      }
      this.nameError = '';
      return true;
    },

    validateEmail() {
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (!this.newEmail) {
        this.emailError = 'El email es requerido';
        return false;
      } else if (!emailRegex.test(this.newEmail)) {
        this.emailError = 'Email inválido';
        return false;
      }
      this.emailError = '';
      return true;
    },

    updateCities(countryId) {
      this.cities = this.allCities.filter(city => city.countryId === countryId);
    },

    async saveChanges() {
      // Validar según qué campo se está editando
      let isValid = true;

      if (this.isEditingName) {
        isValid = this.validateName();
      }

      if (this.isEditingEmail) {
        isValid = this.validateEmail() && isValid;
      }

      if (!isValid) return;

      this.isSaving = true;
      this.errorMessage = '';
      this.successMessage = '';

      const nameParts = this.newName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || ".";

      const profileData = {
        firstName: firstName,
        lastName: lastName,
        email: this.newEmail,
        countryId: this.newCountry,
        cityId: this.newCity,
        subscriptionId: this.newSubscription || 1
      };

      try {
        if (this.isNewProfile) {
          await profileApiService.create(profileData);
          this.successMessage = '¡Perfil creado exitosamente!';
        } else {
          profileData.id = this.userId;
          await profileApiService.update(this.userId, profileData);
          this.successMessage = '¡Cambios guardados exitosamente!';
        }

        // Desactivar modos de edición
        this.isEditingName = false;
        this.isEditingEmail = false;
        this.isEditingLocation = false;

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

      } catch (error) {
        console.error('Error al guardar:', error);
        this.errorMessage = 'Error al guardar los cambios. Intenta nuevamente.';
      } finally {
        this.isSaving = false;
      }
    },

    signOut() {
      localStorage.removeItem('userId');
      this.$router.push('/sign-in');
    }
  }
};
</script>

<template>
  <div class="profile-page">
    <div class="content-wrapper">
      <div class="profile-container">
        <!-- Sección Izquierda -->
        <div class="left-section">
          <div class="page-title">
            <h1>Mi Perfil</h1>
            <p>Gestiona tu información personal</p>
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
            <p class="avatar-text">{{ newName || 'Usuario' }}</p>
            <p class="avatar-subtitle">{{ newEmail || 'correo@ejemplo.com' }}</p>
          </div>

          <div class="action-section">
            <pv-button
                label="Cerrar Sesión"
                icon="pi pi-sign-out"
                class="btn-signout"
                @click="signOut"
            />
          </div>
        </div>

        <!-- Sección Derecha -->
        <div class="right-section">
          <div v-if="isLoading" class="loading-container">
            <i class="pi pi-spin pi-spinner loading-icon"></i>
            <p>Cargando perfil...</p>
          </div>

          <div v-else class="profile-form">
            <!-- Mensajes de éxito/error -->
            <transition name="fade">
              <div v-if="successMessage" class="alert-success">
                <i class="pi pi-check-circle"></i>
                <span>{{ successMessage }}</span>
              </div>
            </transition>

            <transition name="fade">
              <div v-if="errorMessage" class="alert-error">
                <i class="pi pi-exclamation-circle"></i>
                <span>{{ errorMessage }}</span>
              </div>
            </transition>

            <!-- Campo Nombre -->
            <div class="info-card">
              <div class="card-header">
                <div class="header-left">
                  <i class="pi pi-user card-icon"></i>
                  <h3>Nombre Completo</h3>
                </div>
                <button
                    v-if="!isEditingName"
                    class="edit-button"
                    @click="enableEditName"
                >
                  <i class="pi pi-pencil"></i>
                  Editar
                </button>
              </div>

              <div class="card-content">
                <div v-if="!isEditingName" class="display-value">
                  {{ newName || 'No especificado' }}
                </div>

                <div v-else class="edit-container">
                  <div class="input-wrapper">
                    <pv-input-text
                        v-model="newName"
                        placeholder="Ingresa tu nombre completo"
                        class="custom-input"
                        :class="{ 'input-error': nameError }"
                        @input="validateName"
                    />
                  </div>
                  <span v-if="nameError" class="error-text">{{ nameError }}</span>

                  <div class="button-group">
                    <pv-button
                        label="Guardar"
                        icon="pi pi-check"
                        class="btn-save"
                        :loading="isSaving"
                        @click="saveChanges"
                    />
                    <pv-button
                        label="Cancelar"
                        icon="pi pi-times"
                        class="btn-cancel"
                        :disabled="isSaving"
                        @click="cancelEditName"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Campo Email -->
            <div class="info-card">
              <div class="card-header">
                <div class="header-left">
                  <i class="pi pi-envelope card-icon"></i>
                  <h3>Correo Electrónico</h3>
                </div>
                <button
                    v-if="!isEditingEmail"
                    class="edit-button"
                    @click="enableEditEmail"
                >
                  <i class="pi pi-pencil"></i>
                  Editar
                </button>
              </div>

              <div class="card-content">
                <div v-if="!isEditingEmail" class="display-value">
                  {{ newEmail || 'No especificado' }}
                </div>

                <div v-else class="edit-container">
                  <div class="input-wrapper">
                    <pv-input-text
                        v-model="newEmail"
                        type="email"
                        placeholder="tu@email.com"
                        class="custom-input"
                        :class="{ 'input-error': emailError }"
                        @input="validateEmail"
                    />
                  </div>
                  <span v-if="emailError" class="error-text">{{ emailError }}</span>

                  <div class="button-group">
                    <pv-button
                        label="Guardar"
                        icon="pi pi-check"
                        class="btn-save"
                        :loading="isSaving"
                        @click="saveChanges"
                    />
                    <pv-button
                        label="Cancelar"
                        icon="pi pi-times"
                        class="btn-cancel"
                        :disabled="isSaving"
                        @click="cancelEditEmail"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Campo Ubicación -->
            <div class="info-card">
              <div class="card-header">
                <div class="header-left">
                  <i class="pi pi-map-marker card-icon"></i>
                  <h3>Ubicación</h3>
                </div>
                <button
                    v-if="!isEditingLocation"
                    class="edit-button"
                    @click="enableEditLocation"
                >
                  <i class="pi pi-pencil"></i>
                  Editar
                </button>
              </div>

              <div class="card-content">
                <div v-if="!isEditingLocation" class="location-display">
                  <div class="location-item">
                    <i class="pi pi-globe"></i>
                    <span>{{ countryName }}</span>
                  </div>
                  <div class="location-item">
                    <i class="pi pi-map-marker"></i>
                    <span>{{ cityName }}</span>
                  </div>
                </div>

                <div v-else class="edit-container">
                  <div class="location-grid">
                    <div class="input-group">
                      <label>País</label>
                      <pv-dropdown
                          v-model="newCountry"
                          :options="countries"
                          optionLabel="name"
                          optionValue="id"
                          placeholder="Selecciona tu país"
                          class="custom-dropdown"
                      />
                    </div>

                    <div class="input-group">
                      <label>Ciudad</label>
                      <pv-dropdown
                          v-model="newCity"
                          :options="cities"
                          optionLabel="name"
                          optionValue="id"
                          placeholder="Selecciona tu ciudad"
                          class="custom-dropdown"
                          :disabled="!newCountry"
                      />
                    </div>
                  </div>

                  <div class="button-group">
                    <pv-button
                        label="Guardar"
                        icon="pi pi-check"
                        class="btn-save"
                        :loading="isSaving"
                        @click="saveChanges"
                    />
                    <pv-button
                        label="Cancelar"
                        icon="pi pi-times"
                        class="btn-cancel"
                        :disabled="isSaving"
                        @click="cancelEditLocation"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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

/* Sección Izquierda */
.left-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
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
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  text-align: center;
  margin-bottom: 4px;
}

.avatar-subtitle {
  font-size: 14px;
  color: #64748b;
  text-align: center;
}

.action-section {
  padding-top: 16px;
}

.action-section :deep(.p-button) {
  width: 100%;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.btn-signout {
  background: #ef4444;
  color: white;
  border: none;
}

.btn-signout:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Sección Derecha */
.right-section {
  display: flex;
  flex-direction: column;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #64748b;
}

.loading-icon {
  font-size: 48px;
  color: #005f40;
  margin-bottom: 16px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Alertas */
.alert-success,
.alert-error {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
}

.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.alert-success i,
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

/* Tarjetas de Información */
.info-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.info-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  font-size: 22px;
  color: #005f40;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #005f40;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-button:hover {
  background: #f0fdf4;
  border-color: #005f40;
}

.edit-button i {
  font-size: 14px;
}

.card-content {
  padding-top: 8px;
}

.display-value {
  font-size: 16px;
  color: #0f172a;
  font-weight: 500;
  padding: 12px 0;
}

.location-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #0f172a;
  font-weight: 500;
}

.location-item i {
  color: #005f40;
  font-size: 18px;
}

.edit-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-wrapper {
  position: relative;
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
}

.edit-container :deep(.p-inputtext),
.edit-container :deep(.p-dropdown) {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  background: #ffffff;
  transition: all 0.2s ease;
}

.edit-container :deep(.p-inputtext:focus),
.edit-container :deep(.p-dropdown:focus) {
  border-color: #005f40;
  box-shadow: 0 0 0 4px rgba(0, 95, 64, 0.1);
  outline: none;
}

.edit-container :deep(.input-error) {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
}

.error-text {
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
  margin-top: 4px;
}

.location-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.button-group :deep(.p-button) {
  flex: 1;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-save {
  background: linear-gradient(135deg, #005f40 0%, #337d50 100%);
  color: white;
  border: none;
}

.btn-save:hover {
  background: linear-gradient(135deg, #004830 0%, #005f40 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 95, 64, 0.3);
}

.btn-cancel {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

/* Responsive */
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

  .page-title h1 {
    font-size: 28px;
  }

  .avatar-image {
    width: 140px;
    height: 140px;
  }

  .location-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .content-wrapper {
    padding: 20px;
  }

  .profile-container {
    padding: 24px;
  }

  .page-title h1 {
    font-size: 24px;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group :deep(.p-button) {
    width: 100%;
  }
}
</style>