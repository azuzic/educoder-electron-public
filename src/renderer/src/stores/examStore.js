import { globalStore, userStore } from "@/main.js";
import { defineStore } from "pinia";
import { db, collection, setDoc, getDoc, doc, storage, ref, uploadBytes, updateDoc, arrayRemove, arrayUnion } from "@/scripts/firebase.js";
import { formatDateTime, formatTime, wait, codeCopy } from "@/scripts/helpers.js";
import { EXAM_MSGS } from "@/scripts/messages.js"
import { formatError, getCodeAlertType, getOutput, highlightError } from "@/scripts/codeEvaluation.js"

// 5 different EduCoder modes of operation
const MODES = {
	IDLE: "IDLE", // No exam set | No exam in progress
	EXAM_WITH_TIME_LIMIT: "EXAM_WITH_TIME_LIMIT", // Access limited | Time limit | Set exam
	EXAM_WITHOUT_TIME_LIMIT: "EXAM_WITHOUT_TIME_LIMIT", // Access limited | No time limit | Set exam
	PRACTICE_WITH_TIME_LIMIT: "PRACTICE_WITH_TIME_LIMIT", // Unlimited access | Time limit | Set exam
	PRACTICE_WITHOUT_TIME_LIMIT: "PRACTICE_WITHOUT_TIME_LIMIT", // Unlimited access | No time limit | Set exam
	SANDBOX: "SANDBOX", // No access limit | No time limit | No set exam
};

