import http from "../../shared/services/http-common.js";

export class UsersApiService {

    getAllUsers(){
        return http.get("/users/users")
    }

    getUserById(id){
        return http.get(`/users/users/${id}`)
    }
   getAllSubscriptions(){
        return http.get("/users/subscriptions")
    }
    getAllCountries(){
        return http.get("users/countries")
    }

}
