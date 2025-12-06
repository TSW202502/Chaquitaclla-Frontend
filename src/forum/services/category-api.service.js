import http from "../../shared/services/http-common.js";

export class CategoryApiService{

    getAllCategories(){
        return http.get("/forum/categories");
    }
}