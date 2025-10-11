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
      historyService: null
    }
  },
  methods:{
    reloadData() {
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

  // Actualizar el sowing en la base de datos
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
  },

  created(){
    console.log('Tabla creada');
    this.sowingService = new SowingsApiService();

    this.sowingService.getAllFalse()
        .then((response) => {
          console.log('Raw sowings data:', response.data);  // Log raw data
          let sowings = response.data;
          return Promise.all(sowings.map((sowing) => Sowing.toDisplayableSowing(sowing)));
        })
        .then((processedSowings) => {
          this.sowings = processedSowings;
          console.log('Processed sowings data:', this.sowings);  // Log processed data
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
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
      <pv-column field="phenological_phase" header="Phenological Phase" style="min-width:12rem">
      </pv-column>      <pv-column header="Actions" :exportable="false" style="min-width:8rem">
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

  <sowing-item-create-and-edit-dialog
      :entity="sowing"
      :visible="createAndEditDialogIsVisible"
      entityName="Sowing"
      :edit="isEdit"
      v-on:canceled="onCanceledEventHandler"
      v-on:saved="onSavedEventHandler($event)"
  />

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