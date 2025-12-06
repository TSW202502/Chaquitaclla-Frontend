<script>
import { CropsRecomendationApiService } from "/src/crops/services/crops-recomendation-api.service.js";

import { ProfileApiService } from "/src/profiles/service/profile-api.service.js";

export default {
  name: "control-panel-page",
  data() {
    return {
      // Menú de acciones
      items: [
        { label: 'Statistical Reports', to: '/sowing-statistics-reports', icon: 'pi-chart-bar', color: '#2563eb', description: 'Visualiza estadísticas y análisis detallados' },
        { label: 'Crop Registration', to: '/crop-list-and-registration', icon: 'pi-clipboard', color: '#16a34a', description: 'Registra y gestiona tus cultivos' },
        { label: 'Consultation forum', to: '/consultation-forum', icon: 'pi-comments', color: '#d97706', description: 'Consulta con expertos agrícolas' },
        { label: 'Crop History', to: '/crop-history', icon: 'pi-history', color: '#7c3aed', description: 'Revisa el historial de tus cultivos' }
      ],

      // Datos dinámicos
      recommendedCrop: null,
      isLoading: true,
      userName: 'Agricultor', // Valor temporal mientras carga

      // Servicios
      cropsService: null,
      profileService: null
    }
  },
  created() {
    // Inicializamos los servicios
    this.cropsService = new CropsRecomendationApiService();
    this.profileService = new ProfileApiService();

    // 1. CARGAR NOMBRE DE USUARIO
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.profileService.getProfileById(userId)
          .then(response => {
            // Si el perfil existe, tomamos el nombre completo
            if (response.data && response.data.fullName) {
              this.userName = response.data.fullName;
            }
          })
          .catch(e => console.error("Error al cargar nombre:", e));
    }

    // 2. CARGAR RECOMENDACIÓN (CULTIVOS)
    this.cropsService.getAllCrops()
        .then(response => {
          const crops = response.data;
          console.log("Cultivos encontrados:", crops); // Verifica esto en consola (F12)

          if (crops && crops.length > 0) {
            // Elegimos uno al azar para recomendar
            const randomIndex = Math.floor(Math.random() * crops.length);
            this.recommendedCrop = crops[randomIndex];
          } else {
            console.warn("No hay cultivos en la base de datos.");
          }
        })
        .catch(error => {
          console.error("Error al cargar recomendación:", error);
        })
        .finally(() => {
          this.isLoading = false;
        });
  },
  methods: {
    getGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) return 'Buenos días';
      if (hour < 18) return 'Buenas tardes';
      return 'Buenas noches';
    }
  }
}
</script>

