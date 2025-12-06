<script>
export default {
  name: "change-phase-dialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onNo() {
      this.$emit('update:visible', false);
      this.$emit('canceled');
    },
    onYes() {
      this.$emit('update:visible', false);
      this.$emit('confirmed');
    }
  }
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      :modal="true"
      :closable="true"
      :dismissableMask="true"
      @update:visible="onNo"
      class="phase-dialog"
      style="width: 500px;"
  >
    <template #header>
      <div class="dialog-header">
        <div class="icon-container">
          <i class="pi pi-sync header-icon"></i>
        </div>
        <div class="header-text">
          <h2>Cambiar Fase Fenológica</h2>
          <p>Confirma la actualización del estado del cultivo</p>
        </div>
      </div>
    </template>

    <div class="dialog-content">
      <div class="warning-box">
        <i class="pi pi-exclamation-triangle warning-icon"></i>
        <div class="warning-content">
          <h3>¿Estás seguro de cambiar la fase fenológica?</h3>
          <p>Esta acción actualizará el estado actual del cultivo a la siguiente fase de crecimiento. Este cambio afectará las recomendaciones y el seguimiento del cultivo.</p>
        </div>
      </div>

      <div class="info-section">
        <div class="info-item">
          <i class="pi pi-info-circle info-icon"></i>
          <div>
            <strong>Importante:</strong>
            <span>El cultivo avanzará automáticamente a la siguiente fase fenológica.</span>
          </div>
        </div>
        <div class="info-item">
          <i class="pi pi-check-circle info-icon"></i>
          <div>
            <strong>Beneficio:</strong>
            <span>Recibirás recomendaciones actualizadas para esta nueva fase.</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <pv-button
            label="Cancelar"
            icon="pi pi-times"
            class="btn-cancel"
            @click="onNo"
        />
        <pv-button
            label="Confirmar Cambio"
            icon="pi pi-check"
            class="btn-confirm"
            @click="onYes"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
/* Dialog Styles */
.phase-dialog :deep(.p-dialog) {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.phase-dialog :deep(.p-dialog-header) {
  padding: 24px 32px;
  border-bottom: 2px solid #f1f5f9;
  background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
  border-radius: 16px 16px 0 0;
}

.phase-dialog :deep(.p-dialog-content) {
  padding: 32px;
  background: white;
}

.phase-dialog :deep(.p-dialog-footer) {
  padding: 20px 32px;
  border-top: 2px solid #f1f5f9;
  background: #f8fafc;
  border-radius: 0 0 16px 16px;
}

/* Header */
.dialog-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-container {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 32px;
  color: #d97706;
}

.header-text h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.header-text p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* Content */
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.warning-box {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 12px;
}

.warning-icon {
  font-size: 28px;
  color: #dc2626;
  flex-shrink: 0;
  margin-top: 4px;
}

.warning-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #991b1b;
  margin: 0 0 8px 0;
}

.warning-content p {
  font-size: 14px;
  color: #7f1d1d;
  line-height: 1.6;
  margin: 0;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
}

.info-icon {
  font-size: 20px;
  color: #16a34a;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-item div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item strong {
  font-size: 14px;
  font-weight: 600;
  color: #14532d;
}

.info-item span {
  font-size: 14px;
  color: #166534;
  line-height: 1.5;
}

/* Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer :deep(.p-button) {
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0 !important;
}

.btn-cancel:hover {
  background: #f8fafc;
  border-color: #cbd5e1 !important;
  color: #0f172a;
  transform: translateY(-2px);
}

.btn-confirm {
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
  color: white;
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.3);
}

/* Responsive */
@media (max-width: 640px) {
  .phase-dialog :deep(.p-dialog) {
    width: 95% !important;
    margin: 0 auto;
  }

  .phase-dialog :deep(.p-dialog-header),
  .phase-dialog :deep(.p-dialog-content),
  .phase-dialog :deep(.p-dialog-footer) {
    padding: 20px;
  }

  .dialog-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-text h2 {
    font-size: 18px;
  }

  .warning-box {
    flex-direction: column;
  }

  .dialog-footer {
    flex-direction: column-reverse;
  }

  .dialog-footer :deep(.p-button) {
    width: 100%;
  }
}
</style>