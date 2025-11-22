import http from "../../shared/services/http-common.js";

export class DiseasesApiService {
    getAll() {
        return http.get("/crops/diseases");
    }
}