<template>
  <div class="control-panel">
    <div class="content-wrapper">

      <div class="welcome-section">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1>{{ getGreeting() }}, {{ userName }} 👋</h1>
            <p>Bienvenido a tu panel de control agrícola</p>
          </div>
          <div class="welcome-stats">
            <div class="stat-item">
              <i class="pi pi-calendar"></i>
              <div>
                <span class="stat-value">{{ new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) }}</span>
                <span class="stat-label">Fecha actual</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="main-grid">

        <div class="actions-section">
          <h2 class="section-title">
            <i class="pi pi-bolt"></i>
            Acciones Rápidas
          </h2>

          <div class="cards-grid">
            <router-link
                v-for="(item, index) in items"
                :key="index"
                :to="item.to"
                class="action-card"
                :style="{ '--card-color': item.color }"
            >
              <div class="card-icon-wrapper">
                <i :class="`pi ${item.icon}`"></i>
              </div>
              <div class="card-content">
                <h3>{{ item.label }}</h3>
                <p>{{ item.description }}</p>
              </div>
              <div class="card-arrow">
                <i class="pi pi-arrow-right"></i>
              </div>
            </router-link>
          </div>
        </div>

        <div class="recommendation-section">
          <div class="recommendation-card">
            <div class="recommendation-header">
              <div class="header-content">
                <i class="pi pi-star"></i>
                <div>
                  <h2>{{ $t('seasonCropRecommendation') || 'Recomendación de la Temporada' }}</h2>
                  <p>Cultivo sugerido para esta estación</p>
                </div>
              </div>
            </div>

            <div v-if="isLoading" class="loading-state">
              <i class="pi pi-spin pi-spinner"></i>
              <p>Cargando recomendación...</p>
            </div>

            <div v-else-if="recommendedCrop" class="crop-details">
              <div class="crop-image-container">
                <img
                    :src="recommendedCrop.imageUrl && recommendedCrop.imageUrl.startsWith('http') ? recommendedCrop.imageUrl : 'https://via.placeholder.com/300x200?text=No+Image'"
                    :alt="recommendedCrop.name"
                    class="crop-image"
                />
                <div class="image-overlay">
                  <span class="badge-featured">Destacado</span>
                </div>
              </div>

              <div class="crop-info">
                <h3 class="crop-name">{{ recommendedCrop.name }}</h3>
                <p class="crop-description">{{ recommendedCrop.description }}</p>

                <div class="crop-benefits">
                  <h4>
                    <i class="pi pi-check-circle"></i>
                    Beneficios
                  </h4>
                  <ul>
                    <li><i class="pi pi-circle-fill"></i> <span>Óptimo para la temporada actual</span></li>
                    <li><i class="pi pi-circle-fill"></i> <span>Alto rendimiento esperado</span></li>
                  </ul>
                </div>

                <pv-button label="Ver más información" icon="pi pi-arrow-right" class="btn-learn-more" iconPos="right" />
              </div>
            </div>

            <div v-else class="error-state">
              <i class="pi pi-exclamation-triangle"></i>
              <p>No se encontraron cultivos para recomendar.</p>
              <router-link to="/crop-list-and-registration" style="margin-top: 10px; color: #005f40; font-weight: bold;">
                Registrar un Cultivo
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="tips-section">
        <div class="tip-card">
          <i class="pi pi-lightbulb"></i>
          <div>
            <h3>Consejo del día</h3>
            <p>Recuerda revisar el estado fenológico de tus cultivos regularmente.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* FIX: Definimos la variable para que el editor no marque error */
