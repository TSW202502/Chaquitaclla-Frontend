<script>
import { SowingsApiService } from "../services/sowings-api.service.js";
import { CropsRecomendationApiService } from "../services/crops-recomendation-api.service.js";
import { Sowing } from "../models/sowing.entity.js";
import { FilterMatchMode } from "primevue/api";

export default {
  name: 'crop-history',
  data() {
    return {
      sowings: [],
      selectedSowing: {},
      selectedSowingDetailsVisible: false,
      filters: {},
      sowingService: null,
      crop: null,
      isUnmounted: false,
      isLoading: false,
      isLoadingDetails: false
    };
  },
  computed: {
    totalCrops() {
      return this.sowings.length;
    },
    successfulCrops() {
      return this.sowings.filter(s => s.phenological_phase === 'HarvestReady').length;
    },
    isSuccess() {
      return this.selectedSowing?.phenologicalPhaseName === 'HarvestReady';
    }
  },
  methods: {
    initFilters() {
      this.filters = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } };
    },
    showSowingDetails(sowing) {
      if (sowing && sowing.id) {
        this.selectedSowing = sowing;
        this.selectedSowingDetailsVisible = true;
        this.loadSowing(sowing.id);
      }
    },
    async loadSowing(sowingId) {
      if (!sowingId || this.isUnmounted) {
        return;
      }
      this.isLoadingDetails = true;
      try {
        const sowingResponse = await this.sowingService.getById(sowingId);
        if (this.isUnmounted) return;
        this.selectedSowing = sowingResponse.data;
        const cropService = new CropsRecomendationApiService();
        const cropResponse = await cropService.getCropById(this.selectedSowing.cropId);
        if (this.isUnmounted) return;
        this.crop = cropResponse.data;
      } catch (error) {
        if (this.isUnmounted) return;
        console.error('Error loading sowing or crop data:', error);
      } finally {
        this.isLoadingDetails = false;
      }
    },
    closeDialog() {
      this.selectedSowingDetailsVisible = false;
      this.crop = null;
    },
  },
  created() {
    this.isLoading = true;
    this.sowingService = new SowingsApiService();

    this.sowingService
        .getAll()
        .then((response) => {
          let data;
          if (typeof response.data === 'string') {
            try {
              data = JSON.parse(response.data);
            } catch (error) {
              console.error('Error parsing response.data:', error);
              return;
            }
          } else if (typeof response.data === 'object') {
            data = response.data;
          } else {
            console.error('Unexpected type of response.data:', typeof response.data);
            return;
          }
          console.log('Type of data:', typeof data);
          console.log('Content of data:', data);
          if (Array.isArray(data)) {
            let sowings = data;
            Promise.all(sowings.map((sowing) => Sowing.toDisplayableSowing(sowing)))
                .then((displayableSowings) => {
                  this.sowings = displayableSowings;
                  console.log('Sowings:', this.sowings);
                })
                .catch((error) => {
                  console.error('Error converting sowings to displayable format:', error);
                });
          } else {
            console.error('Error: data is not an array');
          }
        })
        .catch((error) => {
          console.error('Error loading sowings:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    this.initFilters();
  },
  beforeUnmount() {
    this.isUnmounted = true;
  },
};
</script>

<template>
  <div class="history-page">
    <div class="content-wrapper">

      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <i class="pi pi-history header-icon"></i>
            <div>
              <h1>Historial de Cultivos</h1>
              <p>Revisa el registro completo de tus cultivos pasados</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon total">
            <i class="pi pi-database"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalCrops }}</span>
            <span class="stat-label">Total de Cultivos</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ successfulCrops }}</span>
            <span class="stat-label">Cosechas Exitosas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon rate">
            <i class="pi pi-chart-line"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalCrops > 0 ? Math.round((successfulCrops / totalCrops) * 100) : 0 }}%</span>
            <span class="stat-label">Tasa de Éxito</span>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="table-card">
        <!-- Search Bar -->
        <div class="table-header">
          <div class="search-container">
            <i class="pi pi-search search-icon"></i>
            <pv-input-text
                v-model="filters['global'].value"
                placeholder="Buscar en el historial..."
                class="search-input"
            />
          </div>
          <div class="results-info">
            <span class="results-count">{{ sowings.length }}</span>
            <span class="results-label">registros encontrados</span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <i class="pi pi-spin pi-spinner loading-icon"></i>
          <p>Cargando historial...</p>
        </div>

        <!-- Data Table -->
        <pv-data-table
            v-else
            ref="dt"
            :value="sowings"
            v-model:selection="selectedSowing"
            dataKey="id"
            selectionMode="single"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
            class="custom-datatable"
        >
          <!-- Crop Name Column -->
          <pv-column field="crop_name" header="Cultivo" style="min-width:14rem">
            <template #body="slotProps">
              <div class="crop-name-cell">
                <i class="pi pi-seedling crop-icon"></i>
                <span class="crop-name">{{ slotProps.data.crop_name }}</span>
              </div>
            </template>
          </pv-column>

          <!-- Start Date Column -->
          <pv-column field="start_date" header="Fecha de Siembra" style="min-width:14rem">
            <template #body="slotProps">
              <div class="date-cell">
                <i class="pi pi-calendar date-icon"></i>
                <span>{{ slotProps.data.start_date }}</span>
              </div>
            </template>
          </pv-column>

          <!-- Harvest Date Column -->
          <pv-column field="harvest_date" header="Fecha de Cosecha" style="min-width:14rem">
            <template #body="slotProps">
              <div class="date-cell">
                <i class="pi pi-calendar-plus date-icon"></i>
                <span>{{ slotProps.data.harvest_date }}</span>
              </div>
            </template>
          </pv-column>

          <!-- Status Column -->
          <pv-column header="Estado" style="min-width:12rem">
            <template #body="slotProps">
              <div
                  class="status-badge"
                  :class="slotProps.data.phenological_phase === 'HarvestReady' ? 'success' : 'incomplete'"
              >
                <i :class="slotProps.data.phenological_phase === 'HarvestReady' ? 'pi pi-check-circle' : 'pi pi-clock'"></i>
                <span>{{ slotProps.data.phenological_phase === 'HarvestReady' ? 'Completado' : 'Incompleto' }}</span>
              </div>
            </template>
          </pv-column>

          <!-- Actions Column -->
          <pv-column header="Acciones" style="min-width:10rem">
            <template #body="slotProps">
              <pv-button
                  label="Ver Detalles"
                  icon="pi pi-eye"
                  class="btn-view-details"
                  @click="showSowingDetails(slotProps.data)"
              />
            </template>
          </pv-column>

          <!-- Empty State -->
          <template #empty>
            <div class="empty-state">
              <i class="pi pi-inbox empty-icon"></i>
              <h3>No hay cultivos en el historial</h3>
              <p>Los cultivos completados aparecerán aquí</p>
            </div>
          </template>
        </pv-data-table>
      </div>
    </div>

    <!-- Details Dialog -->
    <pv-dialog
        v-model:visible="selectedSowingDetailsVisible"
        :modal="true"
        :closable="true"
        :dismissableMask="true"
        class="details-dialog"
        style="width: 600px;"
    >
      <template #header>
        <div class="dialog-header">
          <div class="header-icon-wrapper" :class="{ 'success': isSuccess }">
            <i :class="isSuccess ? 'pi pi-check-circle' : 'pi pi-info-circle'"></i>
          </div>
          <div class="header-text">
            <h2>Detalles del Cultivo</h2>
            <p>Información completa del registro</p>
          </div>
        </div>
      </template>

      <div v-if="isLoadingDetails" class="dialog-loading">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Cargando información...</p>
      </div>

      <div v-else-if="crop && selectedSowing" class="dialog-content">
        <!-- Success/Status Banner -->
        <div class="status-banner" :class="{ 'success': isSuccess, 'incomplete': !isSuccess }">
          <i :class="isSuccess ? 'pi pi-check-circle' : 'pi pi-clock'"></i>
          <div>
            <h3>{{ isSuccess ? '¡Cosecha Exitosa!' : 'Cultivo Incompleto' }}</h3>
            <p>{{ isSuccess ? 'Tu cultivo fue completado con éxito' : 'Este cultivo no llegó a completarse' }}</p>
          </div>
        </div>

        <!-- Crop Image -->
        <div class="crop-image-container">
          <img :src="crop.imageUrl" :alt="crop.name" class="crop-image" />
        </div>

        <!-- Crop Info -->
        <div class="crop-info-section">
          <h3 class="crop-title">{{ crop.name }}</h3>
          <p class="crop-description">{{ crop.description }}</p>
        </div>

        <!-- Details Grid -->
        <div class="details-grid">
          <div class="detail-item">
            <i class="pi pi-calendar"></i>
            <div>
              <span class="detail-label">Fecha de Siembra</span>
              <span class="detail-value">{{ selectedSowing.startDate || 'No disponible' }}</span>
            </div>
          </div>

          <div class="detail-item">
            <i class="pi pi-calendar-plus"></i>
            <div>
              <span class="detail-label">Fecha de Cosecha</span>
              <span class="detail-value">{{ selectedSowing.harvestDate || 'No disponible' }}</span>
            </div>
          </div>

          <div class="detail-item">
            <i class="pi pi-map"></i>
            <div>
              <span class="detail-label">Área de Cultivo</span>
              <span class="detail-value">{{ selectedSowing.areaLand || 'No disponible' }} m²</span>
            </div>
          </div>

          <div class="detail-item">
            <i class="pi pi-chart-line"></i>
            <div>
              <span class="detail-label">Fase Final</span>
              <span class="detail-value">{{ selectedSowing.phenologicalPhaseName || 'No disponible' }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <pv-button
              label="Cerrar"
              icon="pi pi-times"
              class="btn-close"
              @click="closeDialog"
          />
        </div>
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.history-page {
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
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: #7c3aed;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
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

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.rate {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 2px solid #f1f5f9;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 18px;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
  outline: none;
}

.results-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.results-count {
  font-size: 24px;
  font-weight: 700;
  color: #7c3aed;
}

.results-label {
  font-size: 14px;
  color: #64748b;
}

/* Loading State */
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
  color: #7c3aed;
  margin-bottom: 16px;
}

/* Data Table */
.custom-datatable :deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #0f172a;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px;
  border: none;
  border-bottom: 2px solid #e2e8f0;
}

