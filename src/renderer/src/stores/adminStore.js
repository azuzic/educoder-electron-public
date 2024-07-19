import { defineStore } from "pinia";
import { globalStore, userStore, fileStore, examStore } from "@/main.js";
import cryptoRandomString from "crypto-random-string";

import { db, collection, setDoc, deleteDoc, getDocs, getDoc, doc, updateDoc, arrayRemove, arrayUnion, ref, listAll, getDownloadURL, storage, query, where, deleteField } from "@/scripts/firebase.js";
import { ADMIN_MSGS } from "@/scripts/messages.js"
import { codeCopy, wait } from "@/scripts/helpers.js"
import router from '@/router/index.js';

export const useAdminStore = defineStore("adminStore", {
    state: () => ({
        updating: false,
        editing: true,

        // #region DATA - USERS
        users: [],

        userEmailQuery: "",
        userTypeQuery: "redovan",
        userClassQuery: "PJS",

        userEmailFilter: "",
        userExamPasswordFilter: "",
        userExamTitleFilter: "",
        userStartDateFilter: undefined,
        userEndDateFilter: undefined,
        filteredUsers: [],
        expandAllUsers: false,
        // #endregion

        // #region DATA - EXAMS
        createdExams: [],
        examPasswords: {},
        examTitleFilter: "",
        examPasswordFilter: "",
        examAccessFilter: "sve",
        examClassFilter: "sve",
        examIDFilter: "",
        selectedExam: { id: "" },
        oldExam: { },
        passwordLength: 5,
        selectedExamUpToDate: false,
        // #endregion

        // #region DATA - SOLUTIONS
        solutions: [],
        userSolutionsEmailFilter: "",
        userSolutionsMatchAccess: false,
        selectedSolutionUrl: "",
        selectedSolution: "",
        selectedTaskSolution: 0,
        selectedSolutionPassword: "",
        selectedUserSolution: {
            id: "",
            password: "",
            userEmail: ""
        },
        // #endregion

        // #region DATA - BATCH EXAMINATION
        batchIndex: 0,
        batchSolutions: [],
        // #endregion
    }),
    actions: {
        // #region FUNCTIONS - OTHER
        async awaitCodeCopy() {
            await wait(0.01);
            codeCopy();
        },
        async setEditing(value) {
            this.editing = value;
            this.awaitCodeCopy();
        },
        async updateScriptVisibility(i) {
            try {
                this.updating = true;
                const docRef = doc(db, "data", "scripts");
                fileStore.scripts[i].visible = !fileStore.scripts[i].visible;
                const visibilityArray = fileStore.scripts.map(script => script.visible);
                await updateDoc(docRef, { visibility: visibilityArray });
                globalStore.pushPopup(ADMIN_MSGS.SCRIPT_UPDATE__SUCCESS, this, 1);
            } catch (error) {
                if (error.code == "not-found") {
                    try {
                        this.updating = true;
                        const docRef = doc(db, "data", "scripts");
                        await setDoc(docRef, { visibility: [] });
                        fileStore.scripts[i].visible = !fileStore.scripts[i].visible;
                        const visibilityArray = fileStore.scripts.map(script => script.visible);
                        await updateDoc(docRef, { visibility: visibilityArray });
                        globalStore.pushPopup(ADMIN_MSGS.SCRIPT_UPDATE__SUCCESS, this, 1);
                    } catch (error) {
                        globalStore.pushPopup(ADMIN_MSGS.SCRIPT_UPDATE__ERROR, this, 1, {location: "adminStore - updateScriptVisibility() - NOT_FOUND: ", message: error});
                    }
                } else globalStore.pushPopup(ADMIN_MSGS.SCRIPT_UPDATE__ERROR, this, 1, {location: "adminStore - updateScriptVisibility(): ", message: error});
            }
        },
        generatePassword() {
			this.selectedExam.password = cryptoRandomString({ length: this.passwordLength, type: "alphanumeric" });
		},
        // #endregion

        // #region FUNCTIONS - EXAMS
        async fetchCreatedExams() {
            try {
                this.updating = true;
                const docRef = doc(db, "data", "exams");

                this.createdExams = [];
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    if (docSnap.data().createdExams)
                        this.createdExams = docSnap.data().createdExams;
                    if (docSnap.data().examPasswords)
                        this.examPasswords = docSnap.data().examPasswords;
                    globalStore.pushPopup(ADMIN_MSGS.FETCH_CREATED_EXAMS__SUCCESS, this, 1);
                }
                else globalStore.pushPopup(ADMIN_MSGS.FETCH_CREATED_EXAMS__WARNING, this, 1);
                this.awaitCodeCopy();
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.FETCH_CREATED_EXAMS__ERROR, this, 1, { location: "adminStore - fetchCreatedExams(): ", message: error});
            }
        },
        async fetchExam(id, ignoreSuccess = false) {
            try {
                this.updating = true;
                const docRef = doc(db, "exams", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    if (!ignoreSuccess) globalStore.pushPopup(ADMIN_MSGS.FETCH_EXAM__SUCCESS, this, 1);
                    else {
                        await wait(1);
                        this.updating = false;
                    }
                    return docSnap.data();
                }
                else {
                    globalStore.pushPopup(ADMIN_MSGS.FETCH_EXAM__WARNING, this, 1);
                    return false;
                }
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.FETCH_EXAM__ERROR, this, 1, { location: "adminStore - fetchExams(): ", message: error});
            }
        },
        async selectExam(id) {
            this.selectedExam = await this.fetchExam(id);
            this.oldExam = JSON.parse(JSON.stringify(this.selectedExam));
            fileStore.groups = this.selectedExam.groups;
            fileStore.groupIndex = 0;
		    fileStore.taskIndex = 0;
            this.selectedSolutionUrl = "";
            this.solutions = [];
            const passwords = Object.keys(this.examPasswords[this.selectedExam.id]);
            if (passwords.length > 0) this.selectedSolutionPassword = passwords[0];
            this.awaitCodeCopy();
            this.selectedExamUpToDate = true;
        },
        deselectExam() {
            this.selectedExam = { id: "" };
            this.oldExam = { };
            this.selectedSolutionUrl = "";
            this.solutions = [];
            this.selectedSolutionPassword = "";
        },
        async resetExam() {
            this.selectedExam = JSON.parse(JSON.stringify(this.oldExam));
            fileStore.groups = JSON.parse(JSON.stringify(this.oldExam.groups));
            fileStore.groupIndex = 0;
		    fileStore.taskIndex = 0;
            this.awaitCodeCopy();
        },
        async fixExamPassword(id, password) {
            try {
                const latestExamVersion = await this.fetchExam(id);
                if (!latestExamVersion) {
                    globalStore.pushPopup(ADMIN_MSGS.FIX_EXAM_PASSWORD__WARNING, false, 0);
                    return;
                }
                const createdExamsDocRef = doc(db, "data", "exams");
                await setDoc(createdExamsDocRef, {
                    examPasswords: {
                        [id]: {
                            [password]: Date.now()
                        }
                    }
                }, { merge: true });
                this.examPasswords[id] = {};
                this.examPasswords[id][password] = Date.now();
                globalStore.pushPopup(ADMIN_MSGS.FIX_EXAM_PASSWORD__SUCCESS, false, 0);
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.FIX_EXAM_PASSWORD__ERROR, this, 1, {location: "adminStore - setExamPassword(): ", message: error});
            }
        },
        async checkExamUpToDate() {
            if (this.selectedExam.id != '') {
                const upToDate =  await this.checkExamVersion();
                if (upToDate == "NOT FOUND") globalStore.pushPopup(ADMIN_MSGS.SELECTED_EXAM_UP_TO_DATE__EXAM_DELETED_WARNING, this, 0);
                else if (upToDate) globalStore.pushPopup(ADMIN_MSGS.SELECTED_EXAM_UP_TO_DATE__SUCCESS, this, 0);
                else  globalStore.pushPopup(ADMIN_MSGS.SELECTED_EXAM_UP_TO_DATE__WARNING, this, 0);
            }
        },
        async checkExamVersion() {
            const latestExamVersion = await this.fetchExam(this.selectedExam.id, true);
            if (!latestExamVersion) {
                this.selectedExamUpToDate = false;
                return "NOT FOUND";
            }
            const shortExamOld = {
                courseCode: this.oldExam.course.code,
                id: this.oldExam.id,
                title: this.oldExam.title,
                accessLimit: this.oldExam.accessLimit,
                accessTimeLimit: {start: this.oldExam.accessTimeLimit.start, end: this.oldExam.accessTimeLimit.end},
                password: this.oldExam.password,
            }
            const shortExamLatest = {
                courseCode: latestExamVersion.course.code,
                id: latestExamVersion.id,
                title: latestExamVersion.title,
                accessLimit: latestExamVersion.accessLimit,
                accessTimeLimit: {start: latestExamVersion.accessTimeLimit.start, end: latestExamVersion.accessTimeLimit.end},
                password: latestExamVersion.password,
            }
            this.selectedExamUpToDate = JSON.stringify(shortExamOld) == JSON.stringify(shortExamLatest);
            return this.selectedExamUpToDate;
        },
        async updateExistingExams() {
            try {
                this.selectedExam.accessTimeLimit.start = new Date(this.selectedExam.accessTimeLimit.start).getTime();
                this.selectedExam.accessTimeLimit.end = new Date(this.selectedExam.accessTimeLimit.end).getTime();
                const shortExamOld = {
                    courseCode: this.oldExam.course.code,
                    id: this.oldExam.id,
                    title: this.oldExam.title,
                    accessLimit: this.oldExam.accessLimit,
                    accessTimeLimit: this.oldExam.accessTimeLimit,
                    password: this.oldExam.password,
                }
                const shortExamNew = {
                    courseCode: this.selectedExam.course.code,
                    id: this.selectedExam.id,
                    title: this.selectedExam.title,
                    accessLimit: this.selectedExam.accessLimit,
                    accessTimeLimit: this.selectedExam.accessTimeLimit,
                    password: this.selectedExam.password,
                }
                if (JSON.stringify(shortExamOld) != JSON.stringify(shortExamNew)) {
                    const examArrayDocRef = doc(db, "data", "exams");
                    await updateDoc(examArrayDocRef, {
                        createdExams: arrayRemove(shortExamOld)
                    });
                    await updateDoc(examArrayDocRef, {
                        createdExams: arrayUnion(shortExamNew)
                    });
                    globalStore.pushPopup(ADMIN_MSGS.UPDATE_EXISTING_EXAM__SUCCESS, false, 0);
                }
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.UPDATE_EXISTING_EXAM__ERROR, this, 1, {location: "adminStore - updateExistingExams(): ", message: error});
            }
        },
        async updateNewExamPassword() {
            try {
                if (this.oldExam.password != this.selectedExam.password) {
                    const createdExamsDocRef = doc(db, "data", "exams");
                    await setDoc(createdExamsDocRef, {
                        examPasswords: {
                            [this.selectedExam.id]: {
                                [this.selectedExam.password]: Date.now()
                            }
                        }
                    }, { merge: true });
                    globalStore.pushPopup(ADMIN_MSGS.UPDATE_NEW_EXAM_PASSWORD__SUCCESS, false, 0);
                }
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.UPDATE_NEW_EXAM_PASSWORD__ERROR, this, 1, {location: "adminStore - updateNewExamPassword(): ", message: error});
            }
        },
        async updateEntireExam() {
            try {
                this.selectedExam.groups = fileStore.groups;
                this.selectedExam.lastUpdatedTimestamp = Date.now();
                this.selectedExam.lastUpdatedBy = userStore.user.email;
                const newExamRef = doc(db, "exams", this.selectedExam.id);
                await setDoc(newExamRef, this.selectedExam);
                this.oldExam = JSON.parse(JSON.stringify(this.selectedExam));
                globalStore.pushPopup(ADMIN_MSGS.UPDATE_ENTIRE_EXAM__SUCCESS, false, 0);
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.UPDATE_ENTIRE_EXAM__ERROR, this, 1, {location: "adminStore - updateEntireExam(): ", message: error});
            }
        },
        async updateExam() {
            try {
                this.updating = true;

                const upToDate = await this.checkExamVersion();
                if (upToDate == "NOT FOUND") {
                    globalStore.pushPopup(ADMIN_MSGS.UPDATE_EXAM__EXAM_DELETED_WARNING, this, 0);
                    return;
                }
                if (!upToDate) {
                    globalStore.pushPopup(ADMIN_MSGS.UPDATE_EXAM__WARNING, this, 0);
                    return;
                }

                await this.updateExistingExams();

                await this.updateNewExamPassword();

                await this.updateEntireExam();

                globalStore.pushPopup(ADMIN_MSGS.UPDATE_EXAM__SUCCESS(this.selectedExam.title), this, 0);
                await this.fetchCreatedExams()
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.UPDATE_EXAM__ERROR, this, 1, {location: "adminStore - updateExam(): ", message: error});
            }
        },
        async deleteExam() {
            try {
                this.updating = true;

                const latestExamVersion = await this.fetchExam(this.selectedExam.id);
                if (!latestExamVersion) {
                    globalStore.pushPopup(ADMIN_MSGS.DELETE_EXAM__ALREADY_DELETED_WARNING, this, 0);
                    return;
                }
                const shortExamLatest = {
                    courseCode: latestExamVersion.course.code,
                    id: latestExamVersion.id,
                    title: latestExamVersion.title,
                    accessLimit: latestExamVersion.accessLimit,
                    accessTimeLimit: latestExamVersion.accessTimeLimit,
                    password: latestExamVersion.password,
                }

			    const examArrayDocRef = doc(db, "data", "exams");
                await updateDoc(examArrayDocRef, {
					createdExams: arrayRemove(shortExamLatest)
				});

                const createdExamsDocRef = doc(db, "data", "exams");
                await updateDoc(createdExamsDocRef, {
                    [`examPasswords.${this.oldExam.id}`]: deleteField()
                });

                const oldExamRef = doc(db, "exams", this.selectedExam.id);
                await deleteDoc(oldExamRef);

                this.selectedExam.id = "";
                globalStore.pushPopup(ADMIN_MSGS.DELETE_EXAM__SUCCESS(this.selectedExam.title), this, 0);
                await this.fetchCreatedExams();
                this.awaitCodeCopy();
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.DELETE_EXAM__ERROR, this, 1, {location: "adminStore - deleteExam(): ", message: error});
            }
        },
        // #endregion

        // #region FUNCTIONS - USERS
        async fetchUsers() {
            try {
                this.updating = true;

                this.users = [];

                const usersRef = collection(db, "users");
                let querySnapshot;
                if (this.userClassQuery == "sve" && this.userTypeQuery == "sve") {
                    querySnapshot = query(usersRef,
                        where("email", ">=", this.userEmailQuery), where("email", "<", this.userEmailQuery + "\uf8ff"));
                } else if (this.userClassQuery == "sve") {
                    querySnapshot = query(usersRef, where("userType", "==", this.userTypeQuery),
                        where("email", ">=", this.userEmailQuery), where("email", "<", this.userEmailQuery + "\uf8ff"));
                } else if (this.userTypeQuery == "sve") {
                    querySnapshot = query(usersRef, where("class", "==", this.userClassQuery),
                        where("email", ">=", this.userEmailQuery), where("email", "<", this.userEmailQuery + "\uf8ff"));
                } else {
                    querySnapshot = query(usersRef, where("class", "==", this.userClassQuery), where("userType", "==", this.userTypeQuery),
                        where("email", ">=", this.userEmailQuery), where("email", "<", this.userEmailQuery + "\uf8ff"));
                }
                const q = await getDocs(querySnapshot);

                q.forEach(async doc => {
                    this.users.push(doc.data());
                });
                globalStore.pushPopup(ADMIN_MSGS.FETCH_USERS__SUCCESS, this, 1);
            } catch (error) {
                console.error(error);
                globalStore.pushPopup(ADMIN_MSGS.FETCH_USERS__ERROR, this, 1, { location: "adminStore - fetchUsers(): ", message: error});
            }
        },
        async checkExamExists(id, password) {
            if (!this.createdExams.some(e => e.id == id)) await this.fetchCreatedExams()
            if (this.selectedExam.id != id) this.selectedExam = await this.fetchExam(id);

            this.oldExam = JSON.parse(JSON.stringify(this.selectedExam));
            fileStore.groups = this.selectedExam.groups;
            this.selectedSolutionPassword = password;
        },
        async checkURLExists(id, password, user) {
            let foundURLS = this.solutions.filter(s => s.name.includes(user.email));
            let url = "";

            if (foundURLS.length > 0) url = JSON.stringify(foundURLS[0].url);
            if (this.selectedSolution == "") await this.fetchSolutions();
            else if (url == "" || this.selectedSolution.examData.exam_id != id) await this.fetchSolutions();

            this.selectedSolution = "";
            url = this.solutions.filter(s => s.name.includes(user.email))[0]?.url;

            if (url) {
                await this.setSelectedSolution(user.email, url);
                this.selectedUserSolution = {
                    id: id,
                    password: password,
                    userEmail: user.email
                }
            } else globalStore.pushPopup(ADMIN_MSGS.FETCH_SOLLUTION__NOT_FOUND_WARNING, this, 0);
        },
        async selectUserSolution(id, password, user) {
            this.updating = true;

            fileStore.groupIndex = 0;
		    fileStore.taskIndex = 0;
            this.selectedSolutionUrl = "";
            this.selectedUserSolution = {
                id: "",
                password: "",
                userEmail: ""
            };

            this.checkExamExists(id, password);
            this.checkURLExists(id, password, user);

            this.editing = false;
            this.updating = false;
        },
        async updateUserExam(user, exam) {
            try {
                this.updating = true;
				const userDocRef = doc(collection(db, "users"), user.email);

                await updateDoc(userDocRef, {
                    acessedExams: arrayRemove({
                        id: exam.id,
                        password: exam.password,
                        initiated: exam.initiated,
                        accessed: exam.accessed
                    })
                });
                await updateDoc(userDocRef, {
                    acessedExams: arrayUnion({
                        id: exam.id,
                        password: exam.password,
                        initiated: exam.initiated,
                        accessed: !exam.accessed
                    })
                });
                globalStore.pushPopup(ADMIN_MSGS.USER_EXAM_UPDATE__SUCCESS(user.email, exam.id), this, 0);
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.USER_EXAM_UPDATE__ERROR, this, 1, { location: "adminStore - updateUserExam(): ", message: error});
            }
        },
        async updateUser(user) {
            try {
                this.updating = true;
				const userDocRef = doc(collection(db, "users"), user.email);

                await updateDoc(userDocRef, {
                    class: user.class,
                    userType: user.userType
                });
                globalStore.pushPopup(ADMIN_MSGS.USER_UPDATE__SUCCESS(user.email), this, 0);
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.USER_UPDATE__ERROR, this, 1, { location: "adminStore - updateUserExam(): ", message: error});
            }
        },
        async deleteUserStartedExam(exam, user) {
			try {
                this.updating = true;
				const userDocRef = doc(collection(db, "users"), user.email);
                await updateDoc(userDocRef, { acessedExams: arrayRemove(exam) });
                user.acessedExams = user.acessedExams.filter(e => JSON.stringify(e) != JSON.stringify(exam))
                globalStore.pushPopup(ADMIN_MSGS.USER_STARTED_EXAM_DELETED__SUCCESS(exam.password, user.email), this, 0);
			} catch (error) {
				globalStore.pushPopup(ADMIN_MSGS.USER_STARTED_EXAM_DELETED__ERROR(exam.password, user.email), this, 0, {location: "adminStore - deleteUserStartedExam(): ", message: error});
			}
        },
        // #endregion

        // #region FUNCTIONS - SOLUTIONS
        async fetchSolutions() {
            try {
                this.updating = true;
                this.solutions = []
                const storageRef = ref(storage, `exams/${this.selectedExam.id}/${this.selectedSolutionPassword}`);
                const storageListResult = await listAll(storageRef);

                this.solutions = await Promise.all(storageListResult.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    return { url, name: itemRef.name };
                }));
                globalStore.pushPopup(ADMIN_MSGS[this.solutions.length > 0 ? "FETCH_SOLLUTIONS__SUCCESS" : "FETCH_SOLLUTIONS_EMPTY__WARNING"], this, 1);
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.FETCH_SOLLUTIONS__ERROR, this, 1, { location: "adminStore - fetchSolutions(): ", message: error});
            }
        },
        async setSelectedSolution(email, url) {
            try {
                if (this.selectedSolutionUrl == url) return;
                this.updating = true;
                this.selectedSolutionUrl = "";

                const response = await fetch(url);

                if (!response.ok) throw new Error('Failed to fetch the text content from the URL');

                const text = await response.text();
                this.selectedSolution = JSON.parse(text);

                if (this.selectedTaskSolution >= this.selectedExam.groups[this.selectedSolution.examData.exam_group].tasks.length)
                    this.selectedTaskSolution = 0;
                this.selectedSolutionUrl = url;

                this.selectedUserSolution = {
                    id: this.selectedExam.id,
                    password: this.selectedSolutionPassword,
                    userEmail: email
                }
                globalStore.pushPopup(ADMIN_MSGS.FETCH_SOLLUTION__SUCCESS(`[${email.replace(/@.*/g, '')}] [${this.selectedExam.title}]`), this, 0);
                this.awaitCodeCopy();
            } catch (error) {
                globalStore.pushPopup(ADMIN_MSGS.FETCH_SOLLUTION__ERROR(url), this, 1, { location: "adminStore - setSelectedSolution(): ", message: error});
            }
        },
        // #endregion

        // #region FUNCTIONS - BATCH EXAMINATION
        addPointsToSolutionTasks(solution) {
            solution.examData.exam_solutions.forEach((value, index, array) => {
                array[index]["points"] = 0;
                array[index]["comment"] = "";
            });
        },
        async startBatchExamination() {
            this.batchSolutions = [];
            let i = 0;
            for (let solution of this.solutions) {
                await this.setSelectedSolution(solution.email, solution.url);
                this.batchSolutions.push(this.selectedSolution);
                this.addPointsToSolutionTasks(this.batchSolutions[i]);
                i++;
            }
            this.batchIndex = 0;
            this.selectBatchSolution(this.batchSolutions[this.batchIndex], this.batchIndex);
            examStore.examMarkdownContent = this.selectedExam.groups[this.selectedSolution.examData.exam_group].tasks;
            examStore.examSet = true;
            router.push('/batch-examination');
        },
        async startExamination(email, url) {
            this.batchSolutions = [];
            await this.setSelectedSolution(email, url);
            this.batchSolutions.push(this.selectedSolution);
            this.addPointsToSolutionTasks(this.batchSolutions[0]);
            this.solutions = this.solutions.filter(s => s.url == url)
            this.batchIndex = 0;
            this.selectBatchSolution(this.batchSolutions[this.batchIndex], this.batchIndex);
            examStore.examMarkdownContent = this.selectedExam.groups[this.selectedSolution.examData.exam_group].tasks;
            examStore.examSet = true;
            router.push('/batch-examination');
        },
        async selectBatchSolution(solution, index) {
            this.batchIndex = index;
            this.selectedSolution = solution;
            examStore.solutions = JSON.parse(JSON.stringify(solution.examData.exam_solutions));
            examStore.examMarkdownContent = this.selectedExam.groups[this.selectedSolution.examData.exam_group].tasks;
            for (let task of examStore.solutions) await examStore.selectTask(task.id);
            await examStore.selectTask(examStore.solutions[0].id);
        },
        async exitExamination() {
            router.push('/admin');
            await wait(0.1);
            this.batchSolutions = [];
            this.batchIndex = 0;
            this.selectedSolutionUrl = "";
            this.selectedSolution = "";
            this.selectedExam = { id: "" };
        },
        // #endregion

        RESET_TO_DEFAULT_VALUES() {
            this.updating = false;
            this.editing = true;

            // USERS
            this.users = [];

            this.userEmailQuery = "";
            this.userTypeQuery = "redovan";
            this.userClassQuery = "PJS";

            this.userEmailFilter = "";
            this.userExamPasswordFilter = "";
            this.userExamTitleFilter = "";
            this.userStartDateFilter = undefined;
            this.userEndDateFilter = undefined;
            this.filteredUsers = [];

            this.expandAllUsers = false;

            // EXAMS
            this.createdExams = [];
            this.examPasswords = {};
            this.examTitleFilter = "";
            this.examPasswordFilter = "";
            this.examAccessFilter = "sve";
            this.examClassFilter = "sve";
            this.examIDFilter = "";
            this.selectedExam = { id: "" };
            this.oldExam = { };
            this.passwordLength = 5;
            this.selectedExamUpToDate = false,

            // SOLUTIONS
            this.solutions = [];
            this.userSolutionsEmailFilter = "";
            this.userSolutionsMatchAccess = false;
            this.selectedSolutionUrl = "";
            this.selectedSolution = "";
            this.selectedTaskSolution = 0;
            this.selectedSolutionPassword = "";
            this.selectedUserSolution = {
                id: "",
                password: "",
                userEmail: ""
            };

            // BATCH EXAMINATION
            this.batchIndex =  0;
            this.batchSolutions =  [];
        },
    },
	persist: true,
});
