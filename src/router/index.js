import { createRouter, createWebHistory } from 'vue-router';
import CropListAndRegistrationManagementComponent from "../crops/pages/crop-list-and-registration-management.component.vue";


const routes = [
    { path: '/', redirect: '/home'},
    { path:'/crop-list-and-registration',component: CropListAndRegistrationManagementComponent},

];


const router = createRouter({
    history: createWebHistory(),
    routes
});


export default router;