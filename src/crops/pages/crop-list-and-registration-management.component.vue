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
    }
  },
  methods:{

    initFilters() {
      this.filters = {global: {value: null, matchMode: FilterMatchMode.CONTAINS}};
    },
    findIndexById(id) {
      return this.sowings.findIndex((sowing) => sowing.id === id);
    },

    onNewItemEventHandler() {
      this.sowing = { area_land: 50 };
      this.submitted = false;
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    onEditItemEventHandler(item) {
      this.sowing = item;
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
    },

    onSavedEventHandler(item) {
      this.submitted = true;
      if (this.sowing.crop_name.trim()) {
        if (this.sowing.area_land <= 0) {
          this.sowing.area_land = 50;
        }
        if (item.id) {
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
  this.sowing.id = 0;

  let currentDate = new Date();
  this.sowing.start_date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0];

  let harvestDate = new Date(currentDate.setMonth(currentDate.getMonth() + 4));
  this.sowing.harvest_date = new Date(harvestDate.getFullYear(), harvestDate.getMonth(), harvestDate.getDate()).toISOString().split('T')[0];

  this.sowing.user_id = 1;
  this.sowing.phenological_phase = "Germination";
  this.sowing = Sowing.fromDisplayableSowing(this.sowing);
  console.log(this.sowing);
  this.sowingService.create(this.sowing)
      .then((response) => {
        this.sowing = Sowing.toDisplayableSowing(response.data);
        this.sowings.push(this.sowing);
      });
},

    changePhenologicalPhase(sowing) {
      this.sowing = sowing;
      this.changePhaseDialogVisible = true;
    },
    onPhaseChangeCanceled() {
      this.changePhaseDialogVisible = false;
    },
    onPhaseChangeConfirmed() {
      if (this.sowing.phenological_phase === 'Germination') {
        this.sowing.phenological_phase = 'Seedling';
      } else if (this.sowing.phenological_phase === 'Seedling') {
        this.sowing.phenological_phase = 'VegetativeGrowth';
      } else if (this.sowing.phenological_phase === 'VegetativeGrowth') {
        this.sowing.phenological_phase = 'Flowering';
      } else if (this.sowing.phenological_phase === 'Flowering') {
        this.sowing.phenological_phase = 'HarvestReady';
      }
      this.updateSowing();
      this.changePhaseDialogVisible = false;
    },

    updateSowing() {
      this.sowing = Sowing.fromDisplayableSowing(this.sowing);
      this.sowingService
          .update(this.sowing.id, this.sowing)
          .then((response) => {
            this.sowings[this.findIndexById(response.data.id)] =
                Sowing.toDisplayableSowing(response.data);
          });
    },

    deleteSowing() {
      console.log('Deleting sowing with ID:', this.sowing.id);

      this.sowingService.delete(this.sowing.id)
          .then(() => {
            this.sowings = this.sowings.filter((s) => s.id !== this.sowing.id);
            this.sowing = {};
          })
          .catch((error) => {
            console.error('Error deleting sowing:', error);
          });
    },
  },

  created(){
    this.sowingService = new SowingsApiService();

    this.sowingService.getAll()
        .then((response) => {
          console.log(response.data);
          let sowings = response.data;
          this.sowings = sowings.map((sowing) => Sowing.toDisplayableSowing(sowing));
        });

    this.initFilters();
  },

}
</script>


<template>

  <div>
    <h2>
      {{$t('listCrops')}}
    </h2>
  </div>
  <div>
    <pv-data-table
        ref="dt"
        :value="sowings"
        v-model:selection="selectedSowing"
        dataKey="id" selectionMode="single"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5,10,25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
      <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
          <pv-icon-field iconPosition="left">
            <pv-input-icon>
              <i class="pi pi-search" />
            </pv-input-icon>
            <pv-input-text v-model="filters['global'].value" placeholder="Search..." />
          </pv-icon-field>
          <pv-button label="Add Crop" icon="pi pi-plus" severity="success" class="mr-2 button-brown" @click="onNewItemEventHandler" />
        </div>
      </template>
      <pv-column field="crop_name" header="Crop" style="min-width:8rem"></pv-column>
      <pv-column field="start_date" header="Planted Date" style="min-width:15rem"></pv-column>
      <pv-column field="harvest_date" header="Harvest Date" style="min-width:15rem"></pv-column>
      <pv-column field="phenological_phase" header="Phenological Phase" style="min-width:12rem"></pv-column>
      <pv-column field="area_land" header="Planted Area (m2)" style="min-width:10rem"></pv-column>

      <pv-column header="Actions" :exportable="false" style="min-width:8rem">
        <template #body="slotProps">
          <pv-button icon="pi pi-exclamation-triangle" outlined rounded class="mr-2" @click="changePhenologicalPhase(slotProps.data)" />
          <pv-button icon="pi pi-pencil" outlined rounded class="mr-2" @click="onEditItemEventHandler(slotProps.data)" />
          <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="onDeleteItemEventHandler(slotProps.data)" />
          <pv-button icon="pi pi-eye" outlined rounded class="mr-2" @click="viewSowing(slotProps.data.id)"/>
        </template>
      </pv-column>
    </pv-data-table>
  </div>
  <change-phase-dialog :visible.sync="changePhaseDialogVisible" @canceled="onPhaseChangeCanceled" @confirmed="onPhaseChangeConfirmed" />
</template>

<style scoped>
.position {
  padding-top: 4rem;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background-color: #d1e8ff;
}

.p-datatable .p-datatable-thead > tr > th {
  background-color: #007bff;
  color: #ffffff;
}

h2 {
  margin-top: 100px;
  color: black;
}


</style>