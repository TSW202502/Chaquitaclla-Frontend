<script>

export default {
  name: "toolbar-content",
  data() {
    return {
      items: [
        { label: 'Statistical Reports', to: '/sowing-statistics-reports' },
        { label: 'Crop Registration', to: '/crop-list-and-registration' },
        { label: 'Consultation forum', to: '/consultation-forum' },
        { label: 'Crop History', to: '/crop-history' }
      ],
      recommendedCrop: null
    }
  },
  created() {

  }
}
</script>

<template>
  <div class="main-container">
    <div class="left-container">
      <pv-card class="justify-content-center mt-2">
        <template #content>
          <i class="pi pi-chart-bar icon-large"></i>
        </template>
        <template #footer>
          <router-link :to="items[0].to"  rel="noopener">
            <pv-button class="button-green" :label="items[0].label" />
          </router-link>
        </template>
      </pv-card>

      <pv-card class="justify-content-center mt-2">
        <template #content>
          <i class="pi pi-clipboard icon-large"></i>
        </template>
        <template #footer>
          <router-link :to="items[1].to"  rel="noopener">
            <pv-button class="button-green" :label="items[1].label" />
          </router-link>
        </template>
      </pv-card>

      <pv-card class="justify-content-center mt-2">
        <template #content>
          <i class="pi pi-comments icon-large"></i>
        </template>
        <template #footer>
          <router-link :to="items[2].to"  rel="noopener">
            <pv-button class="button-green" :label="items[2].label" />
          </router-link>
        </template>
      </pv-card>

      <pv-card class="justify-content-center mt-2">
        <template #content>
          <i class="pi pi-history icon-large"></i>
        </template>
        <template #footer>
          <router-link :to="items[3].to"  rel="noopener">
            <pv-button class="button-green" :label="items[3].label" />
          </router-link>
        </template>
      </pv-card>


    </div>

    <div class="right-container">
      <pv-card class="card-crop-control">
        <template #content>
          <h2>{{$t('seasonCropRecommendation')}}</h2>
          <h3>{{ recommendedCrop?.name }}</h3>
          <img :src="recommendedCrop?.image" alt="Crop image" class="fixed-size-image">
          <p>{{ recommendedCrop?.description }}</p>
        </template>
      </pv-card>
    </div>
  </div>

</template>

<style scoped>
.main-container {
  display: flex;
  margin-top:8em;
}

.left-container,
.right-container {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.icon-large {
  font-size: 8em;
  color: black;
  margin-bottom: 0.1em;
}

.button-green {
  background-color: var(--primary-main-green);
  color: white;
}
.fixed-size-image {
  width: 300px;
  height: 300px;
  border-radius:25px;
}
.card-crop-control{
  background-color: var(--primary-main-green);
  color: #ffffff;
  border-radius: 25px;
}

</style>