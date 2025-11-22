Mira, esta es una tabla que se utiliza de forma general para controls y products, sin embargo, quiero una tabla personalizada para ambos, que tengan un boton para eliminar aquel control o producto de esa tabla de forma de acuerdo:"

<script>
export default {
  name: "CustomTable",
  props: {
    headers: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  }
};
</script>

<template>
  <div>
    <table class="custom-table">
      <thead>
      <tr class="header">
        <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, rowIndex) in data" :key="rowIndex" class="custom-table-row">
        <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
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
</style>"