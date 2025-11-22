<script>
import {ForumApiService} from "../services/forum-api.service.js";
import {Answer} from "../model/answer.entity.js";
import {FilterMatchMode} from "primevue/api";
import AnswerItemCreateDialog from "./answer-item-create-dialog.component.vue";
import SowingItemCreateAndEditDialog from "../../crops/components/sowing-item-create-and-edit-dialog.component.vue";



export default {
  name: "answer-list",
  components: {SowingItemCreateAndEditDialog, AnswerItemCreateDialog},
  props:{
    question: Object,
    isCommunityAnswers: Boolean
  },
  data(){
    return{
      answers: [],
      answer: {},
      filters: {},
      forumService: null,
      headerContent: '',
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },
  methods: {
    findIndexById(id) {
      return this.answers.findIndex((answer) => answer.id === id);
    },
    initFilters() {
      this.filters = {global: {value: null, matchMode: FilterMatchMode.CONTAINS}};
    },
    createAnswer() {
      this.answer.questionId = this.question.id;
      this.answer.userName = 'Roberto Juarez';
      this.answer = Answer.fromDisplayableAnswer(this.answer);
      console.log(this.answer);
      this.forumService.createAnswer(this.answer)
          .then((response) => {
            this.answer = Answer.toDisplayableAnswer(response.data);
            this.answers.push(this.answer);
          });
    },
    onNewItemEventHandler() {
      this.answer = {};
      this.submitted = false;
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    onCanceledEventHandler() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSavedEventHandler(item) {
      this.submitted = true;
      if (this.answer.content.trim()) {
        if (item.id) {
          this.updateSowing();
        } else {
          this.createAnswer();
        }
      }
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },
    buildHeaderContent() {
      this.headerContent = this.question.ask + ' --- ' + this.question.userName + ' --- ' + this.question.date;
    },
    getAnswers() {
      this.forumService.getAnswerByQuestionId(this.question.id)
          .then((response) => {
            let answers = response.data;
            this.answers = answers.map((answer) => Answer.toDisplayableAnswer(answer));
          });
    },
  },
  created() {
    this.forumService = new ForumApiService();
    this.initFilters();
    this.buildHeaderContent();
    this.getAnswers();

  }
}
</script>

<template>
  <div>
    <pv-data-table
        ref="dt"
        :value="answers"
        dataKey="id" selectionMode="single"
        :paginator="true"
        :rows="3"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[3,6,9]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
      <template #header v-if="isCommunityAnswers">

        <pv-button label="Add Answer" icon="pi pi-plus"  class="mr-2 button-brown" @click="onNewItemEventHandler" />
      </template>
      <pv-column field="userName" :header="headerContent" >
        <template #body="content">
          <h5>{{content.data.userName}}</h5>
          <p>{{content.data.content}}</p>
        </template>
      </pv-column>

    </pv-data-table>
  </div>

  <answer-item-create-dialog
      :entity="answer"
      :visible="createAndEditDialogIsVisible"
      entityName="Answer"
      :edit="isEdit"
      v-on:canceled="onCanceledEventHandler"
      v-on:saved="onSavedEventHandler($event)"
  />
</template>

<style scoped>

</style>