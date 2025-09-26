<script>
export default {
  name: 'GeneralInformation',
  data() {
    return {
      rows: [
        ['Crop Name', 'Rice'],
        ['Date Created', '19/02/2024'],
        ['Planted Area (m2)', '100']
      ]
    };
  }
};
</script>

<template>
  <div class="container">
    <div class="image-container">
      <img src="../assets/rice.png" alt="Image" />
    </div>
    <div class="labels-container">
      <div class="row" v-for="(row, index) in rows" :key="index">
        <div class="column" v-for="(label, columnIndex) in row" :key="columnIndex"
             :class="{ 'grey-label': columnIndex % 2 === 0, 'green-label': columnIndex % 2 !== 0 }">
          {{ label }}
        </div>
        <!-- Add a separator between rows -->
        <div class="separator" v-if="index < rows.length - 1"></div>
      </div>
    </div>
  </div>
  <div class="description">
    <p>
      Rice (Oryza sativa) is an annual herbaceous crop that
      requires well-drained soils and abundant water for growth.
      It is grown in a variety of climatic conditions and its growth
      cycle includes stages such as germination, flowering and grain maturation.
      The mature grains are harvested and can be processed into refined white
      rice or brown rice. It is an important staple food worldwide.
    </p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  margin-bottom: 50px;
}

.image-container {
  flex: 1;
  margin-right: 50px;
}

.labels-container {
  flex: 1;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 50px;
  display: flex;
  flex-direction: column;

}

.row {
  display: flex;
  margin-bottom: 10px;
}

.column {
  flex: 1;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
}

.grey-label {
  background-color: #D9D9D9;
  color: black;
}

.green-label {
  background-color: #005f40;
  color: white;
}
.description{
  background-color: #005f40;
  color: white;
  padding: 10px 20px;
  text-align: center;
  border-radius: 5px;
}

</style>