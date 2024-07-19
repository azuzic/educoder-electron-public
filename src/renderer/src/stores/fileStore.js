import { defineStore } from "pinia";
import { globalStore, userStore, examStore, adminStore } from "@/main.js";
import cryptoRandomString from "crypto-random-string";

import { db, collection, setDoc, doc, getDoc, updateDoc, arrayUnion } from "@/scripts/firebase.js";
import { extractFromFile, wait, codeCopy } from "@/scripts/helpers.js";
import { FILE_MSGS } from "@/scripts/messages.js"

import skript_1 from "@/assets/skripte/skript_1.md";
import skript_2 from "@/assets/skripte/skript_2.md";
import skript_3 from "@/assets/skripte/skript_3.md";
import skript_4 from "@/assets/skripte/skript_4.md";
import skript_5 from "@/assets/skripte/skript_5.md";
import skript_6 from "@/assets/skripte/skript_6.md";

const skripts = [
    { file: skript_1, visible: false, title: "Javascript osnove" },
    { file: skript_2, visible: false, title: "Funkcije, doseg varijabli i kontrolne strukture" },
    { file: skript_3, visible: false, title: "Strukture podataka - objekti i polja" },
    { file: skript_4, visible: false, title: "Ugniježđene strukture i napredne funkcije" },
    { file: skript_5, visible: false, title: "DOM & JSON" },
    { file: skript_6, visible: false, title: "Asinkrono programiranje" },
]

