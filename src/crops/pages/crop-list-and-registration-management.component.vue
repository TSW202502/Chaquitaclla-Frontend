<script>
export default {
  name: "crop-list-and-registration-management",

  data() {
    return {
      // 🔹 DATOS FALSOS (mock) PARA QUE SE RINDA LA TABLA
      sowings: [
        {
          id: 1,
          crop_name: "Maíz Amarillo",
          start_date: "2025-05-10",
          harvest_date: "2025-09-15",
          phenological_phase: "VegetativeGrowth",
          area_land: 120
        },
        {
          id: 2,
          crop_name: "Papa Canchán",
          start_date: "2025-04-22",
          harvest_date: "2025-08-30",
          phenological_phase: "Flowering",
          area_land: 80
        },
        {
          id: 3,
          crop_name: "Quinua Real",
          start_date: "2025-03-05",
          harvest_date: "2025-07-20",
          phenological_phase: "Seedling",
          area_land: 65
        },
        {
          id: 4,
          crop_name: "Trigo Andino",
          start_date: "2025-05-01",
          harvest_date: "2025-09-01",
          phenological_phase: "Germination",
          area_land: 150
        },
        {
          id: 5,
          crop_name: "Cebada",
          start_date: "2025-06-01",
          harvest_date: "2025-10-05",
          phenological_phase: "HarvestReady",
          area_land: 90
        }
      ],

      selectedSowing: null,

      // 🔹 Filtros compatibles con PrimeVue v4 (sin importar primevue/api)
      filters: {
        global: { value: null, matchMode: 'contains' }
      }
    };
  },

  methods: {
    onNewItemEventHandler() {
      // Aquí luego podrás abrir tu diálogo real.
      console.log("Nuevo cultivo (demo)");
    },
    onEditItemEventHandler(item) {
      console.log("Editar (demo):", item);
    },
    onDeleteItemEventHandler(item) {
      console.log("Eliminar (demo):", item);
      this.sowings = this.sowings.filter(s => s.id !== item.id);
    },
    viewSowing(id) {
      console.log("Ver detalle (demo), id:", id);
      // this.$router.push({ name: 'crop-information', params: { id }});
    }
  }
};
</script>

<template>
  <div>
    <h2>{{$t('listCrops') || 'Crops List'}}</h2>
  </div>

  <div class="position">
    <pv-data-table
        ref="dt"
        :value="sowings"
        v-model:selection="selectedSowing"
        dataKey="id"
        selectionMode="single"
        :paginator="true"
        :rows="5"
        :filters="filters"
        :rowsPerPageOptions="[5,10,25]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
          <pv-icon-field iconPosition="left">
            <pv-input-icon>
              <i class="pi pi-search" />
            </pv-input-icon>
            <pv-input-text v-model="filters['global'].value" placeholder="Search..." />
          </pv-icon-field>

          <pv-button
              label="Add Crop"
              icon="pi pi-plus"
              severity="success"
              class="mr-2 button-brown"
              @click="onNewItemEventHandler"
          />
        </div>
      </template>

      <pv-column field="crop_name" header="Crop" style="min-width:10rem" />
      <pv-column field="start_date" header="Planted Date" style="min-width:12rem" />
      <pv-column field="harvest_date" header="Harvest Date" style="min-width:12rem" />
      <pv-column field="phenological_phase" header="Phenological Phase" style="min-width:12rem" />
      <pv-column field="area_land" header="Planted Area (m²)" style="min-width:10rem" />

      <pv-column header="Actions" :exportable="false" style="min-width:12rem">
        <template #body="slotProps">
          <pv-button icon="pi pi-pencil" outlined rounded class="mr-2" @click="onEditItemEventHandler(slotProps.data)" />
          <pv-button icon="pi pi-trash" outlined rounded severity="danger" class="mr-2" @click="onDeleteItemEventHandler(slotProps.data)" />
          <pv-button icon="pi pi-eye" outlined rounded @click="viewSowing(slotProps.data.id)"/>
        </template>
      </pv-column>

      <template #empty>No records found.</template>
    </pv-data-table>
  </div>
</template>

<style scoped>
.position {
  padding-top: 1rem;
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