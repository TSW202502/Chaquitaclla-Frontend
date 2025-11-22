<template>
  <div class="main-container p-mt-md-5 p-mt-sm-2">
    <h1>{{$t('consultationForum')}}</h1>
    <pv-button class="pv-button " label="Ask your colleagues!" @click="openNewQuery" />
    <new-consultation-component :visible="showNewQuery" @close="closeDialog" @cancel="closeDialog" @new-query="addNewQuery" />
    <pv-data-table class="pv-data-table" :class="{ 'dialog-open': showNewQuery }" :value="questions">
      <pv-column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header"></pv-column>
    </pv-data-table>
  </div>
</template>



<script>
import { ref } from 'vue';
import { ForumApiService } from '../services/forum-api.service.js';
import NewConsultationComponent from "../components/new-consultation.component.vue";

export default {
  name: 'my-queries',
  components: {
    NewConsultationComponent,
  },
  setup() {
    const showNewQuery = ref(false);
    const questions = ref([]);

    const forumApiService = new ForumApiService();

    forumApiService.getQuestions().then((response) => {
      questions.value = response.data;
      console.log(questions.value);
    });

    const openNewQuery = () => {
      showNewQuery.value = true;
    };

    const columns = [
      { field: 'userName', header: 'User Name' },
      { field: 'ask', header: 'Question' },
      { field: 'category', header: 'Category' },
      { field: 'date', header: 'Date' },
    ];


    const addNewQuery = (newQuery) => {
      questions.value.push(newQuery);
    };
    const closeDialog = () => {
      showNewQuery.value = false;
    };

    return {
      showNewQuery,
      questions,
      openNewQuery,
      columns,
      addNewQuery,
      closeDialog
    };
  },
};
</script>

<style scoped>
.main-container {
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  color: #343a40;
  padding: 80px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  width: 90%;
}

h1 {
  font-size: 1.5em;
  color: #6c757d;
}

.pv-button {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
}


.pv-button:hover {
  background-color: #0069d9;
  color: white;
}

.pv-data-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.pv-data-table th, .pv-data-table td {
  border: 1px solid #dee2e6;
  padding: 8px;
}

.pv-data-table th {
  background-color: #f8bd00;
  color: #495057;
}

.pv-data-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.pv-data-table tr:nth-child(odd) {
  background-color: #f8bd00;
}

.pv-data-table tr:hover {
  background-color: #d1e8ff;
}
</style>