export const useExamStore = defineStore("examStore", {
	state: () => ({
		EDU_CODER_MODE: MODES.IDLE,

        // #region DATA - ADMIN
		localExamDownloadEnabled: true, //FOR ADMINS ONLY
		antiCheatDetectionEnabled: true, //FOR ADMINS ONLY
		antiCheatCopyPasteLimitEnabled: true, //FOR ADMINS ONLY
        bypassTimeCheckEnabled: false, //FOR ADMINS ONLY
        bypassExamAccessLimitEnabled: false, //FOR ADMINS ONLY
        // #endregion

		// #region DATA - CHECKS
		examSet: false,
		examInProgress: false,
		mouseOnIframe: false,
		markdownTab: "task",
		// #endregion

		// #region DATA - TIMER AND ALERTS
		examStartTime: 0,
		remainingTime: 0,
		timerInterval: 0,
        copiedCode: "",
		codeAlert: "good",
		upozorenje: false,
		preventUpozorenje: false,

		options: {
			autoEvaluation: true,
			maxIterations: 500,
			evaluator: "javascript",
		},
        // #endregion

		// #region DATA - EXAM DATA & SOLUTIONS
		examData: {
			title: "",
			course: { name: "Programiranje u skriptnim jezicima", code: "PJS" },
			password: "",
			text: "",
			timeLimit: 0,
			accessLimit: false,
			accessTimeLimit: {
				start: Date.now(),
				end: Date.now()
			},
			createdBy: "",
		},
        group: 0,
		tasks: [],
		examMarkdownContent: [],
		solutions: [
			{
				id: 1,
				html_code: "",
				js_code: "",
				status: "Nije započet",
			},
		],
		currentSolution: 1,
		logMessages: [],
		form: {},
		userAcessedExams: []
		// #endregion

	}),
	actions: {
		// #region FUNCTIONS - OTHER
		SET_EduCoder_MODE({ mode, timeLimit, accessLimit }) {
			if (mode && mode != "null") {
				if (Object.values(MODES).includes(mode)) this.EDU_CODER_MODE = mode;
				else console.error("Invalid EduCoder mode:", mode);
				return;
			}

			const numericTimeLimit = Number(timeLimit);
			const hasTimeLimit = numericTimeLimit > 0;
			const hasAccessLimit = accessLimit === true || accessLimit === "true";

			this.EDU_CODER_MODE = hasAccessLimit
                ? (hasTimeLimit ? MODES.EXAM_WITH_TIME_LIMIT : MODES.EXAM_WITHOUT_TIME_LIMIT)
                : (hasTimeLimit ? MODES.PRACTICE_WITH_TIME_LIMIT : MODES.PRACTICE_WITHOUT_TIME_LIMIT);
		},
		getExamDescription() {
            if (!this.examSet) return "";

            const descriptions = {
                '11': "Ispit s ograničenim pristupom (1) i vremenskim ograničenjem.",
                '10': "Zadatak za vježbu s neograničenim pristupom, ali s vremenskim ograničenjem.",
                '01': "Ispit s ograničenim pristupom (1) i bez vremenskog ograničenja.",
                '00': "Zadatak za vježbu s neograničenim pristupom i bez vremenskog ograničenja"
            };

            const isTimeLimitSet = Number(this.examData.timeLimit) > 0 ? '1' : '0';
            const isAccessLimitSet = this.examData.accessLimit ? '1' : '0';
            const descriptionKey = isTimeLimitSet.concat(isAccessLimitSet);

            return descriptions[descriptionKey];
        },
        async selectTask(id) {
            this.markdownTab = 'task';
            this.currentSolution = id;
            await wait(0.1)
            codeCopy(this);
            await this.evaluateCode();
        },
		clearExamData() {
			this.examData = {
				title: "",
				course: { name: "Programiranje u skriptnim jezicima", code: "PJS" },
				password: "",
				id: "",
				text: "",
				accessLimit: false,
				accessTimeLimit: {
					start: Date.now(),
					end: Date.now()
				},
				timeLimit: 0,
				createdBy: "",
			};
            this.examSet = false;
			this.tasks = [];
		},
		resetAndClear() {
			if (this.timerInterval) {
				clearInterval(this.timerInterval);
				this.timerInterval = null;
			}
			this.RESET_TO_DEFAULT_VALUES();
		},
		enterSandbox() {
			this.SET_EduCoder_MODE({ mode: MODES.SANDBOX });
			this.setupTimer();
		},
        // #endregion

		// #region FUNCTIONS - CODE EVALUATION
		async evaluateCode() {
			this.solutions[this.currentSolution - 1].status = "U tijeku";

			const code = this.solutions[this.currentSolution - 1].js_code;
            const response = await window.api.codeEvaluation({lang: this.options.evaluator, code: code});

            this.logMessages = getOutput(response);
            const error = formatError(this.options.evaluator, response.error);
            this.codeAlert = getCodeAlertType(error.errorType, response.error);

            highlightError(error);

            if (this.codeAlert != "OK") this.logMessages.push({ type: error.errorType, msg: error.errorMessageDetail });
		},
		// #endregion

        // #region FUNCTIONS - TIMER
		updateRemainingTime() {
			const timePassed = Math.floor((Date.now() - this.examStartTime) / 1000);
			const totalTime = Number(this.examData.timeLimit) * 60;
			this.remainingTime = Math.max(totalTime - timePassed, -1);
			if (this.remainingTime === 0) {
				this.remainingTime = -1;
				this.endExam({ requireConfirmation: false })
			}
		},
		setupTimer() {
			const unlimitedTimeModes = [MODES.EXAM_WITHOUT_TIME_LIMIT, MODES.PRACTICE_WITHOUT_TIME_LIMIT, MODES.SANDBOX];
            if (unlimitedTimeModes.includes(this.EDU_CODER_MODE)) {
                this.remainingTime = "Bez ograničenja";
                return false;
            }

			this.updateRemainingTime();
			this.timerInterval = setInterval(() => {
				this.updateRemainingTime();
			}, 1000);
			return true;
		},
		// #endregion

        // #region FUNCTIONS - EXAM
        async fetchExamDataFromFirestore(password) {
			try {
                const docRef = doc(db, "data", "exams");

                const docSnap = await getDoc(docRef);
                const createdExams = docSnap.data().createdExams;

                const createdExamsFilter = createdExams.filter((exam) => exam.password == password);

                if (createdExamsFilter.length <= 0) {
					globalStore.pushPopup(EXAM_MSGS.EXAM_NOT_FOUND__WARNING(password), false, 0);
					return;
                }

				const examDocRef = doc(db, "exams", createdExamsFilter[0].id);
				const docSnapshot = await getDoc(examDocRef);

				if (!docSnapshot.exists()) {
					globalStore.pushPopup(EXAM_MSGS.EXAM_NOT_FOUND__WARNING(password), false, 0);
					return;
				}

				this.examData = docSnapshot.data();
                this.examSet = true;

				globalStore.pushPopup(EXAM_MSGS.EXAM_FETCH__SUCCESS(password), false, 0);
			} catch (error) {
				globalStore.pushPopup(EXAM_MSGS.EXAM_FETCH__ERROR, false, 0, {location: "examStore - fetchExamDataFromFirestore(): ", message: error});
			}
		},
        async setupExam() {
                document.documentElement.requestFullscreen?.();
                this.setupTimer();
                await this.selectTask(1);
        },
		fillTasks() {
			this.solutions = [];
			for (let index = 1; index <= Number(this.tasks.length); index++) {
				this.solutions.push({
					id: index,
					html_code: "",
					js_code: "",
					status: "Nije započet",
				});
			}
			this.currentSolution = 1;
			this.examMarkdownContent = this.tasks;
		},
		async isExamInitiated() {
			try {
                if (this.bypassExamAccessLimitEnabled) return false;
                const user = userStore.user;
                if (!user || !user.email) return false;

                const userDocRef = doc(collection(db, "users"), user.email);
                const userDocs = await getDoc(userDocRef);
				this.userAcessedExams = userDocs.data()?.acessedExams

				if (this.userAcessedExams != undefined) {
					const examInitiated = this.userAcessedExams.some(exam => exam.id == this.examData.id && exam.initiated);
					return examInitiated;
				} else {
					await setDoc(doc(collection(db, "users"), user.email), { acessedExams: [] });
					this.userAcessedExams = [];
					return false
				}

            } catch (error) {
				globalStore.pushPopup(EXAM_MSGS.EXAM_START__ERROR(this.examData.password), false, 0, {location: "examStore - isExamInitiated(): ", message: error});
			}
		},
		async setExamInstantiated() {
			try {
				const user = userStore.user;
				const userDocRef = doc(collection(db, "users"), user.email);
				const userDoc = await getDoc(userDocRef);

				if (userDoc.exists()) {

					if (this.userAcessedExams.length != 0) {
						const acessedExamOld = this.userAcessedExams.filter( e => e.id == this.examData.id)[0]
                        if (acessedExamOld != undefined) await updateDoc(userDocRef, { acessedExams: arrayRemove(acessedExamOld) });
					}
					const acessedExamNew = {
						id: this.examData.id,
                        password: this.examData.password,
						initiated: true,
						accessed: Date.now()
					}
                    await updateDoc(userDocRef, {
                        acessedExams: arrayUnion(acessedExamNew)
                    });
					globalStore.pushPopup(EXAM_MSGS.EXAM_STARTED__SUCCESS(this.examData.password), false, 0);
				} else globalStore.pushPopup(EXAM_MSGS.EXAM_START__WARNING(this.examData.password), false, 0);
			} catch (error) {
				globalStore.pushPopup(EXAM_MSGS.EXAM_START__ERROR(this.examData.password), false, 0, {location: "examStore - setExamInstantiated(): ", message: error});
			}
		},
		async startExam(form) {
			this.form = form;
            if (this.examInProgress) {
                await this.setupExam();
                return;
            }

            this.group = Math.floor(Math.random() * this.examData.groups.length);
            this.tasks = this.examData.groups[this.group].tasks;
            this.fillTasks();

            if (!this.examData.password) {
                globalStore.pushPopup(EXAM_MSGS.EXAM_START__WARNING(this.examData.password), false, 0);
                return;
            }

            const examInitiated = await this.isExamInitiated();
            if (examInitiated) {
                if (this.examData.accessLimit) {
                        globalStore.pushPopup(EXAM_MSGS.EXAM_LIMITED_ACCESS__WARNING, false, 0);
                        return;
                }
                this.EDU_CODER_MODE = MODES.PRACTICE;
            } else await this.setExamInstantiated(this.examData.password);

            this.SET_EduCoder_MODE({ timeLimit: this.examData.timeLimit, accessLimit: this.examData.accessLimit });

            if (this.EDU_CODER_MODE != MODES.SANDBOX) {
                this.examInProgress = true;
                this.examMarkdownContent = this.tasks;
                this.examStartTime = Date.now();
            }

			await this.setupExam();
		},
		async endExam({ requireConfirmation = true } = {}) {
			const endExamProcess = async () => {
				this.examInProgress = false;
				clearInterval(this.timerInterval);
				await this.downloadCode();
				this.resetAndClear();
				alert("Ispit je završen. Vaše rješenje je pohranjeno.");
			};

			if (requireConfirmation) {
                let rememberUpozorenje = this.upozorenje;
                let rememberPreventUpozorenje = this.preventUpozorenje;
				if (confirm("Jeste li sigurni da želite završiti ispit. Vaše rješenje će biti pohranjeno AUTOMATSKI. Kopiju rješenja preuzmite i lokalno kao sigurnosnu kopiju."))
                    endExamProcess();
                else {
                    this.upozorenje = false;
                    this.preventUpozorenje = false;
                    await wait(0.1)
                    this.upozorenje = rememberUpozorenje;
                    this.preventUpozorenje = rememberPreventUpozorenje;
                }
			} else endExamProcess();
		},
		// #endregion

		// #region FUNCTIONS - CODE UPLOAD & DOWNLOAD
		async uploadSolutionToFireStore(combinedBlob) {
			try {
                const user = userStore.user;

                if (!user.email || !this.examData.password) return;

                const storageRef = ref(storage, `exams/${this.examData.id}/${this.examData.password}/${user.email}.json`);
				await uploadBytes(storageRef, combinedBlob);
                globalStore.pushPopup(EXAM_MSGS.EXAM_UPLOAD__SUCCESS(this.examData.password), false, 0);
			} catch (error) {
                globalStore.pushPopup(EXAM_MSGS.EXAM_UPLOAD__ERROR(this.examData.password), false, 0, {location: "examStore - uploadSolutionToFireStore(): ", message: error});
			}
		},
		invokeDownload(blob, filename) {
			if (!this.localExamDownloadEnabled) return;
			let downloadLink = document.createElement("a");
			downloadLink.href = URL.createObjectURL(blob);
			downloadLink.download = filename;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
			URL.revokeObjectURL(downloadLink.href);
		},
		async downloadCode() {
			let blobContentForFirebase = {
				examData: {
					exam_start: this.examStartTime,
					exam_end: Date.now(),
                    exam_group: this.group,
                    exam_id: this.examData.id,
					form: this.form,
					exam_solutions: this.solutions,
				}
			};
            let blobContentForLocalDownload = `Email: ${userStore.user.email}`
			if (this.form.ime != undefined) {
                blobContentForLocalDownload += `\nIspit započet u ${formatDateTime(this.examStartTime)} završen u ${formatDateTime(Date.now())} u ${formatTime(Date.now() - this.examStartTime)}`;
                blobContentForLocalDownload += `\nIme i prezime: ${this.form.ime} ${this.form.prezime}`
                blobContentForLocalDownload += `\nJMBAG: ${this.form.JMBAG}`
                blobContentForLocalDownload += `\nŠifra: ${this.form.password}`
            }
            blobContentForLocalDownload += `\n\nRiješenja:`;

            for (let i = 0; i < this.solutions.length; i++) {
                const solution = this.solutions[i];
                blobContentForLocalDownload += `\n\n|=============================================|\nZADATAK ${i+1}.`
                if (solution.html_code != "") blobContentForLocalDownload += `\n\n#HTML\n${solution.html_code}`
                if (solution.js_code != "") blobContentForLocalDownload += `\n\n#JS\n${solution.js_code}`
            }

			let JSON_FirebaseBlob = new Blob([JSON.stringify(blobContentForFirebase)], { type: "text/plain" });
			let JSON_LocalBlob = new Blob([blobContentForLocalDownload], { type: "text/plain" });

			await this.uploadSolutionToFireStore(JSON_FirebaseBlob);

			if (this.EDU_CODER_MODE === "SANDBOX") {
				this.invokeDownload(JSON_LocalBlob, `[${new Date().toLocaleDateString('hr-HR') + " - " + new Date().toLocaleTimeString('hr-HR')}]_educoder_sandbox.txt`);
			} else this.invokeDownload(JSON_LocalBlob, `${userStore.user.uid}_${this.examData.password}_solutions.txt`);
		},
		// #endregion

        RESET_TO_DEFAULT_VALUES() {
			this.EDU_CODER_MODE = MODES.IDLE;
			this.localExamDownloadEnabled = true;
			this.antiCheatDetectionEnabled = true;
			this.antiCheatCopyPasteLimitEnabled = true;
            this.bypassTimeCheckEnabled = false;
            this.bypassExamAccessLimitEnabled = false;

			this.examSet = false;
			this.examInProgress = false;
			this.mouseOnIframe = false;

			this.examStartTime = 0;
			this.remainingTime = -1;
			this.codeAlert = "good";
            this.copiedCode = "";

			this.examData = {
				title: "",
				course: { name: "Programiranje u skriptnim jezicima", code: "PJS" },
				password: "",
				text: "",
				timeLimit: 0,
				accessLimit: false,
				accessTimeLimit: {
					start: Date.now(),
					end: Date.now()
				},
				createdBy: "",
			};
			this.group = 0;

			this.tasks = [];
			this.examMarkdownContent = [];

			this.solutions = [
				{
					id: 1,
					html_code: "",
					js_code: "",
					status: "Nije započet",
				},
			];
			this.currentSolution = 1;
			this.markdownTab = "task";

			this.options = {
				autoEvaluation: true,
				maxIterations: 500,
			    evaluator: "javascript",
			};
			this.upozorenje = false;
			this.preventUpozorenje = false;
			this.logMessages = [];
			this.timerInterval = 0;
			this.form = {};
			this.userAcessedExams = [];
		}
	},
	persist: true,
});
