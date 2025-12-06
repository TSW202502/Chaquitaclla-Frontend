import http from "../../shared/services/http-common.js";

export class ControlsApiService {
    getControlById(sowingId, controlId) {
        return http.get(`/crops-management/sowings/${sowingId}/controls/${controlId}`);
    }

    getAllControlsBySowingId(sowingId) {
        return http.get(`/crops-management/sowings/${sowingId}/controls`);
    }

    deleteControl(sowingId, controlId) {
        return http.delete(`/crops-management/sowings/${sowingId}/controls/${controlId}`);
    }

    getAllControls() {
        return http.get(`/crops-management/sowings/controls`);
    }

    createControl(sowingId, control) {
        return http.post(`/crops-management/sowings/${sowingId}/controls`, control);
    }

    updateControl(sowingId, controlId, control) {
        return http.put(`/crops-management/sowings/${sowingId}/controls/${controlId}`, control);
    }
}