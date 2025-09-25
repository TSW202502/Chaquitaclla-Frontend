import { createRouter, createWebHistory } from 'vue-router';
import ControlPanelPageComponent from "../public/pages/control-panel/components/control-panel-page.component.vue";

const routes = [
    { path: '/', redirect: '/home'},
    { path: '/control-panel', component: ControlPanelPageComponent},

];


const router = createRouter({
    history: createWebHistory(),
    routes
});


export default router;