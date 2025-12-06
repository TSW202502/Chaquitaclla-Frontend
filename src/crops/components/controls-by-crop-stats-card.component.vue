<script>
import VueApexCharts from 'vue3-apexcharts'
import {StatisticsApiService} from '../services/statistics-api.service.js';

export default {
  name: "controls-by-crop-stats",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      showDialog: false,
      mostControlledCrop: '',
      isLoading: true,
      chartOptions: {
        chart: {
          type: 'pie',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        labels: [],
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
        legend: {
          position: 'bottom',
          fontSize: '14px',
          fontWeight: 500,
          labels: {
            colors: '#0f172a'
          },
          markers: {
            width: 12,
            height: 12,
            radius: 6
          }
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '14px',
            fontWeight: 600
          },
          dropShadow: {
            enabled: false
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '0%'
            }
          }
        },
        tooltip: {
          theme: 'light',
          style: {
            fontSize: '14px'
          },
          y: {
            formatter: function(val) {
              return val + " controles"
            }
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 280
            },
            legend: {
              position: 'bottom',
              fontSize: '12px'
            }
          }
        }]
      },
      series: []
    };
  },
  created() {
    const statisticsAPI = new StatisticsApiService();
    statisticsAPI.getAllSowings().then(response => {
      const sowings = response.data;
      const controlCounts = {};
      const cropNames = {};

      Promise.all(
          sowings.map(sowing =>
              Promise.all([
                statisticsAPI.getControlsBySowing(sowing.id),
                statisticsAPI.getCrop(sowing.cropId)
              ])
          )
      ).then(results => {
        results.forEach(([controls, crop], index) => {
          if (controls.data.length === 0) {
            return;
          }
          if (crop.data.id in controlCounts) {
            controlCounts[crop.data.id] += controls.data.length;
          } else {
            controlCounts[crop.data.id] = controls.data.length;
            cropNames[crop.data.id] = crop.data.name;
          }
        });

        if (Object.keys(controlCounts).length > 0) {
          const mostControlledCropId = Object.keys(controlCounts).reduce((a, b) => controlCounts[a] > controlCounts[b] ? a : b);
          this.mostControlledCrop = cropNames[mostControlledCropId];

          this.chartOptions = {
            ...this.chartOptions,
            labels: Object.values(cropNames)
          };
          this.series = Object.values(controlCounts);
        }

        this.isLoading = false;
      });
    });
  },
  methods: {
    openDialog() {
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
    }
  }
};
</script>

<template>
  <div class="stats-card">
    <div class="card-header">
      <div class="header-icon">
        <i class="pi pi-chart-pie"></i>
      </div>
      <div class="header-text">
        <h2>{{ $t('mostControlledCrops') }}</h2>
        <p>Distribución de controles por cultivo</p>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
      <p>Cargando datos...</p>
    </div>

    <div v-else-if="series.length === 0" class="empty-state">
      <i class="pi pi-inbox"></i>
      <h3>No hay datos disponibles</h3>
      <p>No se encontraron controles registrados</p>
    </div>

    <div v-else class="card-content">
      <div class="chart-container">
        <apexchart
            :options="chartOptions"
            :series="series"
            type="pie"
            height="350"
        ></apexchart>
      </div>

      <pv-button
          :label="$t('showCropWithMostControls')"
          icon="pi pi-eye"
          class="btn-info"
          @click="openDialog"
      />
    </div>

    <!-- Custom Dialog -->
    <pv-dialog
        v-model:visible="showDialog"
        :modal="true"
        :closable="true"
        :dismissableMask="true"
        style="width: 500px;"
        class="info-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <div class="dialog-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <div>
            <h3>{{ $t('showCropWithMostControls') }}</h3>
            <p>El cultivo con mayor seguimiento</p>
          </div>
        </div>
      </template>

      <div class="dialog-content">
        <div class="highlight-box">
          <i class="pi pi-shield"></i>
          <div>
            <span class="label">Cultivo más controlado:</span>
            <span class="value">{{ mostControlledCrop }}</span>
          </div>
        </div>

        <div class="info-message">
          <i class="pi pi-info-circle"></i>
          <p>Este cultivo tiene la mayor cantidad de controles registrados, lo que indica un seguimiento más exhaustivo de su desarrollo.</p>
        </div>
      </div>

      <template #footer>
        <pv-button
            :label="$t('close')"
            icon="pi pi-times"
            class="btn-close-dialog"
            @click="closeDialog"
        />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.stats-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.header-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: white;
}

.header-text h2 {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.header-text p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #64748b;
}

.loading-state i {
  font-size: 48px;
  color: #3b82f6;
  margin-bottom: 16px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-state i {
  font-size: 64px;
  color: #cbd5e1;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 16px;
  color: #64748b;
}

/* Card Content */
.card-content {
  padding: 32px;
}

.chart-container {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.btn-info {
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.btn-info:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Dialog Styles */
.info-dialog :deep(.p-dialog) {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.info-dialog :deep(.p-dialog-header) {
  padding: 0;
  border-bottom: none;
  background: transparent;
}

.info-dialog :deep(.p-dialog-content) {
  padding: 0;
}

.info-dialog :deep(.p-dialog-footer) {
  padding: 0;
  border-top: none;
  background: transparent;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 32px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 16px 16px 0 0;
}

.dialog-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: white;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.dialog-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.dialog-header p {
  font-size: 14px;
  color: #64748b;
}

.dialog-content {
  padding: 32px;
}

.highlight-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 2px solid #93c5fd;
  border-radius: 12px;
  margin-bottom: 24px;
}

.highlight-box i {
  font-size: 32px;
  color: #2563eb;
  flex-shrink: 0;
}

.highlight-box div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.highlight-box .label {
  font-size: 13px;
  color: #1e40af;
  font-weight: 600;
}

.highlight-box .value {
  font-size: 20px;
  color: #1e3a8a;
  font-weight: 700;
}

.info-message {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
}

.info-message i {
  font-size: 20px;
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-message p {
  font-size: 14px;
  color: #166534;
  line-height: 1.5;
  margin: 0;
}

.btn-close-dialog {
  width: 100%;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: none;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  margin: 24px 32px;
  transition: all 0.3s ease;
}

.btn-close-dialog:hover {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
}

/* Responsive */
@media (max-width: 640px) {
  .card-header {
    padding: 20px;
  }

  .card-content {
    padding: 20px;
  }

  .dialog-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
  }

  .dialog-content {
    padding: 24px;
  }

  .info-dialog :deep(.p-dialog) {
    width: 95% !important;
  }
}
</style>