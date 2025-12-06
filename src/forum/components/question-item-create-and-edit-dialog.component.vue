<script>
export default {
  name: "question-item-create-and-edit-dialog",
  props: {
    entity: null,
    visible: Boolean,
    entityName: String,
    edit: Boolean,
    categories: Array
  },
  methods: {
    onSave() {
      this.$emit('saved', this.entity);
    },
    onCancel() {
      this.$emit('canceled');
    },
    getHeaderTitle() {
      return this.edit ? 'Editar Pregunta' : 'Nueva Pregunta';
    },
    getSubmitLabel() {
      return this.edit ? 'Actualizar' : 'Publicar';
    }
  }
}
</script>

<template>
  <pv-dialog
      v-bind:visible="visible"
      :modal="true"
      style="width: 600px;"
      class="question-dialog"
      :closable="true"
      @hide="onCancel"
  >
    <template #header>
      <div class="dialog-header">
        <div class="header-icon-wrapper" :class="{ 'edit-mode': edit }">
          <i :class="edit ? 'pi pi-pencil' : 'pi pi-plus'"></i>
        </div>
        <div class="header-text">
          <h2>{{ getHeaderTitle() }}</h2>
          <p>{{ edit ? 'Modifica tu pregunta' : 'Comparte tu duda con la comunidad' }}</p>
        </div>
      </div>
    </template>

    <div class="dialog-content">
      <!-- Category Field -->
      <div class="form-field">
        <label for="category" class="field-label">
          <i class="pi pi-tag"></i>
          Categoría
          <span class="required">*</span>
        </label>
        <pv-dropdown
            id="category"
            v-model="entity.categoryId"
            :options="categories"
            optionLabel="name"
            optionValue="categoryId"
            placeholder="Selecciona una categoría"
            :class="{'p-invalid': !entity.categoryId}"
            class="custom-dropdown"
        />
        <small v-if="!entity.categoryId" class="error-message">
          <i class="pi pi-exclamation-circle"></i>
          La categoría es requerida
        </small>
      </div>

      <!-- Question Field -->
      <div class="form-field">
        <label for="ask" class="field-label">
          <i class="pi pi-comment"></i>
          Tu Pregunta
          <span class="required">*</span>
        </label>
        <pv-text-area
            id="ask"
            v-model="entity.ask"
            placeholder="Escribe tu pregunta aquí..."
            :autoResize="true"
            rows="5"
            :class="{'p-invalid': !entity.ask}"
            class="custom-textarea"
        />
        <div class="field-footer">
          <small v-if="!entity.ask" class="error-message">
            <i class="pi pi-exclamation-circle"></i>
            La pregunta es requerida
          </small>
          <small v-else class="char-count">
            {{ entity.ask?.length || 0 }} caracteres
          </small>
        </div>
      </div>

      <!-- Info Box -->
      <div class="info-box">
        <i class="pi pi-info-circle"></i>
        <div>
          <strong>Consejo:</strong> Sé específico y claro en tu pregunta para obtener mejores respuestas de la comunidad.
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <pv-button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            class="btn-cancel"
            @click="onCancel"
        />
        <pv-button
            type="button"
            :label="getSubmitLabel()"
            :icon="edit ? 'pi pi-check' : 'pi pi-send'"
            class="btn-submit"
            :disabled="!entity.categoryId || !entity.ask"
            @click="onSave"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
/* Dialog */
.question-dialog :deep(.p-dialog) {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.question-dialog :deep(.p-dialog-header) {
  padding: 0;
  border-bottom: none;
  background: transparent;
  border-radius: 16px 16px 0 0;
}

.question-dialog :deep(.p-dialog-content) {
  padding: 0;
  background: white;
}

.question-dialog :deep(.p-dialog-footer) {
  padding: 0;
  border-top: none;
  background: transparent;
  border-radius: 0 0 16px 16px;
}

/* Dialog Header */
.dialog-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 16px 16px 0 0;
}

.header-icon-wrapper {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.header-icon-wrapper.edit-mode {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.header-text h2 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.header-text p {
  font-size: 15px;
  color: #64748b;
}

/* Dialog Content */
.dialog-content {
  padding: 32px;
}

.form-field {
  margin-bottom: 24px;
}

.form-field:last-of-type {
  margin-bottom: 0;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

.field-label i {
  font-size: 16px;
  color: #10b981;
}

.required {
  color: #ef4444;
  margin-left: 4px;
}

/* Dropdown */
.custom-dropdown {
  width: 100%;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.custom-dropdown:not(.p-disabled):hover {
  border-color: #cbd5e1;
}

.custom-dropdown:not(.p-disabled).p-focus {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.custom-dropdown.p-invalid {
  border-color: #ef4444;
}

/* Textarea */
.custom-textarea {
  width: 100%;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  padding: 12px;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 120px;
}

.custom-textarea:hover {
  border-color: #cbd5e1;
}

.custom-textarea:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  outline: none;
}

.custom-textarea.p-invalid {
  border-color: #ef4444;
}

.field-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
}

.error-message i {
  font-size: 12px;
}

.char-count {
  color: #94a3b8;
  font-size: 13px;
  margin-left: auto;
}

/* Info Box */
.info-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  margin-top: 24px;
}

.info-box i {
  font-size: 20px;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-box div {
  font-size: 14px;
  color: #1e40af;
  line-height: 1.5;
}

.info-box strong {
  font-weight: 600;
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 32px;
  background: #f8fafc;
  border-radius: 0 0 16px 16px;
}

.btn-cancel {
  background: white;
  border: 2px solid #e2e8f0;
  color: #64748b;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.btn-submit {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-submit:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

/* Responsive */
@media (max-width: 640px) {
  .question-dialog :deep(.p-dialog) {
    width: 95% !important;
    margin: 0 auto;
  }

  .dialog-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
  }

  .header-icon-wrapper {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }

  .dialog-content {
    padding: 24px;
  }

  .dialog-footer {
    padding: 20px 24px;
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>