<script setup>
import { computed } from "vue";
import { adminStore, fileStore, globalStore } from "@/main.js";

const changed = computed(() => {
	return (JSON.stringify(fileStore.groups) != JSON.stringify(adminStore.selectedExam.groups) ||
            JSON.stringify(adminStore.selectedExam) != JSON.stringify(adminStore.oldExam)) &&
            !(adminStore.selectedExam.password == '' || adminStore.selectedExam.title == '' ||
            adminStore.createdExams.some(e => e.password == adminStore.selectedExam.password && e.password != adminStore.oldExam.password) ||
            adminStore.createdExams.some(e => e.title == adminStore.selectedExam.title && e.title != adminStore.oldExam.title))
});
const checkPoints = computed(() => {
    let sum = 0;
    for (const task of fileStore.groups[fileStore.groupIndex].tasks) sum += task.taskPoints;
    return sum;
})
const checkPassword = computed( () => {
    if (adminStore.examPasswords[adminStore.selectedExam.id] != undefined) {
        return true
    }
    else {
        adminStore.fixExamPassword(adminStore.selectedExam.id, adminStore.selectedExam.password);
        return false
    }
})
</script>
<template>
    <div class="flex flex-col wh-full overflow-auto pt-2 pb-4 px-4" :class="!adminStore.selectedExamUpToDate ? 'cursor-not-allowed opacity-25' : ''">   
        <div class="flex flex-col w-full" :class="!adminStore.selectedExamUpToDate ? 'pointer-events-none' : ''">
			
            <!-- TIMESTAMPS -->
            <div v-if="adminStore.selectedExam.createdBy && adminStore.selectedExam.createdTimestamp" class="text-neutral-600 dark:text-neutral-400"> 
			    <b class="px-3">•</b> Izradio korisnik: <u class="text-green-600"> {{adminStore.selectedExam.createdBy}}</u> 
                <i class="text-green-600">
                    {{ 
                        ' | ' + new Date(adminStore.selectedExam.createdTimestamp).toLocaleDateString("hr") + ' - ' + 
                        new Date(adminStore.selectedExam.createdTimestamp).getHours() + 'h ' +
                        new Date(adminStore.selectedExam.createdTimestamp).getMinutes() + 'm ' +
                        new Date(adminStore.selectedExam.createdTimestamp).getSeconds() + 's'
                    }}
                </i>
            </div>
            <div v-if="adminStore.selectedExam.lastUpdatedBy && adminStore.selectedExam.lastUpdatedTimestamp" class="text-neutral-600 dark:text-neutral-400"> 
                <b class="px-3">•</b> Zadnji ažurirao korisnik: <u class="text-sky-600"> {{adminStore.selectedExam.lastUpdatedBy}}</u> 
                    <i class="text-sky-600">
                        {{
                            ' | ' + new Date(adminStore.selectedExam.lastUpdatedTimestamp).toLocaleDateString("hr") + " - " +
                            new Date(adminStore.selectedExam.lastUpdatedTimestamp).getHours() + 'h ' +
                            new Date(adminStore.selectedExam.lastUpdatedTimestamp).getMinutes() + 'm ' +
                            new Date(adminStore.selectedExam.lastUpdatedTimestamp).getSeconds() + 's'
                        }}
                    </i>
            </div>

            <!-- ID -->
            <div class="flex gap-2 items-center">
                <EC_InputLabel title="ID: "/>
                <EC_Input v-model="adminStore.selectedExam.id" class="h-6" type="text" readonly/>
            </div>

            <!-- SUBJECT -->
            <EC_InputLabel title="Kolegij" description="Odaberite kolegij za koji želite učitati zadatak" />
            <EC_Dropdown
                v-model="adminStore.selectedExam.course"
                labelName="name"
                :list="[
                    { name: 'Programiranje u skriptnim jezicima', code: 'PJS' },
                    { name: 'Programsko inženjerstvo', code: 'PI' },
                ]" />

            <!-- TITLE -->
            <EC_InputLabel class="mt-4" title="Naziv zadatka" description="Unesite naziv zadatka koji će se prikazivati studentima" />
            <EC_Input v-model="adminStore.selectedExam.title" type="text" name="title" id="title" autocomplete="title" />
            <span v-if="adminStore.createdExams.some(e => e.title == adminStore.selectedExam.title && e.title != adminStore.oldExam.title)"
                class="text-rose-500 font-bold text-xs">Ispit s istim nazivom već postoji!</span>
            <span v-if="adminStore.selectedExam.title == ''" class="text-rose-500 font-bold text-xs">Naziv ne smije biti prazan!</span>

            <!-- TIME LIMIT -->
            <EC_InputLabel class="mt-4" title="Vremensko ograničenje" description="Unesite vremensko ograničenje za rješavanje zadatka u <b>minutama</b>. <br> Za <b>neograničeno</b> vrijeme ostaviti <code class='text-sky-500 font-bold'>0</code>"/>
			<EC_NumberInput class="w-fit" :min="0" v-model="adminStore.selectedExam.timeLimit"/>
            <span :class="adminStore.selectedExam.timeLimit == '' ? 'opacity-100' : 'opacity-0'" 
                class="text-sky-500 font-bold text-sm transition-150 overflow-hidden">
                Neograničeno vrijeme!
            </span>

            <!-- TYPE -->
            <EC_InputLabel class="mt-4" title="Pristupno ograničenje" />
            <div class="flex gap-2 text-sm items-center dark:text-neutral-300 text-gray-800">
                <EC_CheckBox v-model="adminStore.selectedExam.accessLimit" />
				<span v-if="!adminStore.selectedExam.accessLimit">Zadatak je samo <b class="text-sky-500">vježba</b> (<i>neograničeni broj pokušaja</i>)</span>
				<span v-else>Zadatak je <b class="text-sky-500">ispit</b> (<i>samo 1 pokušaj</i>)</span>
            </div>
            <div v-if="adminStore.selectedExam.accessLimit" class="flex w-full gap-2 -mt-4">                
                <div class="flex flex-col grow">
                    <EC_InputLabel class="mt-4" title="" description="Početak pristupa ispitu"/>
                    <VueDatePicker :dark="globalStore.isDarkMode" v-model="adminStore.selectedExam.accessTimeLimit.start"/>
                </div>
                <div class="flex flex-col grow">
                    <EC_InputLabel class="mt-4" title="" description="Kraj pristupa ispitu"/>
                    <VueDatePicker :dark="globalStore.isDarkMode" v-model="adminStore.selectedExam.accessTimeLimit.end"/>
                </div>
            </div>
            <div v-if="adminStore.selectedExam.accessLimit" class="dark:text-neutral-300 text-gray-800 mt-1">
                <span v-if="(adminStore.selectedExam.accessTimeLimit.start != 0 && adminStore.selectedExam.accessTimeLimit.start != null) || (adminStore.selectedExam.accessTimeLimit.end != 0 && adminStore.selectedExam.accessTimeLimit.end != null)">Pristup: </span> 
                <span v-else>Pristup: <b class="text-sky-600">bilokada</b></span>

                <b v-if="adminStore.selectedExam.accessTimeLimit.start != 0 && adminStore.selectedExam.accessTimeLimit.start != null"> {{ ' od ' }} </b>

                <span v-if="adminStore.selectedExam.accessTimeLimit.start != 0 && adminStore.selectedExam.accessTimeLimit.start != null" class="text-sky-600">
                    {{ new Date(adminStore.selectedExam.accessTimeLimit.start).toLocaleDateString("hr") }}
                    {{ new Date(adminStore.selectedExam.accessTimeLimit.start).toLocaleTimeString("hr") }}
                </span>

                <b v-if="adminStore.selectedExam.accessTimeLimit.end != 0 && adminStore.selectedExam.accessTimeLimit.end != null"> {{ ' do ' }} </b>

                <span v-if="adminStore.selectedExam.accessTimeLimit.end != 0 && adminStore.selectedExam.accessTimeLimit.end != null" class="text-rose-600">
                    {{ new Date(adminStore.selectedExam.accessTimeLimit.end).toLocaleDateString("hr") }}
                    {{ new Date(adminStore.selectedExam.accessTimeLimit.end).toLocaleTimeString("hr") }} 
                </span>
            </div>

            <!-- PASSWORD -->
            <div class="flex gap-4 w-full justify-start items-end">
                <div class="flex flex-col grow">                    
                    <EC_InputLabel class="mt-4" title="Šifra zadatka" description="Unesite šifru zadatka putem koje će studenti pristupati točno ovom zadatku." />
                    <EC_Input v-model="adminStore.selectedExam.password" class="w-full h-9" type="pasword" name="password" id="password" />
                </div>
                <div class="flex flex-col">                    
                    <EC_InputLabel class="mt-4" title="" description="Duljina šifre" />
                    <EC_NumberInput class="w-fit h-9" :min="1" :max="100" v-model="adminStore.passwordLength"/>
                </div>
                <EC_Button @click="adminStore.generatePassword" class="whitespace-nowrap h-9" bg="green"> Generiraj šifru <i class="fa-solid fa-key"></i> </EC_Button>
                <EC_Button :disabled="adminStore.selectedExam.password == adminStore.oldExam.password" 
                    @click="adminStore.selectedExam.password = adminStore.oldExam.password"
                    class="whitespace-nowrap h-9" :bg="adminStore.selectedExam.password == adminStore.oldExam.password ? '' : 'red'"> Resetiraj šifru <i class="fa-solid fa-key"></i> </EC_Button>
            </div>
            <span v-if="adminStore.createdExams.some(e => e.password == adminStore.selectedExam.password && e.password != adminStore.oldExam.password)"
                class="text-rose-500 font-bold text-xs">Ispit s istom šifrom već postoji!</span>
            <span v-if="adminStore.selectedExam.password == ''"
                class="text-rose-500 font-bold text-xs">Šifra ne smije biti prazna!</span>
            <EC_InputLabel title="" description="Trenutna šifra za ovaj ispit:" />
            <div class="flex flex-wrap gap-1 mb-4">
                <div @click="adminStore.selectedExam.password = adminStore.oldExam.password"
                    :class="adminStore.oldExam.password == adminStore.selectedExam.password ? 'dark:bg-sky-700 bg-sky-500' : 'dark:bg-neutral-700 bg-neutral-50'"
                    class="rounded-full text-xs px-1.5 text-neutral-950 dark:text-neutral-300 opacity-75 hover:opacity-100 transition-150 cursor-pointer">
                    {{adminStore.oldExam.password}}
                </div>
            </div>
            <div v-if="checkPassword">
                <EC_InputLabel class="-mt-4" v-if="Object.keys(adminStore.examPasswords[adminStore.selectedExam.id]).length > 1" title="" description="Prošle šifre za ovaj ispit:" />
                <div class="flex flex-wrap gap-1 mb-4">
                    <div v-for="id, sifra in adminStore.examPasswords[adminStore.selectedExam.id]"
                            :class="[sifra != adminStore.oldExam.password ? '' : 'hidden',
                                sifra == adminStore.selectedExam.password ? 'dark:bg-sky-700 bg-sky-500' : 'dark:bg-neutral-700 bg-neutral-50']"
                            @click="adminStore.selectedExam.password = sifra"
                            class="rounded-full text-xs px-1.5 text-neutral-950 dark:text-neutral-300 opacity-75 hover:opacity-100 transition-150 cursor-pointer">
                        {{sifra}}
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-2 mb-4">
                
                <!-- GRUPE -->
                <EC_InputLabel title="Grupe:" description="" class="whitespace-nowrap" /> 
                <div class="flex flex-wrap gap-2 w-full -mt-2">
                    <EC_Button :disabled="!fileStore.groupIndex" @click="fileStore.deleteSelectedGroup(); adminStore.awaitCodeCopy();" :bg="!fileStore.groupIndex ? '' : 'red'"
                        class="!text-sm min-w-8 aspect-square flex-center rounded cursor-pointer">
                        <i class="fa-solid fa-trash-can"></i>
                    </EC_Button>
                    <draggable :list="fileStore.groups" itemKey="id" class="flex flex-wrap gap-2" v-if="fileStore.groups.length != 0">
                        <template #item="{ element, index }">                            
                            <div @click="fileStore.selectGroup(index); adminStore.awaitCodeCopy();" :class="fileStore.groupIndex == index ? 
                                'bg-sky-300 hover:bg-sky-200 dark:bg-sky-600 dark:hover:bg-sky-500' : 
                                'bg-gray-300 hover:bg-gray-200 dark:bg-slate-600 dark:hover:bg-slate-500'" 
                                class="hover:ring-1 relative text-sm min-w-8 aspect-square flex-center rounded cursor-pointer text-slate-900 dark:text-slate-50">
                                {{ index+1 }}
                            </div>
                        </template>
                    </draggable>
                    <EC_Button @click="fileStore.groups.push({tasks: [ '' ]}); adminStore.awaitCodeCopy();" bg="green"
                        class="!text-sm min-w-8 aspect-square flex-center rounded cursor-pointer">
                        <i class="fa-solid fa-plus"></i>
                    </EC_Button>
                </div>  
                
                <!-- ZADACI -->
                <EC_InputLabel title="Zadaci:" description="" class="whitespace-nowrap" />
                <div class="flex flex-wrap gap-2 w-full -mt-2">
                    <EC_Button :disabled="fileStore.groups[fileStore.groupIndex].tasks.length == 1" @click="fileStore.deleteSelectedTask(); adminStore.awaitCodeCopy();" :bg="fileStore.groups[fileStore.groupIndex].tasks.length == 1 ? '' : 'red'"
                        class="!text-sm min-w-8 aspect-square flex-center rounded cursor-pointer">
                        <i class="fa-solid fa-trash-can"></i>
                    </EC_Button>
                    <draggable :list="fileStore.groups[fileStore.groupIndex].tasks" itemKey="id" class="flex flex-wrap gap-2" v-if="fileStore.groups[fileStore.groupIndex].tasks.length != 0">
                        <template #item="{ element, index }">                            
                            <div @click="fileStore.taskIndex = index; adminStore.awaitCodeCopy();" :class="fileStore.taskIndex == index ? 
                                'bg-sky-300 hover:bg-sky-200 dark:bg-sky-600 dark:hover:bg-sky-500' : 
                                'bg-gray-300 hover:bg-gray-200 dark:bg-slate-600 dark:hover:bg-slate-500'" 
                                class="hover:ring-1 relative text-sm min-w-8 aspect-square flex-center rounded cursor-pointer text-slate-900 dark:text-slate-50">
                                {{ index+1 }}
                            </div>
                        </template>
                    </draggable>
                    <EC_Button @click="fileStore.groups[fileStore.groupIndex].tasks.push( {taskPoints: 0, taskText: ''} ); adminStore.awaitCodeCopy();" bg="green"
                        class="!text-sm min-w-8 aspect-square flex-center rounded cursor-pointer">
                        <i class="fa-solid fa-plus"></i>
                    </EC_Button>
                </div>   

                <!-- BODOVI -->
                <EC_InputLabel title="Bodovi zadatka:" description="" class="whitespace-nowrap" />
                <div class="flex gap-2 items-center">
                    <EC_NumberInput class="w-fit -mt-2" :min="0" v-model="fileStore.groups[fileStore.groupIndex].tasks[fileStore.taskIndex].taskPoints"/>
                    <EC_InputLabel :title="`Ukupno bodova: <code class='text-sky-500 font-bold'>${checkPoints}</code>`" description=""/>
                </div>
                
                <!-- MARKDOWN ZADATAK -->
                <div class="grid grid-cols-2 gap-2 resize-vertical w-full !min-h-36 h-36">     
                     <!-- EDIT -->     
                    <div class="flex flex-col h-full min-h-36">
                        <EC_InputLabel title="Uredi"/>
                        <EC_TextArea class="wh-full text-left p-4 overflow-scroll text-neutral-800 resize-none
                            dark:text-neutral-400 text-xs" 
                            v-model="fileStore.groups[fileStore.groupIndex].tasks[fileStore.taskIndex].taskText"/>
                    </div>     
                     <!-- PREVIEW -->     
                    <div class="flex flex-col h-full min-h-36">
                        <EC_InputLabel title="Pregled"/>                    
                        <VueShowdown v-highlight class="mdSize text-left p-4 overflow-scroll text-neutral-800  
                            dark:text-neutral-400 text-xs border rounded-md border-neutral-700 grow" 
                            :markdown="fileStore.groups[fileStore.groupIndex].tasks.length != 0 ? 
                            (fileStore.groups[fileStore.groupIndex].tasks ? fileStore.groups[fileStore.groupIndex].tasks[fileStore.taskIndex].taskText : '') : ''" 
                            flavor="github" :options="{ emoji: true }" 
                            :class="globalStore.isDarkMode ? 'md-dark bg-neutral-800' : 'md bg-white'" />                   
                    </div>     
                </div>
                
            </div>

            <div class="flex gap-4 mb-4">
                <input type="file" id="fileUpload" @change="fileStore.uploadFile" accept=".txt,.md" class="hidden" />
                <EC_Button @click="fileStore.openFileInput" bg="blue" class="w-full py-2"> Učitaj datoteku <i class="fa-solid fa-arrow-up-from-bracket"></i> </EC_Button>
            </div>

            <div class="mt-4 flex gap-2 w-full">
                <EC_Button class="py-2 px-4 grow" :bg="changed && !adminStore.updating ? 'green' : ''" 
                    :disabled="!changed || adminStore.updating"
                    @click.prevent="adminStore.updateExam"> 
                    {{ !adminStore.selectedExam.accessLimit ? "Ažuriraj vježbu" : "Ažuriraj ispit" }} <i class="fa-solid fa-pen-to-square"></i>
                </EC_Button>
                <EC_Button class="py-2 px-4 grow" :bg="changed && !adminStore.updating ? 'yellow' : ''" 
                    :disabled="!changed || adminStore.updating" @click.prevent="adminStore.resetExam();"> 
                    {{ !adminStore.selectedExam.accessLimit ? "Resetiraj vježbu" : "Resetiraj ispit" }} <i class="fa-solid fa-arrows-rotate"></i>
                </EC_Button>
                <EC_Button class="py-2 px-4 grow" :bg="!adminStore.updating ? 'red' : ''"  
                    :disabled="adminStore.updating" @click.prevent="adminStore.deleteExam">
                    {{ !adminStore.selectedExam.accessLimit ? "Izbriši vježbu" : "Izbriši ispit" }} <i class="fa-solid fa-trash"></i>
                </EC_Button>
            </div>
        </div>
    </div>
</template>
