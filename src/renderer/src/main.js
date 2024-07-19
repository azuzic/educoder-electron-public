import { createApp, markRaw } from "vue";
import router from "./router";
import App from "./App.vue";
import { setUpComponents } from "@/scripts/imports.js";
import { setUpStores } from "@/scripts/stores.js";

//GLOBAL STYLE
import "@/style.css";

//GLOBAL STORES
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

//PINIA AND VUE
const pinia = createPinia(); // Redoslijed je jako bitan ovdje, inače neće raditi
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app.use(pinia);

const { globalStore, examStore, userStore, fileStore, adminStore, testingStore } = setUpStores(pinia);
pinia.use(({ store }) => {
	store.router = markRaw(router);
});

// GLOBAL COMPONENTS
setUpComponents(app);

app.use(router);
app.mount("#app");

// TITLE TAG
const defaultDocumentTitle = "EduCoder";
router.afterEach((to) => {
	document.title = to.meta?.title ? `${to.meta.title} — ${defaultDocumentTitle}` : defaultDocumentTitle;
});

//EXPORT STORES
export { globalStore, examStore, userStore, fileStore, adminStore, testingStore };
