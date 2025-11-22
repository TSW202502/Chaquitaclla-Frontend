
import http from "../../shared/services/http-common.js";

export class StatisticsApiService {

    getAllSowings(){
        return http.get('/crops/sowings')
    }

}