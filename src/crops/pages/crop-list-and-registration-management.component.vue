<script>
import { SowingsApiService } from "../services/sowings-api.service.js";
import { Sowing } from "../models/sowing.entity.js";
import { CropsRecomendationApiService } from "../services/crops-recomendation-api.service.js";
import SowingItemCreateAndEditDialog from "../components/sowing-item-create-and-edit-dialog.component.vue";
import ChangePhaseDialog from "../components/change-phase-dialog.component.vue";
import { FilterMatchMode } from "primevue/api";

// -------- Helpers --------
function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.content)) return payload.content;
  return payload ? [payload] : [];
}
function resolveCropId(sowing) {
  if (typeof sowing?.crop_name === "object" && sowing.crop_name?.id) return sowing.crop_name.id;
  if (sowing?.crop_id) return sowing.crop_id;
  return null;
}
function resolveCropName(sowing) {
  if (typeof sowing?.crop_name === "object" && sowing.crop_name?.name) return sowing.crop_name.name;
  if (typeof sowing?.crop_name === "string") return sowing.crop_name;
  return "";
}

export default {
  name: "crop-list-and-registration-management",
  components: { SowingItemCreateAndEditDialog, ChangePhaseDialog },

  data() {
    return {
      sowings: [],
      sowing: {},
      selectedSowing: {},
      filters: {},
      sowingService: null,
      createAndEditDialogIsVisible: false,
      changePhaseDialogVisible: false,
      isEdit: false,
      submitted: false,
      selectedSowingId: null,
      historyService: null
    };
  },

  // Hook al mismo nivel que methods
  created() {
    console.log("Tabla creada");
    this.sowingService = new SowingsApiService();
    this.reloadData();
    this.initFilters();
  },

  methods: {
    async reloadData() {
      try {
        const response = await this.sowingService.getAllFalse();
        console.log("Raw sowings data:", response?.data);
        const rawList = toArray(response?.data);
        const processed = await Promise.all(rawList.map((s) => Sowing.toDisplayableSowing(s)));
        this.sowings = processed;
        console.log("Processed sowings data:", this.sowings);
      } catch (error) {
        console.error("Error fetching data:", error);
        this.sowings = [];
      }
    },

    initFilters() {
      this.filters = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } };
    },

    findIndexById(id) {
      return this.sowings.findIndex((sowing) => sowing.id === id);
    },

    onNewItemEventHandler() {
      this.sowing = { crop_name: "", area_land: 0 };
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

      this.sowing = { ...this.sowing, ...item };

      const cropName = (this.sowing?.crop_name || "").trim();
      if (!cropName) {
        console.warn("Crop name vacío");
        return;
      }

      if (!this.sowing.area_land || this.sowing.area_land <= 0) {
        this.sowing.area_land = 50;
      }

      if (item?.id && typeof item.id === "number") {
        this.updateSowing();
      } else {
        this.createSowing();
      }

      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },

    viewSowing(id) {
      this.selectedSowingId = id;
      console.log("Selected sowing id:", this.selectedSowingId);
      this.$router.push({ name: "crop-information", params: { id: this.selectedSowingId } });
    },

    async createSowing() {
      this.sowing.id = "";

      const today = new Date();
      this.sowing.start_date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
          .toISOString().split("T")[0];

      const harvest = new Date(today);
      harvest.setMonth(harvest.getMonth() + 4);
      this.sowing.harvest_date = new Date(harvest.getFullYear(), harvest.getMonth(), harvest.getDate())
          .toISOString().split("T")[0];

      this.sowing.user_id = 1;

      const ensureCropId = async () => {
        const currentId =
            (typeof this.sowing?.crop_name === "object" && this.sowing.crop_name?.id)
                ? this.sowing.crop_name.id
                : this.sowing?.crop_id;
        if (currentId) return currentId;

        const name =
            typeof this.sowing?.crop_name === "object"
                ? (this.sowing.crop_name?.name || "")
                : (this.sowing?.crop_name || "");
        if (!name.trim()) return null;

        const cropsApi = new CropsRecomendationApiService();
        const resp = await cropsApi.create({ name: name.trim(), description: "" });
        return resp?.data?.id ?? null;
      };

      try {
        const cropId = await ensureCropId();
        if (!cropId) { console.warn("No crop id or name"); return; }

        const sowingResource = {
          areaLand: Math.max(1, Number(this.sowing.area_land) || 50),
          cropId
        };

        const response = await this.sowingService.create(sowingResource);
        const created = await Sowing.toDisplayableSowing(response.data);
        this.sowings.push(created);
        this.reloadData();
      } catch (err) {
        console.error("Create error:", err);
      }
    },

    changePhenologicalPhase(sowing) {
      this.sowing = sowing;
      this.changePhaseDialogVisible = true;
    },

    async onPhaseChangeConfirmed() {
      const phaseValues = {
        Germination: 0,
        Seedling: 1,
        VegetativeGrowth: 2,
        Flowering: 3,
        HarvestReady: 4,
      };
      const phaseNames = ["Germination", "Seedling", "VegetativeGrowth", "Flowering", "HarvestReady"];

      let phaseValue = phaseValues[this.sowing.phenological_phase];
      if (phaseValue < 4) phaseValue++;
      this.sowing.phenological_phase = phaseNames[phaseValue];

      try {
        await this.sowingService.updatePhenologicalPhase(this.sowing.id, phaseValue);
        console.log("Sowing updated");
        this.reloadData();
      } catch (error) {
        console.error("Error updating sowing:", error);
      }

      this.changePhaseDialogVisible = false;

      if (this.sowing.phenological_phase === "HarvestReady") {
        this.historyService
            ?.addToHistory?.(this.sowing)
            ?.then(() => console.log("Sowing added to history"))
            ?.catch((error) => console.error("Error adding sowing to history:", error));
      }
    },

    onPhaseChangeCanceled() {
      this.changePhaseDialogVisible = false;
    },

    async updateSowing() {
      const name = (typeof this.sowing?.crop_name === "object"
          ? (this.sowing.crop_name?.name || "")
          : (this.sowing?.crop_name || "")).trim();
      const existingId = (typeof this.sowing?.crop_name === "object" && this.sowing.crop_name?.id)
          ? this.sowing.crop_name.id
          : this.sowing?.crop_id;

      const ensureCropId = async () => {
        if (existingId) return existingId;
        if (!name) return null;
        const cropsApi = new CropsRecomendationApiService();
        const resp = await cropsApi.create({ name, description: "" });
        return resp?.data?.id ?? null;
      };

      try {
        const cid = await ensureCropId();
        if (!cid) return console.warn("No crop id or name for update");

        const updateResource = {
          areaLand: Math.max(1, Number(this.sowing.area_land) || 50),
          cropId: cid
        };
        await this.sowingService.update(this.sowing.id, updateResource);
        this.reloadData();
      } catch (err) {
        console.error("Update error:", err);
      }
    },

    deleteSowing() {
      console.log("Deleting sowing with ID:", this.sowing.id);
      this.sowingService
          .delete(this.sowing.id)
          .then(() => {
            this.reloadData();
            this.sowing = {};
          })
          .catch((error) => {
            console.error("Error deleting sowing:", error);
          });
    },
  },
};
</script>

