<script>
import ProductCreateAndEditDialog from "./product-create-and-edit-dialog.component.vue";
import { ProductsApiService } from '../services/products-api.service.js';

export default {
  name: "ProductsUsed",
  components: {ProductCreateAndEditDialog},
  props: {
    sowingId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      products: [],
      tableHeaders: ['Date', 'Type', 'Name', 'Quantity', 'Actions'],
      productDialogVisible: false,
      newProduct: {date: '', type: '', name: '', quantity: '', sowingId: ''}
    };
  },
  methods: {
    onNewProductEventHandler() {
      let date = new Date();
      let formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
      this.newProduct.date = formattedDate;
      this.newProduct.sowingId = this.sowingId;
      this.productDialogVisible = true;
    },
    onProductSaved(product) {
      this.products.push(product);
      this.productDialogVisible = false;
    },
    onProductCanceled() {
      this.productDialogVisible = false;
    },
    onDelete(index) {
      this.products.splice(index, 1);
    }
  },
  created() {
    const productsAPI = new ProductsApiService();
    productsAPI.getAll()
        .then(response => {
          this.products = response.data.filter(product => product.sowing_id === this.sowingId);
        })
        .catch(e => {
          console.log(e);
        });
  },
  computed: {
    tableData() {
      return this.products.map(product => [product.date, product.type, product.name, product.quantity]);
    }
  }
};
</script>

<template>
  <div>
    <pv-button label="Add Product" icon="pi pi-plus" severity="success" class="mr-2 button-brown add-product-button" @click="onNewProductEventHandler" />
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
    <product-create-and-edit-dialog :entity="newProduct" :visible="productDialogVisible" entityName="Product" :edit="false" @saved="onProductSaved" @canceled="onProductCanceled" />
  </div>
</template>

<style scoped>
.add-product-button {
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