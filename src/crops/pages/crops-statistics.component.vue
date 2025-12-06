<script>
// Importamos los componentes gráficos
import CropsAmountStatsCard from '/src/crops/components/crops-amount-stats-card.component.vue';
import ControlsByCropStats from '/src/crops/components/controls-by-crop-stats-card.component.vue';

// --- NUEVO: Importamos el servicio de perfil ---
// Ajusta la ruta (../../) según dónde tengas guardado este archivo
import { ProfileApiService } from "../../profiles/service/profile-api.service.js";

export default {
  name: "crops-statistics",
  components: {
    CropsAmountStatsCard,
    ControlsByCropStats
  },
  data() {
    return {
      userName: 'Agricultor' // Valor por defecto mientras carga
    }
  },
  created() {
    // --- LÓGICA PARA OBTENER EL NOMBRE ---
    const userId = localStorage.getItem('userId');

    if (userId) {
      const profileService = new ProfileApiService();
      profileService.getProfileById(userId)
          .then(response => {
            // Si el backend devuelve el nombre, lo asignamos
            if (response.data && response.data.fullName) {
              this.userName = response.data.fullName;
            }
          })
          .catch(error => {
            console.error("Error al cargar el nombre del perfil:", error);
            // Si falla, intentamos usar el del localStorage si existe
            const storedUser = localStorage.getItem('username');
            if (storedUser) this.userName = storedUser;
          });
    }
  }
}
</script>

<template>
  <div class="statistics-page">
    <div class="content-wrapper">

      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <i class="pi pi-chart-bar header-icon"></i>
            <div>
              <h1>{{$t('welcomeStatistics')}}, {{ userName }}</h1>
              <p>Analiza el rendimiento y tendencias de tus cultivos</p>
            </div>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <crops-amount-stats-card />
        <controls-by-crop-stats />
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

.statistics-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
  padding-top: 80px;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 60px;
}

/* Header Section */
.page-header {
  margin-bottom: 40px;
}

.header-content {
  background: white;
  padding: 32px 40px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  font-size: 48px;
  color: #3b82f6;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  padding: 20px;
  border-radius: 16px;
}

.header-left h1 {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.header-left p {
  font-size: 16px;
  color: #64748b;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 30px 40px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 640px) {
  .content-wrapper {
    padding: 20px;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-icon {
    font-size: 36px;
    padding: 16px;
  }

  .header-left h1 {
    font-size: 24px;
  }
}
</style>