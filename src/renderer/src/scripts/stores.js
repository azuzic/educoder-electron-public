import { useGlobalStore } from "@/stores/globalStore.js";
import { useExamStore } from "@/stores/examStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { useFileStore } from "@/stores/fileStore.js";
import { useAdminStore } from "@/stores/adminStore.js";
import { useTestingStore } from "@/stores/testingStore.js";

function setUpStores(pinia) {
    const globalStore = useGlobalStore(pinia);
    const examStore = useExamStore(pinia);
    const userStore = useUserStore(pinia);
    const fileStore = useFileStore(pinia);
    const adminStore = useAdminStore(pinia);
    const testingStore = useTestingStore(pinia);
    return { globalStore, examStore, userStore, fileStore, adminStore, testingStore }
}
export { setUpStores }