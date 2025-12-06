import http from "../../shared/services/http-common.js";

export class PestsApiService {
    getAll() {
        return http.get("/crops-management/crops/pests");
    }

    getByCropId(){
        return http.get(`/crops-management/crops/pests/${id}`);
    }
}