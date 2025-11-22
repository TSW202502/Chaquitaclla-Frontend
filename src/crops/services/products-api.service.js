import http from "../../shared/services/http-common.js";

export class ProductsApiService {
    getAll() {
        return http.get("/crops/products");
    }
}
