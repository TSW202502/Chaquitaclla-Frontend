<script>
import {FilterMatchMode} from "primevue/api";
import AnswerList from "./answer-list.component.vue";
import QuestionItemCreateAndEditDialog from "./question-item-create-and-edit-dialog.component.vue";

export default {
  name: "user-question-list",
  components: {QuestionItemCreateAndEditDialog, AnswerList},
  props:{
    dataSource: Array,
    onEditItemEventHandler: Function,
    confirmDeleteQuestion: Function
  },
  data(){
    return{
      filters:{},
      selectedQuestion: Object,
      isQuestionSelected: false
    }
  },
  methods:{
    initFilters() {
      this.filters = {global: {value: null, matchMode: FilterMatchMode.CONTAINS}};
    },
    rowClick(event, rowData) {
      this.selectedQuestion = rowData;
      console.log(this.selectedQuestion);
      this.isQuestionSelected = true;
    },
    returnQuestionsTable(){
      this.isQuestionSelected = false;
    }
  },
  created() {
    this.initFilters();
  }

}
</script>

<template>
  <div v-if="!isQuestionSelected">
    <pv-data-table
        ref="dt"
        :value="dataSource"
        v-model:selection="selectedQuestion"
        dataKey="id" selectionMode="single"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5,10,25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
      <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
          <pv-icon-field iconPosition="left">
            <pv-input-icon>
              <i class="pi pi-search" />
            </pv-input-icon>
            <pv-input-text v-model="filters['global'].value" placeholder="Search..." />
          </pv-icon-field>
          </div>
      </template>
      <pv-column field="ask" header="Ask" ></pv-column>
      <pv-column field="category" header="Category" ></pv-column>
      <pv-column field="date" header="Date" ></pv-column>

      <pv-column header="Actions" :exportable="false" style="min-width:8rem">
        <template #body="slotProps">
          <pv-button icon="pi pi-pencil" outlined rounded class="mr-2" @click="onEditItemEventHandler(slotProps.data)" />
          <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteQuestion(slotProps.data)" />
          <pv-button icon="pi pi-comments" outlined rounded class="mr-2" @click="rowClick($event,slotProps.data)"/>
        </template>
      </pv-column>
    </pv-data-table>
  </div>

  <div v-if="isQuestionSelected" class="position-relative">
    <div class="position-absolute top-0 start-0 mt-2 ms-2">
      <pv-button class=" button-green" label="Back" @click="returnQuestionsTable()"/>
    </div>
    <answer-list :question="selectedQuestion" :is-community-answers="false"/>
  </div>
</template>

<style scoped>

</style>