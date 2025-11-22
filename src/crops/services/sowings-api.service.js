import http from "../../shared/services/http-common.js";

export class SowingsApiService{

    getAll(){
        return http.get("/crops/sowings");
    }
    getById(id) {
        return http.get(`/crops/sowings/${id}`);
    }
    create(tutorialResource) {
        return http.post('/crops/sowings', tutorialResource);
    }

    update(id, tutorialResource) {
        return http.put(`/crops/sowings/${id}`, tutorialResource);
    }

    delete(id) {
        console.log('Sending delete request for sowing with ID:', id);

        return http.delete(`/crops/sowings/${id}`)
            .then((response) => {
                console.log('Delete request successful:', response);
                return response;
            })
            .catch((error) => {
                console.error('Error in delete request:', error);
                throw error;
            });
    }

    findByTitle(title) {
        return http.get(`/crops/sowings?title=${title}`);
    }
}