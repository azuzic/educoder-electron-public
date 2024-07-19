<template>
    <div class="flex-col-center-full overflow-hidden text-neutral-400"> 

        <div class="flex flex-col gap-2">
            <router-link to="/under-maintenance"> 
                <EC_Button class="py-2 w-64 text-left !text-sm whitespace-nowrap" bg=""> <i class="fa-solid fa-brush"></i> Under Maintenance </EC_Button>
            </router-link>  

            <router-link to="/exam-in-progress"> 
                <EC_Button class="py-2 w-64 text-left !text-sm whitespace-nowrap" bg="blue"> <i class="fa-solid fa-bars-progress"></i> Exam In Progress </EC_Button>
            </router-link>  

            <div class="h-1 bg-neutral-500 rounded-full"></div>

            <router-link to="/"> 
                <EC_Button class="py-2 w-64 text-left !text-sm whitespace-nowrap" bg="green"> <i class="fa-regular fa-circle-question"></i> Introduction </EC_Button>
            </router-link>  

            <router-link to="/exam"> 
                <EC_Button class="py-2 w-64 text-left !text-sm whitespace-nowrap" bg="blue"> <i class="fa-solid fa-laptop-code"></i> Exam Editor </EC_Button>
            </router-link>

            <div class="h-1 bg-neutral-500 rounded-full"></div>

            <router-link to="/upload"> 
                <EC_Button class="py-2 w-64 text-left !text-sm whitespace-nowrap" bg="green"> <i class="fa-solid fa-upload"></i> Upload New Exam </EC_Button>
            </router-link>

            <router-link to="/admin"> 
                <EC_Button class="py-2 w-64 text-left !text-sm whitespace-nowrap" bg="red"> <i class="fa-solid fa-toolbox"></i> Admin Panels </EC_Button>
            </router-link>  

            <router-link to="/batch-examination"> 
                <EC_Button class="py-2 w-64 text-left !text-sm whitespace-nowrap" bg="yellow"> <i class="fa-solid fa-pen-ruler"></i> Batch Examination </EC_Button>
            </router-link>  

            <router-link v-if="false" to="/testing"> 
                <EC_Button class="py-2 w-64 text-left !text-sm whitespace-nowrap" bg="yellow"> <i class="fa-solid fa-biohazard"></i> Testing </EC_Button>
            </router-link>  
        </div>

    </div>
</template>