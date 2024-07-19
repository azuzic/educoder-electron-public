import { createRouter, createWebHistory } from "vue-router";
import { userStore, globalStore } from "@/main.js"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "Introduction",
			component: () => import("@/views/EC_IntroductionView.vue"),
		},
		{
			path: "/sign-in",
			name: "Sign In",
			component: () => import("@/views/EC_SignIn.vue"),
		},
		{
			path: "/home",
			name: "Home",
			component: () => import("@/views/EC_HomeView.vue"),
		},
		{
			path: "/exam",
			name: "Exam",
			component: () => import("@/views/EC_ExamView.vue"),
		},
		{
			path: "/upload",
			name: "Upload Exam",
			component: () => import("@/views/EC_UploadExamView.vue"),
		},
		{
			path: "/admin",
			name: "Admin",
			component: () => import("@/views/EC_AdminView.vue"),
		},
		{
			path: "/under-maintenance",
			name: "Under Maintenance",
			component: () => import("@/views/EC_UnderMaintenanceView.vue"),
		},
		{
			path: "/exam-in-progress",
			name: "Exam in progress",
			component: () => import("@/views/EC_ExamInProgressView.vue"),
		},
		{
			path: "/testing",
			name: "Testing",
			component: () => import("@/views/EC_TestingView.vue"),
		},
		{
			path: "/batch-examination",
			name: "Batch Examination",
			component: () => import("@/views/EC_BatchExaminationView.vue"),
		},
	],
});

router.beforeEach(async (to, from, next) => {
    if (window.api == undefined) {
        if (['Sign In'].includes(to.name)) next();
        else next("/sign-in");
    }
    else if (globalStore.UnderConsturction && to.name != "Under Maintenance") {
        next("/under-maintenance");
    } else if (globalStore.UnderConsturction && to.name == "Under Maintenance") {
        next();
    }
    else if (['Upload Exam', 'Home', 'Admin', 'Exam in progress', 'Testing', 'Batch Examination'].includes(to.name)) {
        if (![].includes(userStore.user.email)) next("/");
        else next();
    }
    else if ((!userStore.user.email || !userStore.introductionDialogRead) && !['Introduction', 'Sign In'].includes(to.name)) next("/");
    else next();
});

export default router;
