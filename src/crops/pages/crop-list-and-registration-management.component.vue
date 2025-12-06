<script>
import {SowingsApiService} from "../services/sowings-api.service.js";
import {Sowing} from "../models/sowing.entity.js";
import SowingItemCreateAndEditDialog from "../components/sowing-item-create-and-edit-dialog.component.vue";
import ChangePhaseDialog from "../components/change-phase-dialog.component.vue";
import {FilterMatchMode} from "primevue/api";

export default {
  name: "crop-list-and-registration-management",
  components: {SowingItemCreateAndEditDialog, ChangePhaseDialog},

  data(){
    return{
      sowings:[],
      sowing:{},
      selectedSowing:{},
      filters:{},
      cropsService: null,
      sowingService: null,
      createAndEditDialogIsVisible: false,
      changePhaseDialogVisible: false,
      isEdit: false,
      submitted: false,
      selectedSowingId: null,
      historyService: null,
      isLoading: false
    }
  },
  methods:{
    reloadData() {
      this.isLoading = true;
      this.sowingService.getAllFalse()
          .then((response) => {
            let sowings = response.data;
            return Promise.all(sowings.map((sowing) => Sowing.toDisplayableSowing(sowing)));
          })
          .then((processedSowings) => {
            this.sowings = processedSowings;
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          })
          .finally(() => {
            this.isLoading = false;
          });
    },

    initFilters() {
      this.filters = {global: {value: null, matchMode: FilterMatchMode.CONTAINS}};
    },
    findIndexById(id) {
      return this.sowings.findIndex((sowing) => sowing.id === id);
    },

    onNewItemEventHandler() {
      this.sowing = {};
      this.submitted = false;
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    onEditItemEventHandler(item) {
      this.sowing = {...item}; // Clonar objeto para evitar mutación directa
      this.submitted = false;
      this.isEdit = true;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItemEventHandler(item) {
      this.sowing = item;
      this.deleteSowing();
    },

    onCanceledEventHandler() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
      this.sowing = {}; // Limpiar el objeto
    },

    onSavedEventHandler(item) {
      console.log(item);
      this.submitted = true;
      if (this.sowing.crop_name.name.trim()) {
        if (this.sowing.area_land <= 0) {
          this.sowing.area_land = 50;
        }
        console.log('item');
        console.log(item.id);
        if (item.id && typeof item.id === 'number') {
          this.updateSowing();
        } else {
          this.createSowing();
        }
      }
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },
    viewSowing(id) {
      this.selectedSowingId = id;
      console.log('Selected sowing id:', this.selectedSowingId);
      this.$router.push({ name: 'crop-information', params: { id: this.selectedSowingId }});
    },
    createSowing() {
      this.sowing.id = "";

      let currentDate = new Date();
      this.sowing.start_date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0];

      let harvestDate = new Date(currentDate.setMonth(currentDate.getMonth() + 4));
      this.sowing.harvest_date = new Date(harvestDate.getFullYear(), harvestDate.getMonth(), harvestDate.getDate()).toISOString().split('T')[0];

      this.sowing.user_id = 1;

      this.sowing.crop_id = this.sowing.crop_name.id;
      this.sowing.crop_name = this.sowing.crop_name.name;

      this.sowing = Sowing.fromDisplayableSowing(this.sowing);
      let sowingResource =  {
        areaLand: this.sowing.area_land,
        cropId: this.sowing.crop_id
      }
      console.log(sowingResource);
      this.sowingService.create(sowingResource)
          .then((response) => {
            this.sowing = Sowing.toDisplayableSowing(response.data);
            this.sowings.push(this.sowing);
            this.reloadData();
          });
    },

    changePhenologicalPhase(sowing) {
      this.sowing = sowing;
      this.changePhaseDialogVisible = true;
    },

    onPhaseChangeConfirmed() {
      const phaseValues = {
        'Germination': 0,
        'Seedling': 1,
        'VegetativeGrowth': 2,
        'Flowering': 3,
        'HarvestReady': 4
      };
      const phaseNames = ['Germination', 'Seedling', 'VegetativeGrowth', 'Flowering', 'HarvestReady'];
      let phaseValue = phaseValues[this.sowing.phenological_phase];

      if (phaseValue < 4) {
        phaseValue++;
      }
      this.sowing.phenological_phase = phaseNames[phaseValue];

      this.sowingService.updatePhenologicalPhase(this.sowing.id)
          .then(() => {
            console.log('Sowing updated');
            this.reloadData();
          })
          .catch((error) => {
            console.error('Error updating sowing:', error);
          });

      this.changePhaseDialogVisible = false;
      if (this.sowing.phenological_phase === 'HarvestReady') {
        this.historyService.addToHistory(this.sowing)
            .then(() => {
              console.log('Sowing added to history');
            })
            .catch((error) => {
              console.error('Error adding sowing to history:', error);
            });
      }
    },
    onPhaseChangeCanceled() {
      this.changePhaseDialogVisible = false;
    },

    updateSowing() {
      this.sowing = Sowing.fromDisplayableSowing(this.sowing);
      const updateResource = {
        areaLand: this.sowing.area_land,
        cropId: this.sowing.crop_name.id
      };
      console.log(updateResource);
      this.sowingService
          .update(this.sowing.id, updateResource)
          .then((response) => {
            this.reloadData();
          });
    },

    deleteSowing() {
      console.log('Deleting sowing with ID:', this.sowing.crop_name.id);

      this.sowingService.delete(this.sowing.id)
          .then(() => {
            this.reloadData();
            this.sowing = {};
          })
          .catch((error) => {
            console.error('Error deleting sowing:', error);
          });
    },

    getPhaseColor(phase) {
      const colors = {
        'Germination': '#8B4513',
        'Seedling': '#9D7C58',
        'VegetativeGrowth': '#6B8E23',
        'Flowering': '#FFD700',
        'HarvestReady': '#228B22'
      };
      return colors[phase] || '#64748b';
    },

    getPhaseLabel(phase) {
      const labels = {
        'Germination': 'Germinación',
        'Seedling': 'Plántula',
        'VegetativeGrowth': 'Crecimiento',
        'Flowering': 'Floración',
        'HarvestReady': 'Lista para Cosechar'
      };
      return labels[phase] || phase;
    }
  },

  created(){
    console.log('Tabla creada');
    this.sowingService = new SowingsApiService();
    this.isLoading = true;

    this.sowingService.getAllFalse()
        .then((response) => {
          console.log('Raw sowings data:', response.data);
          let sowings = response.data;
          return Promise.all(sowings.map((sowing) => Sowing.toDisplayableSowing(sowing)));
        })
        .then((processedSowings) => {
          this.sowings = processedSowings;
          console.log('Processed sowings data:', this.sowings);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });

    this.initFilters();
  },

}
</script>

