import http from "../../shared/services/http-common.js";

export class ProductsApiService {
    getAll() {
        return http.get("/crops-management/sowings/products");
    }

    /**
     * Method to get products by sowing id
     * @param sowingId
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    getProductsBySowingId(sowingId) {
        return http.get(`/crops-management/sowings/` + sowingId + `/products`);
    }

    /**
     * Method to add a product to a sowing
     * @param sowingId
     * @param body
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    addProduct(sowingId, body) {
        return http.post('/crops-management/sowings/' + sowingId  + '/products', body);
    }

    getAllProducts() {
        return http.get('/crops-management/sowings/products');
    }

    postProduct(body) {
        return http.post('/crops-management/sowings/products', body);
    }

    getProductBySowingInfo(sowingId, productId) {
        return http.get(`/crops-management/sowings/${sowingId}/products/${productId}`);
    }

    deleteProductBySowing(sowingId, productId) {
        return http.delete(`/crops-management/sowings/${sowingId}/products/${productId}`);
    }
}
