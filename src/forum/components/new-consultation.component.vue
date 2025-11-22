<template>
  <pv-dialog class="pv-dialog" :visible="visible" @hide="onHide">
    <template #header>
      <h2>{{$t('newConsultation')}}</h2>
    </template>
    <pv-input-text class="pv-input-text" v-model="newQuery.userName" placeholder="User Name" />
    <pv-input-text class="pv-input-text" v-model="newQuery.ask" placeholder="Question" />
    <pv-input-text class="pv-input-text" v-model="newQuery.category" placeholder="Category" />
    <pv-calendar v-model="newQuery.date" :showIcon="true" />
    <template #footer>
      <pv-button class="pv-button" label="Submit" @click="submitQuery" />
      <pv-button class="pv-button" label="Cancel" @click="onCancel" />
    </template>
  </pv-dialog>
</template>


<script>
import { ref } from 'vue';
import { ForumApiService } from '../services/forum-api.service.js';

export default {
  name: 'new-consultation',
  props: ['visible'],
  setup(props, { emit }) {
    const newQuery = ref({
      userName: '',
      ask: '',
      category: '',
      date: new Date(),
    });

    const forumApiService = new ForumApiService();

    const submitQuery = () => {
      forumApiService.addQuestion(newQuery.value).then(() => {
        emit('new-query', newQuery.value);
        newQuery.value = {
          userName: '',
          ask: '',
          category: '',
          date: new Date(),
        };
        emit('close');
      });
    };

    const onHide = () => {
      emit('close');
    };
    const onCancel = () => {
      emit('cancel');
    };

    return {
      newQuery,
      submitQuery,
      onHide,
      onCancel,
    };
  },
};
</script>


<style scoped>

::v-deep .pv-dialog {
  background-color: #343a40;
  color: #f8f9fa;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border: 2px solid #007bff;
  opacity: 1;
}

.pv-dialog .pv-input-text {
  background-color: #495057;
  color: #f8f9fa;
  border: none;
}

.pv-dialog .pv-button {
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

.pv-dialog .pv-button:hover {
  background-color: #0069d9;
  color: white;
}
</style>