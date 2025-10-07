import http from "../../shared/services/http-common.js";

export class CropsRecomendationApiService {
    getCropById(id) {
        return http.get(`/crops/${id}`);
    }
    getById(id) {
        return this.getCropById(id);
    }
    create(payload) {
        return http.post(`/crops`, payload);
    }
}