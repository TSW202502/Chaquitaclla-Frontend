// src/crops/services/sowings-api.service.js
import http from "../../shared/services/http-common.js";

export class SowingsApiService {
    getAllFalse()       { return http.get("sowings", { params: { status: false } }); }
    create(payload)     { return http.post("sowings", payload); }
    update(id, payload) { return http.put(`sowings/${id}`, payload); }
    delete(id)          { return http.delete(`sowings/${id}`); }
    updatePhenologicalPhase(id, phaseIndex) {
        return http.put(`sowings/${id}/phenological-phase`, { phase: phaseIndex });
    }
}