<script>
import ControlCreateAndEditDialog from "./control-create-and-edit-dialog.component.vue";
import { SowingsApiService } from '../services/sowings-api.service.js';

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
      newControl: {date: '', leave: '', stem: '', soil: '', sowingId: ''}
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
      this.tableData.push([control.date, control.leave, control.stem, control.soil]);
      const sowingsAPI = new SowingsApiService();
      sowingsAPI.getAll().then(response => {
        const sowings = response.data;
        const selectedSowing = sowings.find(sowing => Number(sowing.id) === Number(this.sowingId));
        if (selectedSowing) {
          selectedSowing.controls.push(control);
          sowingsAPI.update(selectedSowing).then(updatedSowing => {
          });
        }
      });
      this.controlDialogVisible = false;
    },
    onControlCanceled() {
      this.controlDialogVisible = false;
    },
    onDelete(index) {
      this.tableData.splice(index, 1);
    }
  },
  created() {
    const sowingsAPI = new SowingsApiService();
    sowingsAPI.getAll().then(response => {
      const sowings = response.data;
      const selectedSowing = sowings.find(sowing => Number(sowing.id) === Number(this.sowingId));
      if (selectedSowing && selectedSowing.controls) {
        this.tableData = selectedSowing.controls.map(control => [control.date, control.leave, control.stem, control.soil]);
      }
    });
  }
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
        <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
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