<template>
  <div>
    <h2>{{ $t("listCrops") }}</h2>
  </div>

  <div>
    <pv-data-table
        ref="dt"
        :value="sowings"
        v-model:selection="selectedSowing"
        dataKey="id"
        selectionMode="single"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
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

      <pv-column field="crop_name" header="Crop" style="min-width: 8rem" />
      <pv-column field="start_date" header="Planted Date" style="min-width: 15rem" />
      <pv-column field="harvest_date" header="Harvest Date" style="min-width: 15rem" />
      <pv-column field="phenological_phase" header="Phenological Phase" style="min-width: 12rem" />

      <pv-column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="slotProps">
          <pv-button
              icon="pi pi-exclamation-triangle"
              outlined
              rounded
              class="mr-2"
              @click="changePhenologicalPhase(slotProps.data)"
          />
          <pv-button icon="pi pi-pencil" outlined rounded class="mr-2" @click="onEditItemEventHandler(slotProps.data)" />
          <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="onDeleteItemEventHandler(slotProps.data)" />
          <pv-button icon="pi pi-eye" outlined rounded class="mr-2" @click="viewSowing(slotProps.data.id)" />
        </template>
      </pv-column>
    </pv-data-table>
  </div>

  <change-phase-dialog
      :visible.sync="changePhaseDialogVisible"
      @canceled="onPhaseChangeCanceled"
      @confirmed="onPhaseChangeConfirmed"
  />

  <sowing-item-create-and-edit-dialog
      :entity="sowing"
      v-model:visible="createAndEditDialogIsVisible"
      entityName="Sowing"
      :edit="isEdit"
      @canceled="onCanceledEventHandler"
      @saved="onSavedEventHandler"
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