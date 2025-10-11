import http from "../../shared/services/http-common.js";

export class SowingsApiService{

    getAll(){
        return http.get("/crops-management/sowings");
    }
    getAllFalse(){
        return http.get("/crops-management/sowings/?status=false");

    }
    getById(id) {
        return http.get(`/crops-management/crops/sowings/${id}`);
    }
    create(sowingResource) {
        return http.post('/crops-management/sowings', sowingResource);
    }

    update(id, tutorialResource) {
        return http.put(`/crops-management/sowings/${id}`, tutorialResource);
    }
    updatePhenologicalPhase(id) {
        return http.put(`/crops-management/sowings/${id}/phenologicalphase`);
    }
    updateSowing(sowing){
        return new Promise((resolve,reject) =>{
            http.put(`/crops-management/sowings/${sowing.id}`, sowing)
                .then(response => {
                    console.log('Update request successful:', response);
                    resolve(response);
                })
                .catch(error => {
                    console.error('Error in update request:', error);
                    reject(error);
                });
        });
    }

    delete(id) {
        console.log('Sending delete request for sowing with ID:', id);

        return http.delete(`/crops-management/sowings/${id}`)
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
        return http.get(`/crops-management/crops/sowings?title=${title}`);
    }
}