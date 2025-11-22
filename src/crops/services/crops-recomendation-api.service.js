
import http from "/src/shared/services/http-common.js";

export class CropsRecomendationApiService {

    getAllCrops(){
        return http.get('/crops/crops')
    }


}