export const useFileStore = defineStore("fileStore", {
	state: () => ({
        //SCRIPTS
		scripts: [],
		scriptsVisibility: [],
        selectedScript: "",
		selectedScriptMarkdown: "",
        
        // EXAM DATA
		groupIndex: 0,
		taskIndex: 0,
		groups: [ { tasks: [ { taskPoints: 0, taskText: '' } ] } ], 
		exam: {
			title: "",
			course: { name: "Programiranje u skriptnim jezicima", code: "PJS" },
			timeLimit: 0,
			password: "",
            groups: [ { tasks: [ { taskPoints: 0, taskText: '' } ] } ],
			accessLimit: false,
            accessTimeLimit: {
                start: 0,
                end: 0
            },
			createdBy: "",
		},
        passwordLength: 5,
	}),
	actions: {
        // #region SCRIPTS
		async loadScriptsVisibility() {
			try {	
                this.scripts = [];
                for (let skript of skripts) this.scripts.push(skript);
                
				adminStore.updating = true;	
				const scriptsCollection = collection(db, "data");
				const scriptDoc = await getDoc(doc(scriptsCollection, "scripts"));

				if (scriptDoc.exists()) {
					const data = scriptDoc.data().visibility;
					for (let i = 0; i < data.length; i++) 
						this.scripts[i].visible = data[i];
				}
				globalStore.pushPopup(FILE_MSGS.FETCH_SCRIPTS__SUCCESS, adminStore, 1);
                await wait(0.1);
                codeCopy(examStore);
			} catch (error) {		
				globalStore.pushPopup(FILE_MSGS.FETCH_SCRIPTS__ERROR, adminStore, 1, {location: "fileStore - loadScriptsVisibility(): ", message: error});
			}
		},
		async loadScript(file) {
			try {
				adminStore.updating = true;	
				const response = await fetch(file);
                examStore.markdownTab = 'script';
                if (this.selectedScript == file) {        
                    await wait(0.1);
                    codeCopy(examStore);
                    return;
                }
				if (response.ok) {
					this.selectedScript = file;
					this.selectedScriptMarkdown = await response.text();
				    adminStore.updating = false;	
				} else {
                    globalStore.pushPopup(FILE_MSGS.LOAD_SCRIPT__ERROR, adminStore, 1, {location: "fileStore - loadScript(): ", message: error});
				}
                await wait(0.1);
                codeCopy(examStore);
			} catch (error) {
				globalStore.pushPopup(FILE_MSGS.FETCH_SCRIPT__ERROR, adminStore, 1, {location: "fileStore - loadScript(): ", message: error});
			}
		},
        // #endregion
        
        // #region EDITING & CREATING EXAM
        openFileInput() {
            document.getElementById("fileUpload").click();
        },  
        openFileInputJSON() {
            document.getElementById("fileUploadJSON").click();
        },    
		uploadFile(event) {
            try {                
                const file = event.target.files[0];
                const fileTypeName = file.type === "text/plain" || file.name.endsWith(".md");
                if (file && fileTypeName) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const text = e.target.result;
                        this.groups = extractFromFile(text);
                    };
                    reader.readAsText(file);
                    globalStore.pushPopup(FILE_MSGS.FILE_UPLOAD__SUCCESS, adminStore, 0);
                } else {
                    globalStore.pushPopup(FILE_MSGS.FILE_UPLOAD__WARNING, adminStore, 0);
                }
            } catch (error) {
                globalStore.pushPopup(FILE_MSGS.FILE_UPLOAD__ERROR, adminStore, 0, { location: "fileStore - uploadFile(): ", message: error});
            }
		},
		uploadExaminationFile(event) {
            try {                
                const file = event.target.files[0];
                const fileTypeName = file.type === "text/plain" || file.name.endsWith(".md");
                if (file && fileTypeName) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const text = e.target.result;
                        const groups = extractFromFile(text, false);
                        if (groups.length != adminStore.selectedExam.groups.length) return;
                        for (let i = 0; i < groups.length; i++) {
                            if (groups[i].tasks.length != adminStore.selectedExam.groups[i].tasks.length) {                                
                                globalStore.pushPopup(FILE_MSGS.FILE_UPLOAD__ERROR, adminStore, 0);
                                return;
                            }
                        }
                        adminStore.selectedExam.groups = groups;
                        examStore.examMarkdownContent = adminStore.selectedExam.groups[adminStore.selectedSolution.examData.exam_group].tasks;
                    };
                    reader.readAsText(file);
                    globalStore.pushPopup(FILE_MSGS.FILE_UPLOAD__SUCCESS, adminStore, 0);
                } else {
                    globalStore.pushPopup(FILE_MSGS.FILE_UPLOAD__WARNING, adminStore, 0);
                }
            } catch (error) {
                globalStore.pushPopup(FILE_MSGS.FILE_UPLOAD__ERROR, adminStore, 0, { location: "fileStore - uploadFile(): ", message: error});
            }
		},        
        async downloadExcel() {
            let csvContent = "jmbag,ime,prezime,group";
            for (let i = 0; i < adminStore.batchSolutions[0].examData.exam_solutions.length; i++) {
                csvContent += `,task_${i+1},comment_${i+1}`;
            }
            csvContent += ",total points\n";

            // Prepare CSV data
            adminStore.batchSolutions.forEach(batch => {
                const examData = batch.examData;
                let row = `${examData.form.JMBAG},${examData.form.ime},${examData.form.prezime},${examData.exam_group}`;

                batch.examData.exam_solutions.forEach(solution => {
                    row += `,${solution.points},${solution.comment.replace(/,|;|\n/g,' | ')}`;
                });

                // Calculate total points
                const totalPoints = batch.examData.exam_solutions.reduce((acc, solution) => acc + solution.points, 0);
                row += `,${totalPoints}\n`;

                csvContent += row;
            });

            // Create a Blob object with the CSV content
            const bom = "\uFEFF";
            const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8' });

            // Create a temporary URL to the Blob
            const url = window.URL.createObjectURL(blob);

            // Create a link element and simulate a click to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'exam_results.csv');
            document.body.appendChild(link);
            link.click();

            // Clean up by revoking the URL
            window.URL.revokeObjectURL(url);
        },
        downloadJSON() {
            // Iterate over each batch solution
            const selectedData = {
                examStore_examMarkdownContent: examStore.examMarkdownContent,
                examStore_solutions: examStore.solutions,
                examStore_currentSolution: examStore.currentSolution,
                adminStore_batchSolutions: adminStore.batchSolutions,
                adminStore_batchIndex: adminStore.batchIndex,
                adminStore_selectedUserSolution: adminStore.selectedUserSolution,
                adminStore_selectedSolution: adminStore.selectedSolution,
                adminStore_solutions: adminStore.solutions,
                adminStore_selectedExam: adminStore.selectedExam,
            };

            // Convert selectedData array to JSON
            const jsonData = JSON.stringify(selectedData, null, 2);

            // Create a Blob object with the JSON content
            const blob = new Blob([jsonData], { type: 'application/json' });

            // Create a temporary URL to the Blob
            const url = window.URL.createObjectURL(blob);

            // Create a link element and simulate a click to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${adminStore.selectedExam.title}_${adminStore.selectedExam.password}`.replace(/[^\w\+\(\-){1,}]{1,}/g, '-'));
            document.body.appendChild(link);
            link.click();

            // Clean up by revoking the URL
            window.URL.revokeObjectURL(url);
        },
        loadJSON(event) {
            try {                
                const file = event.target.files[0];
                const fileTypeName = file.type === "text/plain" || file.name.endsWith(".json");
                if (file && fileTypeName) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const text = e.target.result;
                        const data = JSON.parse(text);

                        examStore.examMarkdownContent = data.examStore_examMarkdownContent;    
                        examStore.solutions = data.examStore_solutions;
                        examStore.currentSolution = data.examStore_currentSolution;            
                        adminStore.batchSolutions = data.adminStore_batchSolutions;            
                        adminStore.selectedUserSolution = data.adminStore_selectedUserSolution;            
                        adminStore.selectedSolution = data.adminStore_selectedSolution;            
                        adminStore.solutions = data.adminStore_solutions;            
                        adminStore.selectedExam = data.adminStore_selectedExam;                
                     };
                    reader.readAsText(file);
                    globalStore.pushPopup(FILE_MSGS.FILE_UPLOAD__SUCCESS, adminStore, 0);
                } else {
                    globalStore.pushPopup(FILE_MSGS.FILE_UPLOAD__WARNING, adminStore, 0);
                }
            } catch (error) {
                globalStore.pushPopup(FILE_MSGS.FILE_UPLOAD__ERROR, adminStore, 0, { location: "fileStore - uploadFile(): ", message: error});
            }
		},  
		generatePassword() {
			this.exam.password = cryptoRandomString({ length: this.passwordLength, type: "alphanumeric" });
		},
		async deleteSelectedTask() {
			await wait(0.01);
			this.groups[this.groupIndex].tasks.splice(this.taskIndex, 1)
			this.taskIndex = this.groups[this.groupIndex].tasks.length <= this.taskIndex ? this.taskIndex-1 : this.taskIndex;
		},	
        selectGroup(index) {
            this.groupIndex = index;
            this.taskIndex = this.groups[index].tasks.length <= this.taskIndex ? 0 : this.taskIndex;
        },
		async deleteSelectedGroup()  {
			await wait(0.01);
			this.groups.splice(this.groupIndex, 1)
			this.groupIndex = this.groups.length <= this.groupIndex ? this.groupIndex-1 : this.groupIndex;
		},
        
        async setExamPassword() {
            try {
                const createdExamsDocRef = doc(db, "data", "exams");
                await setDoc(createdExamsDocRef, {
                    examPasswords: {
                        [this.exam.id]: {
                            [this.exam.password]: Date.now()
                        }
                    }
                }, { merge: true });
                globalStore.pushPopup(FILE_MSGS.SET_EXAM_PASSWORD__SUCCESS, false, 0);
            } catch (error) {
                globalStore.pushPopup(FILE_MSGS.SET_EXAM_PASSWORD__ERROR, this, 1, {location: "fileStore - setExamPassword(): ", message: error});
            }
        },
		async createNewExam() {
			adminStore.updating = true;
            this.exam.accessTimeLimit.start = new Date(this.exam.accessTimeLimit.start).getTime();
            this.exam.accessTimeLimit.end = new Date(this.exam.accessTimeLimit.end).getTime();
                

            if (this.exam.password == "") this.generatePassword();
			this.exam.id = cryptoRandomString({ length: 20, type: "alphanumeric" });
			this.exam.createdBy = userStore.user.email;
			this.exam.createdTimestamp = Date.now();
			this.exam.groups = this.groups;

			const examDocRef = doc(db, "exams", this.exam.id);
			const examArrayDocRef = doc(db, "data", "exams");

			const shortExam = {
                courseCode: this.exam.course.code,
				id: this.exam.id,
				title: this.exam.title,
				accessLimit: this.exam.accessLimit,
                accessTimeLimit: this.exam.accessTimeLimit,
				password:  this.exam.password,
			}

			try {
				await setDoc(examDocRef, this.exam);

				await updateDoc(examArrayDocRef, {
					createdExams: arrayUnion(shortExam)
				});
                await this.setExamPassword();

				adminStore.createdExams.push(shortExam);
                adminStore.examPasswords[shortExam.id] = {};
                adminStore.examPasswords[shortExam.id][shortExam.password] = Date.now();
				globalStore.pushPopup(FILE_MSGS.SAVE_EXAM__SUCESSS(this.exam.title), adminStore, 1);
			} catch (error) {				
                if (error.code == "not-found") {
                    try {        
                        adminStore.updating = true;                
                        const docRef = doc(db, "data", "exams");
                        await setDoc(docRef, { createdExams: [] });
                        await updateDoc(docRef, { createdExams: arrayUnion(shortExam) });  
				        adminStore.createdExams.push(shortExam);
                        adminStore.examPasswords[shortExam.id] = {};
                        adminStore.examPasswords[shortExam.id][shortExam.password] = Date.now();
				        globalStore.pushPopup(FILE_MSGS.SAVE_EXAM__SUCESSS(this.exam.title), adminStore, 1);
                    } catch (error) {        
				        globalStore.pushPopup(FILE_MSGS.SAVE_EXAM__ERROR, adminStore, 1, {location: "fileStore - createNewExam() - NOT_FOUND: ", message: error});               
                    }
                } else {
					globalStore.pushPopup(FILE_MSGS.SAVE_EXAM__ERROR, adminStore, 1, {location: "fileStore - createNewExam(): ", message: error});
                };
			}
		},
        // #endregion

        // #region RESET
		RESET_TO_DEFAULT_VALUES() {
            //SCRIPTS
			this.scripts = [
				{ file: skript_1, visible: false, title: "Javascript osnove" },
				{ file: skript_2, visible: false, title: "Funkcije, doseg varijabli i kontrolne strukture" },
				{ file: skript_3, visible: false, title: "Strukture podataka - objekti i polja" },
				{ file: skript_4, visible: false, title: "Ugniježđene strukture i napredne funkcije" },
				{ file: skript_5, visible: false, title: "DOM & JSON" },
				{ file: skript_6, visible: false, title: "Asinkrono programiranje" },
			];
			this.scriptsVisibility = [];
			this.selectedScript = "";
			this.selectedScriptMarkdown = "";
            
            // EXAM DATA
			this.groupIndex = 0;
			this.taskIndex = 0;
			this.groups = [ { tasks: [ {taskPoints: 0, taskText: ''} ] } ];
			this.exam = {
				title: "",
				course: { name: "Programiranje u skriptnim jezicima", code: "PJS" },
				timeLimit: 0,
				password: "",
				groups: [ { tasks: [ {taskPoints: 0, taskText: ''} ] } ],
				accessLimit: false,
                accessTimeLimit: {
                    start: 0,
                    end: 0
                },
				createdBy: "",
			};
            this.passwordLength = 5;
		},
        // #endregion
	},
	persist: true,
});
