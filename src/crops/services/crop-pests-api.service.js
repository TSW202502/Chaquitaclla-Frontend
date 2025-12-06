import http from "../../shared/services/http-common.js";
export class CropPestsApiService {
    getAll() {
        return http.get("/crops-management/crops/pests");
    }

    getByCropId(id){
        return http.get(`/crops-management/crops/${id}/pests`);
    }
}