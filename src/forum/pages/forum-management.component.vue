<script>
import {ForumApiService} from "../services/forum-api.service.js";
import {Question} from "../model/question.entity.js";
import UserQuestionList from "../components/user-question-list.component.vue";
import CommunityQuestionList from "../components/community-question-list.component.vue";
import QuestionItemCreateAndEditDialog from "../components/question-item-create-and-edit-dialog.component.vue";
import SowingItemCreateAndEditDialog from "../../crops/components/sowing-item-create-and-edit-dialog.component.vue";



export default {
  name: "forum-management",
  components: {SowingItemCreateAndEditDialog, QuestionItemCreateAndEditDialog, CommunityQuestionList, UserQuestionList},
  data() {
    return {
      questions: [],
      question: {},
      selectedQuestion: {},
      filters: {},
      forumService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },
  methods: {
    findIndexById(id) {
      return this.questions.findIndex((question) => question.id === id);
    },
    createQuestion() {
      this.question.userName = "Roberto Juarez";
      this.question.date = new Date();
      this.question = Question.fromDisplayableQuestion(this.question);
      console.log(this.question);
      this.forumService.createQuestion(this.question)
          .then((response) => {
            this.question = Question.toDisplayableQuestion(response.data);
            this.questions.push(this.question);
          });
    },

    updateQuestion() {
      this.question = Question.fromDisplayableQuestion(this.question);
      this.forumService
          .updateQuestion(this.question.id, this.question)
          .then((response) => {
            this.questions[this.findIndexById(response.data.id)] =
                Question.toDisplayableQuestion(response.data);
          });
    },

    deleteQuestion() {
      console.log('Deleting question with ID:', this.question.id);

      this.forumService.deleteQuestion(this.question.id)
          .then(() => {
            this.questions = this.questions.filter((s) => s.id !== this.question.id);
            this.question = {};
          })
          .catch((error) => {
            console.error('Error deleting question:', error);
          });
    },

    onNewItemEventHandler() {
      this.question = {};
      this.submitted = false;
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    onEditItemEventHandler(item) {
      this.question = item;
      this.submitted = false;
      this.isEdit = true;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItemEventHandler(item) {
      this.question = item;
      this.deleteQuestion();
    },

    onCanceledEventHandler() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSavedEventHandler(item) {
      this.submitted = true;
      if (this.question.ask.trim()) {
        if (item.id) {
          this.updateQuestion();
        } else {
          this.createQuestion();
        }
      }
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },
    confirmDeleteQuestion(item){
      this.$confirm.require({
        message:          `Are you sure you want to delete this Question?`,
        header:           'Delete Question',
        icon:             'pi pi-exclamation-triangle',
        rejectClass:      'button-cancel',
        rejectLabel:      'Cancel',
        acceptLabel:      'Delete',
        acceptClass:      'button-delete',
        accept:           () => this.onDeleteItemEventHandler(item),
        reject:           () => {}
      });
    },
    getAllQuestions(){
      this.forumService.getAllQuestions().then((response) =>{
        console.log(response.data);
        let questions = response.data;
        this.questions = questions.map((question) => Question.toDisplayableQuestion(question));
      })
    }
  },


  created() {
    this.forumService = new ForumApiService();
    this.getAllQuestions();
  }
}
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div>
    <h2 style="color:black;">{{$t('consultationForum')}}</h2>
    <pv-button class="pv-button button-brown" label="Ask your colleagues!" @click="onNewItemEventHandler" />
    <pv-tab-view>
      <pv-tab-panel header="Community">
        <community-question-list :data-source="questions"/>
      </pv-tab-panel>
      <pv-tab-panel header="My Questions">
        <user-question-list
            :data-source="questions"
            :on-edit-item-event-handler="onEditItemEventHandler"
            :confirm-delete-question="confirmDeleteQuestion"
        />
      </pv-tab-panel>

    </pv-tab-view>
  </div>

  <question-item-create-and-edit-dialog
      :entity="question"
      :visible="createAndEditDialogIsVisible"
      entityName="Question"
      :edit="isEdit"
      v-on:canceled="onCanceledEventHandler"
      v-on:saved="onSavedEventHandler($event)"
  />
</template>


<style scoped>

</style>