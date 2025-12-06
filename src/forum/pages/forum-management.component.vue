<script>
import {ForumApiService} from "../services/forum-api.service.js";
import {Question} from "../model/question.entity.js";
import UserQuestionList from "../components/user-question-list.component.vue";
import CommunityQuestionList from "../components/community-question-list.component.vue";
import QuestionItemCreateAndEditDialog from "../components/question-item-create-and-edit-dialog.component.vue";
import {CategoryApiService} from "../services/category-api.service.js";

export default {
  name: "forum-management",
  components: {QuestionItemCreateAndEditDialog, CommunityQuestionList, UserQuestionList},
  data() {
    return {
      questions: [],
      categories: [],
      profiles:[],
      question: {},
      selectedQuestion: {},
      filters: {},
      forumService: null,
      categoryService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      isLoading: false,
      activeTab: 0
    }
  },
  computed: {
    totalQuestions() {
      return this.questions.length;
    },
    myQuestions() {
      return this.questions.filter(q => q.authorId === 1).length;
    },
    categoriesCount() {
      return this.categories.length;
    }
  },
  methods: {
    findIndexById(id) {
      return this.questions.findIndex((question) => question.id === id);
    },
    createQuestion() {
      this.question.date = new Date();
      this.question.authorId = 1;
      this.question = Question.fromDisplayableQuestion(this.question);
      console.log(this.question);
      this.forumService.createQuestion(this.question)
          .then((response) => {
            let buildItemData = this.buildItemData(response.data);
            this.question = Question.toDisplayableQuestion(buildItemData);
            this.questions.push(this.question);
          });
    },
    updateQuestion() {
      let questionUpdate = {
        categoryId: this.question.categoryId,
        questionText: this.question.ask
      };
      this.forumService
          .updateQuestion(this.question.id, questionUpdate)
          .then((response) => {
            let buildItemData = this.buildItemData(response.data);
            console.log(buildItemData);
            let index = this.findIndexById(buildItemData.questionId);
            console.log(index);
            this.questions.splice(index, 1, Question.toDisplayableQuestion(buildItemData));
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
      this.question = {};
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },
    confirmDeleteQuestion(item){
      this.$confirm.require({
        message: `Are you sure you want to delete this Question?`,
        header: 'Delete Question',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'button-cancel',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        acceptClass: 'button-delete',
        accept: () => this.onDeleteItemEventHandler(item),
        reject: () => {}
      });
    },
    buildData() {
      console.log(this.questions);
      this.questions = this.questions.map((question) => {
        const category = this.categories.find((category) => category.categoryId === question.categoryId);
        const profile = this.profiles.find((profile) => profile.id === question.authorId);
        return {
          ...question,
          category: category?.name,
          userName: profile?.fullName
        };
      });
      console.log(this.questions);
    },
    buildItemData(data){
      const category = this.categories.find((category) => category.categoryId === data.categoryId);
      const profile = this.profiles.find((profile) => profile.id === data.authorId);
      data.category = category?.name;
      data.ask = data.questionText;
      data.userName = profile?.fullName;
      return data;
    },
    async getAllQuestions(){
      await this.forumService.getAllQuestions().then((response) =>{
        let questions = response.data;
        console.log(questions);
        this.questions = questions.map((question) => Question.toDisplayableQuestion(question));
      });
      return this.questions;
    },
    async getAllCategories(){
      await this.categoryService.getAllCategories().then((response) =>{
        this.categories = response.data;
      });
      return this.categories;
    },
    async getAllProfiles(){
      await this.forumService.getAllProfiles().then((response) =>{
        this.profiles = response.data;
        console.log(this.profiles);
      });
      return this.profiles;
    }
  },
  created() {
    this.isLoading = true;
    this.forumService = new ForumApiService();
    this.categoryService = new CategoryApiService();
    Promise.all([this.getAllCategories(), this.getAllQuestions(), this.getAllProfiles()])
        .then(() => {
          this.buildData();
          console.log('Todas las categorías y preguntas se han cargado');
        })
        .catch((error) => {
          console.error('Error cargando categorías o preguntas:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
  }
}
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>

  <div class="forum-page">
    <div class="content-wrapper">

      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <i class="pi pi-comments header-icon"></i>
            <div>
              <h1>Foro de Consultas</h1>
              <p>Conecta con la comunidad y comparte conocimiento</p>
            </div>
          </div>
          <pv-button
              label="Nueva Pregunta"
              icon="pi pi-plus"
              class="btn-new-question"
              @click="onNewItemEventHandler"
          />
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon total">
            <i class="pi pi-question-circle"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalQuestions }}</span>
            <span class="stat-label">Total de Preguntas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon my-questions">
            <i class="pi pi-user"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ myQuestions }}</span>
            <span class="stat-label">Mis Preguntas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon categories">
            <i class="pi pi-tags"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ categoriesCount }}</span>
            <span class="stat-label">Categorías</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <i class="pi pi-spin pi-spinner loading-icon"></i>
        <p>Cargando preguntas...</p>
      </div>

      <!-- Tabs Section -->
      <div v-else class="tabs-card">
        <pv-tab-view v-model:activeIndex="activeTab" class="custom-tabs">
          <pv-tab-panel>
            <template #header>
              <div class="tab-header">
                <i class="pi pi-globe"></i>
                <span>Comunidad</span>
              </div>
            </template>
            <community-question-list :data-source="questions"/>
          </pv-tab-panel>

          <pv-tab-panel>
            <template #header>
              <div class="tab-header">
                <i class="pi pi-user"></i>
                <span>Mis Preguntas</span>
              </div>
            </template>
            <user-question-list
                :data-source="questions"
                :on-edit-item-event-handler="onEditItemEventHandler"
                :confirm-delete-question="confirmDeleteQuestion"
            />
          </pv-tab-panel>
        </pv-tab-view>
      </div>
    </div>
  </div>

  <question-item-create-and-edit-dialog
      :entity="question"
      :visible="createAndEditDialogIsVisible"
      :categories="categories"
      entityName="Pregunta"
      :edit="isEdit"
      v-on:canceled="onCanceledEventHandler"
      v-on:saved="onSavedEventHandler($event)"
  />
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.forum-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
  padding-top: 80px;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 60px;
}

