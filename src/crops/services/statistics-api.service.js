
import http from "../../shared/services/http-common.js";

export class StatisticsApiService {

    getAllSowings(){
        return http.get(`/crops-management/sowings`);
    }

    getCrop(id){
        return http.get(`/crops-management/crops/${id}`);
    }

    getControlsBySowing(sowingId){
        return http.get(`/crops-management/sowings/${sowingId}/controls`);
    }





}