.custom-datatable :deep(.p-datatable-tbody > tr) {
  transition: all 0.2s ease;
}

.custom-datatable :deep(.p-datatable-tbody > tr:hover) {
  background: #f5f3ff;
}

.custom-datatable :deep(.p-datatable-tbody > tr > td) {
  padding: 16px;
  border: none;
  border-bottom: 1px solid #f1f5f9;
}

/* Cell Styles */
.crop-name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.crop-icon {
  font-size: 24px;
  color: #16a34a;
}

.crop-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 15px;
}

.date-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
}

.date-icon {
  font-size: 16px;
  color: #94a3b8;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-badge.success {
  background: #dcfce7;
  color: #166534;
}

.status-badge.incomplete {
  background: #fef3c7;
  color: #92400e;
}

.status-badge i {
  font-size: 14px;
}

.btn-view-details {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-view-details:hover {
  background: linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
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

/* Dialog Styles */
.details-dialog :deep(.p-dialog) {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.details-dialog :deep(.p-dialog-header) {
  padding: 24px 32px;
  border-bottom: 2px solid #f1f5f9;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  border-radius: 16px 16px 0 0;
}

.details-dialog :deep(.p-dialog-content) {
  padding: 0;
  background: white;
}

.details-dialog :deep(.p-dialog-footer) {
  padding: 20px 32px;
  border-top: 2px solid #f1f5f9;
  background: #f8fafc;
  border-radius: 0 0 16px 16px;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon-wrapper {
  width: 56px;
  height: 56px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-icon-wrapper.success {
  color: #16a34a;
}

.header-icon-wrapper:not(.success) {
  color: #7c3aed;
}

.header-text h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.header-text p {
  font-size: 14px;
  color: #64748b;
}

.dialog-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  color: #64748b;
}

.dialog-loading i {
  font-size: 48px;
  color: #7c3aed;
  margin-bottom: 16px;
}

.dialog-content {
  padding: 32px;
}

.status-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.status-banner.success {
  background: #dcfce7;
  border: 2px solid #bbf7d0;
}

.status-banner.incomplete {
  background: #fef3c7;
  border: 2px solid #fde68a;
}

.status-banner i {
  font-size: 32px;
  flex-shrink: 0;
}

.status-banner.success i {
  color: #16a34a;
}

.status-banner.incomplete i {
  color: #d97706;
}

.status-banner h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.status-banner.success h3 {
  color: #14532d;
}

.status-banner.incomplete h3 {
  color: #92400e;
}

.status-banner p {
  font-size: 14px;
}

.status-banner.success p {
  color: #166534;
}

.status-banner.incomplete p {
  color: #b45309;
}

.crop-image-container {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.crop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.crop-info-section {
  margin-bottom: 24px;
}

.crop-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.crop-description {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.detail-item i {
  font-size: 20px;
  color: #7c3aed;
  flex-shrink: 0;
  margin-top: 2px;
}

.detail-item div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  font-size: 15px;
  color: #0f172a;
  font-weight: 600;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-close {
  background: #0f172a;
  border: none;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
}

/* Paginator */
.custom-datatable :deep(.p-paginator) {
  background: #f8fafc;
  border: none;
  border-top: 2px solid #e2e8f0;
  padding: 16px 24px;
}

.custom-datatable :deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: #7c3aed;
  border-color: #7c3aed;
  color: white;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 30px 40px;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 968px) {
  .stats-section {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .search-container {
    max-width: 100%;
  }

  .details-grid {
    grid-template-columns: 1fr;
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

  .stat-value {
    font-size: 28px;
  }

  .crop-image-container {
    height: 200px;
  }

  .details-dialog :deep(.p-dialog) {
    width: 95% !important;
  }
}
</style>