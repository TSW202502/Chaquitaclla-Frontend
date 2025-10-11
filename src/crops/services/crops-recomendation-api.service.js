import http from "/src/shared/services/http-common.js";

export class CropsRecomendationApiService {

    getAllCrops(){
        return http.get('/crops-management/crops');
    }

    getCropById(id){
        return http.get(`/crops-management/crops/${id}`);
    }
}

