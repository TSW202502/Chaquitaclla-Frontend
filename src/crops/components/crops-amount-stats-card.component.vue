<script>
import VueApexCharts from 'vue3-apexcharts'
import {StatisticsApiService} from '../services/statistics-api.service.js';

export default {
  name: 'crops-amount-stats-card',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      showDialog: false,
      mostRegisteredCrop: '',
      isLoading: true,
      chartOptions: {
        chart: {
          type: 'bar',
          toolbar: {
            show: false
          },
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        colors: ['#10b981'],
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 8,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: 30,
          style: {
            fontSize: '14px',
            fontWeight: 600,
            colors: ['#0f172a']
          }
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: '#64748b',
              fontSize: '13px'
            }
          }
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              colors: '#0f172a',
              fontSize: '14px',
              fontWeight: 500
            }
          }
        },
        grid: {
          borderColor: '#f1f5f9',
          strokeDashArray: 4,
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: false
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
              return val + " registros"
            }
          }
        }
      },
      series: [{
        name: 'Cantidad',
        data: []
      }],
    };
  },
  created() {
    const statisticsAPI = new StatisticsApiService();
    statisticsAPI.getAllSowings().then(response => {
      const sowings = response.data;
      const cropCounts = {};

      sowings.forEach(sowing => {
        if (sowing.cropId in cropCounts) {
          cropCounts[sowing.cropId]++;
        } else {
          cropCounts[sowing.cropId] = 1;
        }
      });
      const cropQuantities = Object.values(cropCounts);

      Promise.all(
          Object.keys(cropCounts).map(cropId => statisticsAPI.getCrop(cropId))
      ).then(crops => {
        const cropNames = crops.map(crop => crop.data.name);

        this.chartOptions = {
          ...this.chartOptions,
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: cropNames
          }
        };

        this.series = [{
          name: 'Cantidad',
          data: cropQuantities
        }];

        const mostRegisteredCropId = Object.keys(cropCounts).reduce((a, b) => cropCounts[a] > cropCounts[b] ? a : b);
        const mostRegisteredCrop = crops.find(crop => crop.data.id == mostRegisteredCropId);
        this.mostRegisteredCrop = mostRegisteredCrop ? mostRegisteredCrop.data.name : '';
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
        <i class="pi pi-chart-bar"></i>
      </div>
      <div class="header-text">
        <h2>{{$t('mostRegisteredCrops')}}</h2>
        <p>Cultivos con más siembras registradas</p>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
      <p>Cargando datos...</p>
    </div>

    <div v-else class="card-content">
      <div class="chart-container">
        <apexchart
            :options="chartOptions"
            :series="series"
            type="bar"
            height="350"
        ></apexchart>
      </div>

      <pv-button
          :label="$t('wannaKnowMore')"
          icon="pi pi-info-circle"
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
            <i class="pi pi-trophy"></i>
          </div>
          <div>
            <h3>{{$t('wannaKnowMore')}}</h3>
            <p>El cultivo más registrado en tu sistema</p>
          </div>
        </div>
      </template>

      <div class="dialog-content">
        <div class="highlight-box">
          <i class="pi pi-seedling"></i>
          <div>
            <span class="label">Cultivo más popular:</span>
            <span class="value">{{ mostRegisteredCrop }}</span>
          </div>
        </div>

        <div class="info-message">
          <i class="pi pi-info-circle"></i>
          <p>Este cultivo tiene la mayor cantidad de registros de siembra en tu historial.</p>
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
  color: #10b981;
  margin-bottom: 16px;
}

/* Card Content */
.card-content {
  padding: 32px;
}

.chart-container {
  margin-bottom: 24px;
}

.btn-info {
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.btn-info:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 16px 16px 0 0;
}

.dialog-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: white;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
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
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border: 2px solid #6ee7b7;
  border-radius: 12px;
  margin-bottom: 24px;
}

.highlight-box i {
  font-size: 32px;
  color: #059669;
  flex-shrink: 0;
}

.highlight-box div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.highlight-box .label {
  font-size: 13px;
  color: #047857;
  font-weight: 600;
}

.highlight-box .value {
  font-size: 20px;
  color: #065f46;
  font-weight: 700;
}

.info-message {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
}

.info-message i {
  font-size: 20px;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-message p {
  font-size: 14px;
  color: #1e40af;
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
  border-radius: 0 0 16px 16px;
  transition: all 0.3s ease;
  border-radius: 10px;
  margin: 24px 32px;
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