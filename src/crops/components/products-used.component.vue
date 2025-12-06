<script>
import ProductCreateAndEditDialog from "./product-create-and-edit-dialog.component.vue";
import { ProductsApiService } from '../services/products-api.service.js';
import moment from "moment";

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
      newProduct: {date: '', type: '', name: '', quantity: '', sowingId: ''},
      productsAvailable:[]
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
      console.log(product);
      const productsAPI = new ProductsApiService();
      const existingProduct = this.productsAvailable.find(p => p.name === product.name);

      if (!existingProduct) {
        const newProduct = {
          name: product.name,
          type: product.type
        };

        productsAPI.postProduct(newProduct)
            .then(response => {
              console.log(response.data);
              const productId = response.data.id;
              product.productId = productId;
              newProduct.id = productId;
              this.productsAvailable.push(newProduct);

              const productToSend = {
                sowingId: product.sowingId,
                productId: product.productId,
                quantity: parseInt(product.quantity)
              };

              console.log(productToSend);

              productsAPI.addProduct(this.sowingId, productToSend)
                  .then(response => {
                    console.log(response.data);
                    const productId = response.data.id;

                    console.log(productId);

                    productsAPI.getProductBySowingInfo(this.sowingId, productId)
                        .then(response => {
                          console.log(response.data);
                          const date = response.data.date;
                          const quantity = response.data.quantity;

                          // Format the date using moment
                          const formattedDate = moment(date).format('YYYY-MM-DD');

                          const newProduct = {
                            sowingId: product.sowingId,
                            productId: productId,
                            type: product.type,
                            name: product.name,
                            date: formattedDate,
                            quantity: quantity
                          };

                          this.products.push(newProduct);
                          this.productDialogVisible = false;
                        })
                        .catch(e => {
                          console.log(e);
                        });
                  })
                  .catch(e => {
                    console.log(e);
                  });
            })
            .catch(e => {
              console.log(e);
            });
      }
    },
    onProductCanceled() {
      this.productDialogVisible = false;
    },
    onDelete(index) {
      const productService = new ProductsApiService();
      console.log(index);
      console.log(this.productsAvailable);
      console.log(this.sowingId, this.productsAvailable[index].id );
      productService.deleteProductBySowing(this.sowingId, this.productsAvailable[index].id)
          .then(response => {
            console.log(response.data);
            // Remove the product from the products and productsAvailable arrays
            this.products.splice(index, 1);
            this.productsAvailable.splice(index, 1);
          })
          .catch(e => {
            console.log(e);
          });
    }
  },
  created() {
    const productsAPI = new ProductsApiService();
    productsAPI.getProductsBySowingId(this.sowingId)
        .then(response => {
          console.log(response.data);
          const products = response.data;
          this.productsAvailable = products;

          // For each product, call getProductBySowingInfo to get the date and quantity
          products.forEach(product => {
            productsAPI.getProductBySowingInfo(this.sowingId, product.id)
                .then(response => {
                  console.log(response.data);
                  const date = response.data.date;
                  const quantity = response.data.quantity;
                  const formattedDate = moment(date).format('YYYY-MM-DD');

                  // Create a new object with the required properties
                  const newProduct = {
                    sowingId: product.sowingId,
                    productId: product.id,
                    type: product.type,
                    name: product.name,
                    date: formattedDate,
                    quantity: quantity
                  };

                  this.products.push(newProduct);
                })
                .catch(e => {
                  console.log(e);
                });
          });
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