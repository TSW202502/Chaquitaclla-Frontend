import http from "../../shared/services/http-common.js";

export class CropCaresApiService {
    getAll() {
        return http.get("/crops-management/crops/cares");
    }

    getByCropId(id){
        return http.get(`/crops-management/crops/${id}/cares`);
    }
}
