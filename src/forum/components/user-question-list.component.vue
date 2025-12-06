<script>
import {FilterMatchMode} from "primevue/api";
import AnswerList from "./answer-list.component.vue";

export default {
  name: "user-question-list",
  components: {AnswerList},
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
    },
    formatDate(value) {
      return new Date(value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
  },
  created() {
    this.initFilters();
  }
}
</script>

<template>
  <div v-if="!isQuestionSelected" class="questions-container">
    <!-- Search Bar -->
    <div class="table-header">
      <div class="search-container">
        <i class="pi pi-search search-icon"></i>
        <pv-input-text
            v-model="filters['global'].value"
            placeholder="Buscar en mis preguntas..."
            class="search-input"
        />
      </div>
      <div class="results-info">
        <span class="results-count">{{ dataSource.length }}</span>
        <span class="results-label">preguntas tuyas</span>
      </div>
    </div>

    <!-- Data Table -->
    <pv-data-table
        ref="dt"
        :value="dataSource"
        v-model:selection="selectedQuestion"
        dataKey="id"
        selectionMode="single"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        :rowsPerPageOptions="[5,10,25]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
        class="custom-datatable"
    >
      <!-- Question Column -->
      <pv-column field="ask" header="Pregunta" style="min-width:20rem">
        <template #body="slotProps">
          <div class="question-cell">
            <i class="pi pi-comment question-icon"></i>
            <span class="question-text">{{ slotProps.data.ask }}</span>
          </div>
        </template>
      </pv-column>

      <!-- Category Column -->
      <pv-column field="category" header="Categoría" style="min-width:12rem">
        <template #body="slotProps">
          <div class="category-badge">
            <i class="pi pi-tag"></i>
            <span>{{ slotProps.data.category }}</span>
          </div>
        </template>
      </pv-column>

      <!-- Date Column -->
      <pv-column field="date" header="Fecha" style="min-width:12rem">
        <template #body="slotProps">
          <div class="date-cell">
            <i class="pi pi-calendar date-icon"></i>
            <span>{{ formatDate(slotProps.data.date) }}</span>
          </div>
        </template>
      </pv-column>

      <!-- Actions Column -->
      <pv-column header="Acciones" :exportable="false" style="min-width:14rem">
        <template #body="slotProps">
          <div class="actions-group">
            <pv-button
                icon="pi pi-comments"
                class="btn-action btn-view"
                v-tooltip.top="'Ver respuestas'"
                @click="rowClick($event, slotProps.data)"
            />
            <pv-button
                icon="pi pi-pencil"
                class="btn-action btn-edit"
                v-tooltip.top="'Editar'"
                @click="onEditItemEventHandler(slotProps.data)"
            />
            <pv-button
                icon="pi pi-trash"
                class="btn-action btn-delete"
                v-tooltip.top="'Eliminar'"
                @click="confirmDeleteQuestion(slotProps.data)"
            />
          </div>
        </template>
      </pv-column>

      <!-- Empty State -->
      <template #empty>
        <div class="empty-state">
          <i class="pi pi-inbox empty-icon"></i>
          <h3>No has hecho preguntas aún</h3>
          <p>Crea tu primera pregunta para conectar con la comunidad</p>
        </div>
      </template>
    </pv-data-table>
  </div>

  <div v-if="isQuestionSelected" class="answer-view">
    <div class="back-button-container">
      <pv-button
          label="Volver a Mis Preguntas"
          icon="pi pi-arrow-left"
          class="btn-back"
          @click="returnQuestionsTable()"
      />
    </div>
    <answer-list :question="selectedQuestion" :is-community-answers="false"/>
  </div>
</template>

<style scoped>
.questions-container {
  padding: 24px 32px;
}

/* Search Bar */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f1f5f9;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 18px;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  outline: none;
}

.results-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.results-count {
  font-size: 24px;
  font-weight: 700;
  color: #10b981;
}

.results-label {
  font-size: 14px;
  color: #64748b;
}

/* Data Table */
.custom-datatable :deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #0f172a;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px;
  border: none;
  border-bottom: 2px solid #e2e8f0;
}

.custom-datatable :deep(.p-datatable-tbody > tr) {
  transition: all 0.2s ease;
}

.custom-datatable :deep(.p-datatable-tbody > tr:hover) {
  background: #f0fdf4;
}

.custom-datatable :deep(.p-datatable-tbody > tr > td) {
  padding: 16px;
  border: none;
  border-bottom: 1px solid #f1f5f9;
}

/* Cell Styles */
.question-cell {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.question-icon {
  font-size: 20px;
  color: #10b981;
  margin-top: 2px;
  flex-shrink: 0;
}

.question-text {
  font-weight: 500;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.5;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.category-badge i {
  font-size: 12px;
}

.date-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.date-icon {
  font-size: 16px;
  color: #94a3b8;
}

/* Actions Group */
.actions-group {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  padding: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action i {
  font-size: 16px;
}

.btn-view {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-view:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-edit {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  color: #cbd5e1;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 16px;
  color: #64748b;
}

/* Answer View */
.answer-view {
  padding: 24px 32px;
}

.back-button-container {
  margin-bottom: 24px;
}

.btn-back {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: none;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
}

/* Paginator */
.custom-datatable :deep(.p-paginator) {
  background: #f8fafc;
  border: none;
  border-top: 2px solid #e2e8f0;
  padding: 16px 24px;
}

.custom-datatable :deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

/* Responsive */
@media (max-width: 968px) {
  .questions-container {
    padding: 16px;
  }

  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .search-container {
    max-width: 100%;
  }

  .actions-group {
    flex-direction: column;
  }
}
</style>