.action-card {
  --card-color: #005f40;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
.control-panel { min-height: 100vh; background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%); padding-top: 80px; }
.content-wrapper { max-width: 1400px; margin: 0 auto; padding: 40px 60px; }
.welcome-section { background: linear-gradient(135deg, #005f40 0%, #337d50 100%); border-radius: 20px; padding: 40px; margin-bottom: 40px; box-shadow: 0 10px 40px rgba(0, 95, 64, 0.2); color: white; }
.welcome-content { display: flex; justify-content: space-between; align-items: center; }
.welcome-text h1 { font-size: 36px; font-weight: 700; margin-bottom: 8px; }
.welcome-text p { font-size: 18px; opacity: 0.9; }
.welcome-stats { display: flex; gap: 32px; }
.stat-item { display: flex; align-items: center; gap: 16px; background: rgba(255, 255, 255, 0.15); padding: 16px 24px; border-radius: 12px; backdrop-filter: blur(10px); }
.stat-item i { font-size: 32px; }
.stat-item div { display: flex; flex-direction: column; }
.stat-value { font-size: 16px; font-weight: 600; text-transform: capitalize; }
.stat-label { font-size: 13px; opacity: 0.8; }
.main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
.section-title { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
.section-title i { color: #005f40; font-size: 28px; }
.actions-section { grid-column: 1; }
.cards-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.action-card { display: flex; align-items: center; gap: 20px; background: white; padding: 24px; border-radius: 16px; border: 2px solid #e2e8f0; transition: all 0.3s ease; text-decoration: none; position: relative; overflow: hidden; }
.action-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--card-color); transform: scaleY(0); transition: transform 0.3s ease; }
.action-card:hover { border-color: var(--card-color); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); transform: translateX(8px); }
.action-card:hover::before { transform: scaleY(1); }
.card-icon-wrapper { width: 64px; height: 64px; background: var(--card-color); background: linear-gradient(135deg, var(--card-color) 0%, var(--card-color) 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.card-icon-wrapper i { font-size: 32px; color: white; }
.card-content { flex: 1; }
.card-content h3 { font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
.card-content p { font-size: 14px; color: #64748b; line-height: 1.5; }
.card-arrow { opacity: 0; transform: translateX(-10px); transition: all 0.3s ease; }
.action-card:hover .card-arrow { opacity: 1; transform: translateX(0); }
.card-arrow i { font-size: 20px; color: var(--card-color); }
.recommendation-section { grid-column: 2; grid-row: 1 / 3; }
.recommendation-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); height: 100%; }
.recommendation-header { background: linear-gradient(135deg, #005f40 0%, #337d50 100%); padding: 24px 32px; color: white; }
.header-content { display: flex; align-items: center; gap: 16px; }
.header-content i { font-size: 32px; background: rgba(255, 255, 255, 0.2); padding: 12px; border-radius: 12px; }
.header-content h2 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
.header-content p { font-size: 14px; opacity: 0.9; }
.loading-state, .error-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; color: #64748b; }
.loading-state i { font-size: 48px; color: #005f40; margin-bottom: 16px; }
.error-state i { font-size: 48px; color: #ef4444; margin-bottom: 16px; }
.crop-details { padding: 32px; }
.crop-image-container { position: relative; width: 100%; height: 300px; border-radius: 16px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); }
.crop-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
.crop-image-container:hover .crop-image { transform: scale(1.05); }
.image-overlay { position: absolute; top: 16px; right: 16px; }
.badge-featured { background: rgba(255, 255, 255, 0.95); color: #005f40; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
.badge-featured::before { content: '⭐'; }
.crop-info { display: flex; flex-direction: column; gap: 20px; }
.crop-name { font-size: 28px; font-weight: 700; color: #0f172a; }
.crop-description { font-size: 16px; color: #64748b; line-height: 1.6; }
.crop-benefits h4 { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.crop-benefits h4 i { color: #16a34a; font-size: 18px; }
.crop-benefits ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.crop-benefits li { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #64748b; }
.crop-benefits li i { color: #16a34a; font-size: 8px; }
.btn-learn-more { margin-top: 8px; background: linear-gradient(135deg, #005f40 0%, #337d50 100%); border: none; padding: 14px 28px; font-size: 15px; font-weight: 600; border-radius: 10px; transition: all 0.3s ease; }
.btn-learn-more:hover { background: linear-gradient(135deg, #004830 0%, #005f40 100%); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 95, 64, 0.3); }
.tips-section { margin-top: 40px; }
.tip-card { display: flex; align-items: flex-start; gap: 20px; background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #fed7aa; padding: 24px 32px; border-radius: 16px; }
.tip-card i { font-size: 32px; color: #d97706; flex-shrink: 0; }
.tip-card h3 { font-size: 18px; font-weight: 600; color: #92400e; margin-bottom: 8px; }
.tip-card p { font-size: 15px; color: #78350f; line-height: 1.6; }
@media (max-width: 1200px) { .content-wrapper { padding: 30px 40px; } .main-grid { grid-template-columns: 1fr; } .recommendation-section { grid-column: 1; grid-row: auto; } }
@media (max-width: 968px) { .welcome-content { flex-direction: column; align-items: flex-start; gap: 24px; } .welcome-text h1 { font-size: 28px; } .welcome-stats { width: 100%; } .stat-item { flex: 1; } }
@media (max-width: 640px) { .content-wrapper { padding: 20px; } .welcome-section { padding: 24px; } .welcome-text h1 { font-size: 24px; } .welcome-stats { flex-direction: column; gap: 12px; } .section-title { font-size: 20px; } .action-card { flex-direction: column; text-align: center; } .card-arrow { display: none; } .crop-image-container { height: 200px; } .crop-name { font-size: 24px; } }
</style>