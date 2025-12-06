import { createRouter, createWebHistory } from 'vue-router';


import CropsStatisticsComponent from "../crops/pages/crops-statistics.component.vue";
import ControlPanelPageComponent from "../public/pages/control-panel-page.component.vue";
import CropInformationManagementComponent from "../crops/pages/crop-information-management.component.vue";
import CropListAndRegistrationManagementComponent from "../crops/pages/crop-list-and-registration-management.component.vue";
import HistoryTableComponent from "../crops/components/history-table.component.vue";
import ForumManagementComponent from "../forum/pages/forum-management.component.vue";
import MembershipSelectorComponent  from "../profiles/pages/membership-selector.component.vue";
import UserProfileEditPageComponent from "../profiles/pages/user-profile-edit-page.component.vue";
import UserProfileCreatePageComponent from "../profiles/pages/user-profile-create-page.component.vue";
import PageNotFoundComponent from "../public/pages/page-not-found.component.vue";
import SignUpComponent from "../iam/pages/sign-up.component.vue";
import SignInComponent from "../iam/pages/sign-in.component.vue";
import {authenticationGuard} from "../iam/services/authentication.guard.js";


const routes = [
    { path: '/', redirect: '/home'},
    { path: '/sign-in', name: 'sign-in',    component: SignInComponent,             meta: { title: 'Sign In' } },
    { path: '/sign-up', name: 'sign-up',    component: SignUpComponent,             meta: { title: 'Sign Up' } },
    { path: '/user-profile-edit', name: 'user-profile-edit', component: UserProfileEditPageComponent},
    { path: '/user-profile-create', name: 'user-profile-create', component: UserProfileCreatePageComponent },
    { path: '/membership-selector', name: 'membership-selector', component: MembershipSelectorComponent },
    { path: '/sowing-statistics-reports', component: CropsStatisticsComponent },
    { path: '/control-panel',name: 'control-panel', component: ControlPanelPageComponent},
    { path:'/crop-list-and-registration',component: CropListAndRegistrationManagementComponent},
    { path: '/crop-information/:id', name: 'crop-information', component: CropInformationManagementComponent},
    { path: '/crop-history', component: HistoryTableComponent },
    { path: '/consultation-forum',component: ForumManagementComponent },
    { path: '/:pathMatch(.*)*', component: PageNotFoundComponent }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    let baseTitle = 'Chaquitaclla';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    authenticationGuard(to, from, next);
});
export default router;