<script setup>
import { userStore } from "@/main.js";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
	userStore.introductionDialogRead = false;
});

function navigateToComponent(component) {
	userStore.introductionDialogRead = true;
	router.push(component);
}
</script>

<template>
	<EC_PopupCard>
		<div class="max-w-6xl overflow-y-auto">
			<EC_Title>EduCoder</EC_Title>
			<br />
			Dobro došli u EduCoder! EduCoder je nova aplikacija za provođenje ispita iz programiranja na Fakultetu informatike u Puli.

			<EC_Subtitle class="text-rose-600"> Važno! Molimo pročitajte.</EC_Subtitle>

			EduCoder aplikacija izvodi se u vašem web pregledniku i omogućava vam <b>(1) rješavanje ispita</b> iz programiranja u HTML, CSS i JavaScript jezicima, <b>(2) neograničeno vježbanje</b>. te samostalno učenje u <b>(3) Sandbox</b> okruženju.<br /><br />
			<b>(1) Rješavanje ispita</b> provodi se u vremenskom okviru koji određuje nastavnik koji provodi ispit. Potrebno je unijeti <b>ime</b>, <b>prezime</b>, <b>JMBAG</b> te <b>šifru zadatka</b>. Šifru zadatka dobivate od nastavnika koji provodi ispit. Ako EduCoder ne prihvaća šifru, a smatrate da bi trebao, molimo da javite nastavniku.<br />
			Nakon što unesete tražene podatke, uključujući šifru zadatka, pritisnite gumb "Dohvati". Ako je zadatak uspješno učitan, vidjet ćete njegove detalje.<br />
			Sada možete započeti s rješavanjem zadatka pritiskom na gumb "Započni ispit". Napomena: ovo možete učiniti samo jednom! U slučaju da vrijeme istekne, EduCoder će <b>automatski zatvoriti ispit i uploadat rješenje</b>. Dodatno, lokalno možete preuzeti kopiju vašeg zadatka koju nigdje <b>ne predajete</b>. <br />
			<br />
			<b>(2) Vježbanje</b> vam omogućava rješavanje zadataka bez pristupnog ograničenja, odnosno možete ih rješavati koliko god puta hoćete. Za to je potrebno učitati vježbe koje možete pronaći u skriptama.<br />
			<br />

			<b>(3) Sandbox</b> vam pruža izolirano okruženje za vježbanje programiranja <b>bez definiranih zadataka, vremenskog ograničenja i anti-cheat rješenja.</b><br />
			<br />

			<i class="fa-solid fa-info-circle text-sky-600"></i> <u>Kod rješavanja ispita, kao i kod vježbanja, imat ćete pristup skriptama iz kolegija za koji rješavate zadatak.</u>

			<br />

			<i class="fa-solid fa-info-circle text-sky-600"></i> <u>Topla preporuka je pisati ispite u fullscreen modu vašeg preglednika.</u>

			<br />

			<i class="fa-solid fa-info-circle text-sky-600"></i> <u>Ispit predajete klikom na "Završi ispit" ili se automatski predaje <b>kada istekne vrijeme</b>.</u>

			<br />
			<br />
			<i class="fa-solid fa-triangle-exclamation text-rose-500"></i>
                <b class="text-rose-600"> Nije dopušteno</b> zatvaranje, minimizacija prozora 
                ili promjena kartice/taba. U slučaju minimizacije ili promjene kartice/taba, EduCoder će vas prvi put upozoriti, 
                a drugi put se automatski <b>završava ispit</b> i pohranjuje vaše trenutno rješenje kao konačno.
			<br />

			<i class="fa-solid fa-triangle-exclamation text-rose-500"></i>
                <b class="text-rose-600"> Nije dopušteno</b> kopiranje iz vanjskih izvora. 
                EduCoder ima mehanizme koji to mogu detektirati stoga vas molimo da to ne činite!
			<br />

			<i class="fa-solid fa-triangle-exclamation text-rose-500"></i>
                <b class="text-rose-600"> Nije dopušteno</b> korištenje prečaca za spremanje (CTRL/CMD + s), 
                osvježavanje stranice (CTRL/CMD + r), zatvaranje prozora (CTRL/CMD + w) i slično. 
                Sve što napišite se automatski sprema, ne morate ručno spremati vaš napredak. 
                Korištenje prečaca će vjerojatno rezultirati automatskim zatvaranjem ispita i predajom ispita! Međutim, 
                <b>dozvoljeno je korištenje prečaca za kopiranje i lijepljenje</b> (CTRL/CMD
                + c, CTRL/CMD + v). Dodatna preporuka je da privremeno ugasite screen-overlay aplikacije
                 (npr. <b>f.lux</b>, <b>GeForce Experience</b>, itd.)
			<br />
			<br />
            <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
                <b class="text-amber-600"> Upozorenje!</b> U slučaju <b>naglog zatvaranja</b> EduCodera (preglednik se zamrzne/nestane struje), 
                imate određeni period da se vratite u ispit i nastavite ga pisati bez upozorenja.
                Ako je trebalo duže vremena da se vratite u ispit od dopuštenog, dobit ćete <b>upozorenje</b> ili 
                se automatski <b>završava ispit</b> i pohranjuje vaše trenutno rješenje kao konačno.
			<br />
			<div class="w-full h-0.5 bg-neutral-500 rounded-full my-2"></div>
			<span class="text-left text-rose-600 flex font-bold" v-if="!userStore.user.email"> Molimo da se prijavite s UNIPU Google računom kako biste nastavili. </span>
			<EC_Button :bg="userStore.user.email ? 'blue' : ''" :disabled="!userStore.user.email" class="mt-4 h-8" @click="navigateToComponent('exam')"> Pročitao sam upute </EC_Button>
		</div>
	</EC_PopupCard>
</template>