/* Header Section */
.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 32px 40px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  font-size: 48px;
  color: #10b981;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  padding: 20px;
  border-radius: 16px;
}

.header-left h1 {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.header-left p {
  font-size: 16px;
  color: #64748b;
}

.btn-new-question {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-new-question:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon.my-questions {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.categories {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  color: #64748b;
}

.loading-icon {
  font-size: 48px;
  color: #10b981;
  margin-bottom: 16px;
}

/* Tabs Card */
.tabs-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.custom-tabs :deep(.p-tabview-nav) {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  padding: 0 24px;
}

.custom-tabs :deep(.p-tabview-nav-link) {
  border: none;
  background: transparent;
  padding: 20px 32px;
  transition: all 0.3s ease;
}

.custom-tabs :deep(.p-tabview-nav-link:not(.p-disabled):focus) {
  box-shadow: none;
}

.custom-tabs :deep(.p-highlight .p-tabview-nav-link) {
  border-bottom: 3px solid #10b981;
  color: #10b981;
  background: white;
}

.custom-tabs :deep(.p-tabview-panels) {
  background: white;
  padding: 0;
}

.tab-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
}

.tab-header i {
  font-size: 18px;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 30px 40px;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 968px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .btn-new-question {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .content-wrapper {
    padding: 20px;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-icon {
    font-size: 36px;
    padding: 16px;
  }

  .header-left h1 {
    font-size: 24px;
  }

  .stat-value {
    font-size: 28px;
  }
}
</style>