<template>
  <div class="crops-page">
    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <i class="pi pi-leaf header-icon"></i>
            <div>
              <h1>{{ $t('listCrops') || 'Mis Cultivos' }}</h1>
              <p>Gestiona y monitorea tus cultivos activos</p>
            </div>
          </div>

          <pv-button
              v-if="sowings.length > 0"
              :label="$t('addCrop') || 'Agregar Cultivo'"
              icon="pi pi-plus"
              class="btn-add-crop"
              @click="onNewItemEventHandler"
          />
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="table-card">
        <!-- Search Bar -->
        <div class="table-header">
          <div class="search-container">
            <i class="pi pi-search search-icon"></i>
            <pv-input-text
                v-model="filters['global'].value"
                :placeholder="$t('search') || 'Buscar cultivos...'"
                class="search-input"
            />
          </div>
          <div class="results-info">
            <span class="results-count">{{ sowings.length }}</span>
            <span class="results-label">cultivos registrados</span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <i class="pi pi-spin pi-spinner loading-icon"></i>
          <p>Cargando cultivos...</p>
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
            :rowsPerPageOptions="[5,10,25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
            class="custom-datatable"
        >
          <!-- Crop Name Column -->
          <pv-column field="crop_name" header="Cultivo" style="min-width:12rem">
            <template #body="slotProps">
              <div class="crop-name-cell">
                <i class="pi pi-seedling crop-icon"></i>
                <span class="crop-name">{{ slotProps.data.crop_name }}</span>
              </div>
            </template>
          </pv-column>

          <!-- Start Date Column -->
          <pv-column field="start_date" header="Fecha de Siembra" style="min-width:12rem">
            <template #body="slotProps">
              <div class="date-cell">
                <i class="pi pi-calendar date-icon"></i>
                <span>{{ slotProps.data.start_date }}</span>
              </div>
            </template>
          </pv-column>

          <!-- Harvest Date Column -->
          <pv-column field="harvest_date" header="Fecha de Cosecha" style="min-width:12rem">
            <template #body="slotProps">
              <div class="date-cell">
                <i class="pi pi-calendar-plus date-icon"></i>
                <span>{{ slotProps.data.harvest_date }}</span>
              </div>
            </template>
          </pv-column>

          <!-- Phenological Phase Column -->
          <pv-column field="phenological_phase" header="Fase Fenológica" style="min-width:14rem">
            <template #body="slotProps">
              <div class="phase-badge" :style="{ backgroundColor: getPhaseColor(slotProps.data.phenological_phase) + '20', color: getPhaseColor(slotProps.data.phenological_phase) }">
                <i class="pi pi-circle-fill phase-dot"></i>
                <span>{{ getPhaseLabel(slotProps.data.phenological_phase) }}</span>
              </div>
            </template>
          </pv-column>

          <!-- Actions Column -->
          <pv-column header="Acciones" :exportable="false" style="min-width:12rem">
            <template #body="slotProps">
              <div class="action-buttons">
                <pv-button
                    icon="pi pi-eye"
                    class="btn-action btn-view"
                    v-tooltip.top="'Ver detalles'"
                    @click="viewSowing(slotProps.data.id)"
                />
                <pv-button
                    icon="pi pi-sync"
                    class="btn-action btn-phase"
                    v-tooltip.top="'Cambiar fase'"
                    @click="changePhenologicalPhase(slotProps.data)"
                />
                <pv-button
                    icon="pi pi-pencil"
                    class="btn-action btn-edit"
                    v-tooltip.top="'Editar'"
                    @click="onEditItemEventHandler(slotProps.data)"
                />
                <pv-button
                    icon="pi pi-trash"
                    class="btn-action btn-delete"
                    v-tooltip.top="'Eliminar'"
                    @click="onDeleteItemEventHandler(slotProps.data)"
                />
              </div>
            </template>
          </pv-column>

          <!-- Empty State -->
          <template #empty>
            <div class="empty-state">
              <i class="pi pi-inbox empty-icon"></i>
              <h3>No hay cultivos registrados</h3>
              <p>Comienza agregando tu primer cultivo</p>
              <pv-button
                  label="Agregar Cultivo"
                  icon="pi pi-plus"
                  class="btn-add-empty"
                  @click="onNewItemEventHandler"
              />
            </div>
          </template>
        </pv-data-table>
      </div>
    </div>

    <!-- Dialogs -->
    <change-phase-dialog
        :visible="changePhaseDialogVisible"
        @canceled="onPhaseChangeCanceled"
        @confirmed="onPhaseChangeConfirmed"
    />

    <sowing-item-create-and-edit-dialog
        :entity="sowing"
        :visible="createAndEditDialogIsVisible"
        entityName="Cultivo"
        :edit="isEdit"
        @canceled="onCanceledEventHandler"
        @saved="onSavedEventHandler($event)"
    />
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.crops-page {
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
  color: #005f40;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
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

.btn-add-crop {
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #005f40 0%, #337d50 100%);
  border: none;
  border-radius: 10px;
  color: white;
  transition: all 0.3s ease;
}

.btn-add-crop:hover {
  background: linear-gradient(135deg, #004830 0%, #005f40 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 95, 64, 0.3);
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
  border-color: #005f40;
  box-shadow: 0 0 0 4px rgba(0, 95, 64, 0.1);
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
  color: #005f40;
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
  color: #005f40;
  margin-bottom: 16px;
}

/* Data Table Styles */
.custom-datatable {
  border: none;
}

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
  background: #f0fdf4;
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
  color: #005f40;
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

.phase-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.phase-dot {
  font-size: 8px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: none;
}

.btn-view {
  background: #eff6ff;
  color: #2563eb;
}

.btn-view:hover {
  background: #dbeafe;
  transform: translateY(-2px);
}

.btn-phase {
  background: #fef3c7;
  color: #d97706;
}

.btn-phase:hover {
  background: #fde68a;
  transform: translateY(-2px);
}

.btn-edit {
  background: #f0fdf4;
  color: #16a34a;
}

.btn-edit:hover {
  background: #dcfce7;
  transform: translateY(-2px);
}

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fee2e2;
  transform: translateY(-2px);
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
  margin-bottom: 24px;
}

.btn-add-empty {
  padding: 12px 24px;
  background: linear-gradient(135deg, #005f40 0%, #337d50 100%);
  border: none;
  border-radius: 10px;
  color: white;
}

/* Paginator Styles */
.custom-datatable :deep(.p-paginator) {
  background: #f8fafc;
  border: none;
  border-top: 2px solid #e2e8f0;
  padding: 16px 24px;
}

.custom-datatable :deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: #005f40;
  border-color: #005f40;
  color: white;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 30px 40px;
  }

  .header-content {
    padding: 24px 32px;
  }
}

@media (max-width: 968px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .btn-add-crop {
    width: 100%;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .search-container {
    max-width: 100%;
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

  .action-buttons {
    flex-wrap: wrap;
  }
}
</style>