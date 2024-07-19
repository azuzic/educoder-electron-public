import { defineStore } from "pinia";
import { wait } from "@/scripts/helpers.js";

export const useGlobalStore = defineStore("globalStore", {
	state: () => ({
		EduCoderVersion: "1.2.0", //change EduCoderVersion in src/components/App/EC_VisibilityAuthChange.vue
        debugOpen: false,
        UnderConsturction: false,
		popups: [],
		storeSelected: "globalStore",
        depth: 1,
		tooltip: {
			content: "",
			offsetx: 0,
			offsety: 0,
			css: "",
			type: "top",
		},
        showSettings: false,
        consoleJSON: true,
        consoleJSONdepth: 0,
        showConsoleVariableType: false,
        groupLogMessaged: false,
        windowsHidden: {
            "HTML": false,
            "JS": false,
            "PREVIEW": false,
            "MARKDOWN": false,
            "LOG": false
        },
		draggable1: [
		],
		draggable2: [
			{
				id: "1",
				type: "HTML",
			},
			{
				id: "2",
				type: "JS",
			},
			{
				id: "3",
				type: "LOG",
			},
        ],
		draggable3: [
			{
				id: "4",
				type: "MARKDOWN",
			},
			{
				id: "5",
				type: "PREVIEW",
			},
        ],
		draggable4: [
		],
		isDragging: false,
        refreshDraggable: [false,false,false,false],

		selectedLightTheme: "chrome",
		selectedDarkTheme: "tomorrow_night",

		isDarkMode: false,
		themeChanging: false,

		HTMLfontSize: 12,
		JSfontSize: 12,
		LOGfontSize: 12,
		PREVIEWSize: 1,
        MARKDOWNSize: 1,

		HTMLtabSize: "4",
		JStabSize: "2",
        test: {}
	}),

	actions: {
        zoom(type, value) {
            const sharedFontProperties = ["LOG", "HTML", "JS"];
            const fontSizeProperties = {
                "JS": "JSfontSize",
                "HTML": "HTMLfontSize",
                "LOG": "LOGfontSize",
                "PREVIEW": "PREVIEWSize",
                "MARKDOWN": "MARKDOWNSize",
            };
            const fontSizeProperty = fontSizeProperties[type];

            if (sharedFontProperties.includes(type)) {
                this[fontSizeProperty] += value;
                this[fontSizeProperty] = Math.max(10, Math.min(48, this[fontSizeProperty]));
            } else {
                if (this[fontSizeProperty] == 1 && value < 0) return
                this[fontSizeProperty] += value / 20;
                this[fontSizeProperty] = Math.min(3, Math.max(1, this[fontSizeProperty]));
            }
        },
        setTooltip(content = "", type = "top", css = "justify-center", offset = [0,0]) {
            this.tooltip = {                
                content: content,
                offsetx: offset[0],
                offsety: offset[1],
                css: css,
                type: type,
            }
        },
        async initiateDragging() {
            this.isDragging = true;
            const draggables = [this.draggable1, this.draggable2, this.draggable3, this.draggable4];
            const tempDraggables = draggables.map(draggable => JSON.stringify(draggable));
            
            while (this.isDragging) {
                await wait(0.1);
                for (let i = 0; i < draggables.length; i++) {
                    if (tempDraggables[i] !== JSON.stringify(draggables[i])) {                        
                        this.refreshDraggable[i] = true;
                        await this.$nextTick;
                        this.refreshDraggable[i] = false;
                        this.isDragging = false;
                    }
                }
            }
        },
		copyHTMLTemplateToClipboard() {
			let HTMLTemplate = 
`<style>\n    /* CSS sadržaj ovdje */\n</style>

<body>
    <!-- HTML sadržaj ovdje -->
    <h1>Hello world!</h1>
</body>`;
			navigator.clipboard
				.writeText(HTMLTemplate)
				.then(() => {
					//console.log("HTML template copied to clipboard!");
				})
				.catch((err) => {
					console.error("Error in copying text: ", err);
				});
		},
        resetDraggables() {
            this.draggable1 = [
            ];
            this.draggable2 = [
                {
                    id: "1",
                    type: "HTML",
                },
                {
                    id: "2",
                    type: "JS",
                },
                {
                    id: "5",
                    type: "LOG",
                },
            ];
            this.draggable3 = [
                {
                    id: "3",
                    type: "MARKDOWN",
                },
                {
                    id: "4",
                    type: "PREVIEW",
                },
            ];
            this.draggable4 = [
            ];    
        },
		async resetLayout() {
            for (let index = 0; index < 3; index++) {  
                this.HTMLfontSize = 12;
                this.JSfontSize = 12;
		        this.LOGfontSize = 12,
                this.consoleJSON = true,
                this.consoleJSONdepth = 0;
                this.markdownFontSize = 12;   
                this.showConsoleVariableType = false,     
                this.groupLogMessaged = false,      
		        this.PREVIEWSize = 1;              
		        this.MARKDOWNSize = 1;      
                this.selectedLightTheme = "chrome";
                this.selectedDarkTheme = "tomorrow_night";
                this.resetDraggables();  
                let divElement;
                divElement = document.getElementById("draggableid1");
                divElement.style.width = "0%";
                divElement = document.getElementById("draggableid3");
                divElement.style.width = "50%";
                divElement = document.getElementById("draggableid4");
                divElement.style.width = "0%";
                let divElements = document.getElementsByClassName("window");
                divElements.forEach((element) => { element.style.height = "50%"; });	
                divElement = document.getElementById("draggableid2");
                divElement.style.width = "50%";			
                divElements = divElement.getElementsByClassName("window");
                divElements.forEach((element) => { element.style.height = ""+100/3+"%"; });
                this.windowsHidden = {
                    "HTML": false,
                    "JS": false,
                    "PREVIEW": false,
                    "MARKDOWN": false,
                    "LOG": false
                };
                await wait(0.1);
            }
		},
		async pushPopup(popup, store=false, time=0, error={location:"",message:""}) {
            if (error.location != "") console.error(error.location, error.message);
			this.popups.push({
				type: popup.type,
				message: popup.message,
			});
            this.removePopup();
            if (store) {
                await wait(time);
                store.updating = false;
            }
		},
        async removePopup() {
			await wait(5);
			this.popups.splice(0, 1);
        },
		async toggleTheme() {
			this.themeChanging = true;
			this.isDarkMode = !this.isDarkMode;
			await wait(0.3);
			this.themeChanging = false;
		},
	},
	persist: true,
});
