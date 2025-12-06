<script>
import ControlCreateAndEditDialog from "./control-create-and-edit-dialog.component.vue";
import {ControlsApiService} from "../services/controls-api-service.js";
export default {
  name: 'Controls',
  components: {ControlCreateAndEditDialog},
  props: ['sowingId'],
  data() {
    return {
      date: null,
      tableHeaders: ['Date', 'Leave', 'Stem', 'Soil', 'Actions'],
      tableData: [],
      controlDialogVisible: false,
      newControl: {date: '', sowingCondition: '', stemCondition: '', soilMoisture: '', sowingId: ''},
      conditions: ['Dry', 'Moist', 'Normal'],
    };
  },
  methods: {
    onNewControlEventHandler() {
      let date = new Date();
      let formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
      this.newControl.date = formattedDate;
      this.newControl.sowingId = this.sowingId;
      this.controlDialogVisible = true;
    },
    onControlSaved(control) {
      const controlsAPI = new ControlsApiService();
      controlsAPI.createControl(this.sowingId, control).then(response => {
        const createdControl = response.data;
        this.tableData.push({
          id: createdControl.id,
          date: createdControl.date,
          sowingCondition: createdControl.sowingCondition,
          stemCondition: createdControl.stemCondition,
          soilMoisture: createdControl.soilMoisture
        });
      }).catch(error => {
        console.log(error.config);
      });
      this.controlDialogVisible = false;
    },
    onControlCanceled() {
      this.controlDialogVisible = false;
    },
    onDelete(index) {
      const controlToDelete = this.tableData[index];
      const controlsAPI = new ControlsApiService();
      controlsAPI.deleteControl(this.sowingId, controlToDelete.id).then(() => {
        this.tableData = this.tableData.filter((control, controlIndex) => {
          return controlIndex !== index;
        });
      }).catch(error => {
        console.log(error.config);
      });
    }
  },
  created() {
    const controlsAPI = new ControlsApiService();
    controlsAPI.getAllControlsBySowingId(this.sowingId).then(response => {
      const controls = response.data;
      if (controls.length) {
        this.tableData = controls.map(control => {
          return {
            id: control.id,
            date: control.date,
            sowingCondition: control.sowingCondition,
            stemCondition: control.stemCondition,
            soilMoisture: control.soilMoisture
          };
        });
      }
    });
  },
};
</script>

<template>
  <div>
    <pv-button label="Add Control" icon="pi pi-plus" severity="success" class="mr-2 button-brown add-control-button" @click="onNewControlEventHandler" />
    <table class="custom-table">
      <thead>
      <tr class="header">
        <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, rowIndex) in tableData" :key="rowIndex" class="custom-table-row">
        <td>{{ row.date }}</td>
        <td>{{ row.sowingCondition }}</td>
        <td>{{ row.stemCondition }}</td>
        <td>{{ row.soilMoisture }}</td>
        <td>
          <pv-button icon="pi pi-trash" outlined rounded severity="danger"  @click="onDelete(rowIndex)"></pv-button>
        </td>
      </tr>
      </tbody>
    </table>
    <control-create-and-edit-dialog :entity="newControl" :visible="controlDialogVisible" entityName="Control" :edit="false" @saved="onControlSaved" @canceled="onControlCanceled" />
  </div>
</template>

<style scoped>
.add-control-button {
  margin-bottom: 20px;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.header {
  background-color: #005f40;
  color: white;;
}

.custom-table th,
.custom-table td {
  padding: 10px;
  text-align: left;
}

.custom-table tbody tr {
  background-color: #f0f0f0;
  border-radius: 10px;
}

.custom-table-row:not(:last-child) {
  margin-bottom: 10px;
}

</style>