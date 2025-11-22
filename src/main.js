import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";

import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import * as VueBarGraph from 'vue-bar-graph';
import VueApexCharts from 'vue3-apexcharts'
import ApexCharts from 'apexcharts'

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import router from "./router/index.js";
import DialogService from "primevue/dialogservice";
import ConfirmationService from "primevue/confirmationservice";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import Row from "primevue/row";
import Textarea from "primevue/textarea";
import Sidebar from "primevue/sidebar";
import Menu from "primevue/menu";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import FileUpload from "primevue/fileupload";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputNumber from "primevue/inputnumber";
import FloatLabel from "primevue/floatlabel";
import Checkbox from "primevue/checkbox";
import Rating from "primevue/rating";
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Calendar from "primevue/calendar";
import Divider from "primevue/divider";
import SelectButton from "primevue/selectbutton";
import Password from "primevue/password";
import i18n from "./i18n.js";

createApp(App)
    .use(router)
    .use(PrimeVue, {ripple: true})
    .use(DialogService)
    .use(ToastService)
    .use(ConfirmationService)
    .use(i18n)
    .component('apexchart', VueApexCharts)
    .component('pv-password', Password)
    .component('pv-toolbar',Toolbar)
    .component('pv-tab-view',TabView)
    .component('pv-tab-panel',TabPanel)
    .component('pv-button', Button)
    .component('pv-input-text', InputText)
    .component('pv-divider', Divider)
    .component('pv-card', Card)
    .component('pv-bar-graph',VueBarGraph)
    .component('pv-data-table', DataTable)
    .component('pv-column', Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-row', Row)
    .component('pv-textarea', Textarea)
    .component('pv-sidebar', Sidebar)
    .component('pv-menu', Menu)
    .component('pv-dialog', Dialog)
    .component('pv-toast', Toast)
    .component('pv-dropdown', Dropdown)
    .component('pv-tag', Tag)
    .component('pv-file-upload', FileUpload)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-input-number', InputNumber)
    .component('pv-float-label', FloatLabel)
    .component('pv-checkbox', Checkbox)
    .component('pv-rating', Rating)
    .component('pv-calendar',Calendar)
    .component('pv-text-area',Textarea)
    .component('pv-select-button',SelectButton)
    .mount('#app')
