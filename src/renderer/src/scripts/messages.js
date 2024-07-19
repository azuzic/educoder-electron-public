const ADMIN_MSGS = {
	USER_EXAM_UPDATE__SUCCESS: (user, exam) => { return {
		type: `success`,
		message: `Status započetog ispita uspješno ažuriran za korisnika: ${user} i ispit ${exam}!`,
	}},
	USER_EXAM_UPDATE__ERROR: {
		type: `error`,
		message: `Greška pri ažuriranju statusa ispita korisnika!`,
	},
	USER_UPDATE__SUCCESS: (user) => { return {
		type: `success`,
		message: `Korisnik ${user} Uspješno ažuriran!`,
	}},
	USER_UPDATE__ERROR: {
		type: `error`,
		message: `Greška pri ažuriranju korisnika!`,
	},
	SCRIPT_UPDATE__SUCCESS: {
		type: `success`,
		message: `Vidljivost skripte Uspješno ažurirana!`,
	},
	SCRIPT_UPDATE__ERROR: {
		type: `error`,
		message: `Greška pri ažuriranju vidljivosti skripte!`,
	},
	FETCH_EXAM__SUCCESS: { 
		type: `success`,
		message: `Ispit uspješno dohvaćen!`,
	},
	FETCH_EXAM__WARNING: {
		type: `warning`,
		message: `Ispit ne postoji!`,
	},
	FETCH_EXAM__ERROR: {
		type: `error`,
		message: `Greška pri dohvaćanju ispita!`,
	},
	FETCH_SOLLUTIONS__SUCCESS: { 
		type: `success`,
		message: `Riješenja uspješno dohvaćena!`,
	},
	FETCH_SOLLUTIONS__ERROR: {
		type: `error`,
		message: `Greška pri dohvaćanju riješenja!`,
	},
    FETCH_SOLLUTIONS_EMPTY__WARNING: {
		type: `warning`,
		message: `Nema predanih riješenja!`,
	},
	FETCH_SOLLUTION__SUCCESS: (solution) => { return {
		type: `success`,
		message: `Riješenje ${solution} uspješno dohvaćeno!`,
	}},
    FETCH_SOLLUTION__NOT_FOUND_WARNING: { 
		type: `warning`,
		message: `Riješenje ne postoji!`,
	},
	FETCH_SOLLUTION__ERROR: (url) => { return {
		type: `error`,
		message: `Greška pri dohvaćanju riješenja sa url: ${url}!`,
	}},
	FETCH_USERS__SUCCESS: {
		type: `success`,
		message: `Korisnici uspješno dohvaćeni!`,
	},
	FETCH_USERS__ERROR: {
		type: `error`,
		message: `Greška pri dohvaćanju korisnika!`,
	},
	DELETE_EXAM__SUCCESS: (exam) => { return {
		type: `success`,
		message: `Ispit [${exam}] uspješno obrisan!`,
	}},
	DELETE_EXAM__WARNING: {
		type: `warning`,
		message: `Dostupna je nova verzija ispita!`,
	},
	DELETE_EXAM__ALREADY_DELETED_WARNING: {
		type: `warning`,
		message: `Ispit je već izbrisan!`,
	},
	DELETE_EXAM__ERROR: {
		type: `error`,
		message: `Greška pri brisanju ispita!`,
	},
	UPDATE_EXAM__SUCCESS: (exam) => { return {
		type: `success`,
		message: `Ispit [${exam}] uspješno ažuriran!`,
    }},
	UPDATE_EXAM__WARNING: {
		type: `warning`,
		message: `Nije moguće ažurirati, postoji nova verzija ispita!`,
	},
	UPDATE_EXAM__EXAM_DELETED_WARNING: {
		type: `warning`,
		message: `Nije moguće ažurirati izbrisan ispit!`,
	},
	UPDATE_EXAM__ERROR: {
		type: `error`,
		message: `Greška pri ažuriranju ispita!`,
	},
	UPDATE_EXISTING_EXAM__SUCCESS: {
		type: `success`,
		message: `Lista postojećih ispita Uspješno ažurirana!`,
	},
	UPDATE_EXISTING_EXAM__ERROR: {
		type: `error`,
		message: `Greška pri ažuriranju liste postojećih ispita!`,
	},
	UPDATE_NEW_EXAM_PASSWORD__SUCCESS: {
		type: `success`,
		message: `Nova lozinka ispita uspješno dodana!`,
	},
	UPDATE_NEW_EXAM_PASSWORD__ERROR: {
		type: `error`,
		message: `Greška pri dodavanju nove lozinke ispita!`,
	},
	UPDATE_ENTIRE_EXAM__SUCCESS: {
		type: `success`,
		message: `Kompletni ispit uspješno ažuriran!`,
	},
	UPDATE_ENTIRE_EXAM__ERROR: {
		type: `error`,
		message: `Greška pri ažuriranju kompletnog ispita!`,
	},
	FETCH_CREATED_EXAMS__SUCCESS: {
		type: `success`,
		message: `Izrađeni ispiti Uspješno dohvaćeni!`,
	},
	FETCH_CREATED_EXAMS__ERROR: {
		type: `error`,
		message: `Greška pri dohvaćanju izrađenih ispita!`,
	},
	FETCH_CREATED_EXAMS__WARNING: {
		type: `warning`,
		message: `Nema izrađenih ispita!`,
	},
    FILE_UPLOAD__SUCCESS: {
		type: `success`,
		message: `Datoteka uspješno učitana!`,
	},
    FILE_UPLOAD__WARNING: {
		type: `warning`,
		message: `Datoteka mora biti .txt ili .md!`,
	},
    FILE_UPLOAD__ERROR: {
		type: `error`,
		message: `Greška pri učitavanju datoteke!`,
	},
    FIX_EXAM_PASSWORD__SUCCESS: {
        type: `success`,
		message: `Lozinka ispita uspješno popravljena!`,
	},
    FIX_EXAM_PASSWORD__WARNING: {
		type: `warning`,
		message: `Nije moguće popraviti lozinku izbrisanog ispita!`,
	},
    FIX_EXAM_PASSWORD__ERROR: {
        type: `error`,
		message: `Greška pri popravljanju lozinke ispita!`,
	},
    USER_STARTED_EXAM_DELETED__SUCCESS: (exam_password, user_email) => { return {
        type: `success`,
		message: `Započeti ispit sa šifrom ${exam_password} za korisnika ${user_email} uspiješno izbrisan !`,
	}},
    USER_STARTED_EXAM_DELETED__ERROR: (exam_password, user_email) => { return {
        type: `error`,
		message: `Greška pri brisanju započetog ispita sa šifrom ${exam_password} za korisnika ${user_email}!`,
	}},
    SELECTED_EXAM_UP_TO_DATE__EXAM_DELETED_WARNING: {
		type: `warning`,
		message: `Odabrani ispit je izbrisan!`,
	},
    SELECTED_EXAM_UP_TO_DATE__WARNING: {
		type: `warning`,
		message: `Postoji nova verzija odabranog ispita!`,
	},
    SELECTED_EXAM_UP_TO_DATE__SUCCESS: {
		type: `success`,
		message: `Odabrani ispit je ažuran!`,
	},
};

const FILE_MSGS = {
	FETCH_SCRIPTS__SUCCESS: {
		type: `success`,
		message: `Vidljivost skripti Uspješno dohvaćen!`,
	},
	FETCH_SCRIPTS__ERROR: {
		type: `error`,
		message: `Greška pri dohvaćanju vidljivosti skripti.`,
	},
	FETCH_SCRIPT__ERROR: {
		type: `error`,
		message: `Greška pri dohvaćanju skripte.`,
	},
	LOAD_SCRIPT__ERROR: {
		type: `error`,
		message: `Greška pri učitavanju skripte.`,
	},
	UPLOAD_FILE__WARNING: {
		type: `warning`,
		message: `Dozvoljene su samo .txt i .md datoteke.`,
	},
	SAVE_EXAM__SUCESSS: (title) => {
        return {
            type: `success`,
            message: `Ispit [${title}] uspješno spremljen!`
        }
	},
	SAVE_EXAM__ERROR: {
        type: `error`,
        message: `Greška pri spremanju ispita.`
	},
    SET_EXAM_PASSWORD__SUCCESS: {
        type: `success`,
		message: `Lozinka ispita uspješno spremljena!`,
	},
    SET_EXAM_PASSWORD__ERROR: {
        type: `error`,
		message: `Greška pri spremanju lozinke ispita!`,
	},
    FILE_UPLOAD__SUCCESS: {
		type: `success`,
		message: `Datoteka uspješno učitana!`,
	},
    FILE_UPLOAD__WARNING: {
		type: `warning`,
		message: `Datoteka mora biti .txt ili .md!`,
	},
    FILE_UPLOAD__ERROR: {
		type: `error`,
		message: `Greška pri učitavanju datoteke!`,
	},
};

const USER_MSGS = {
	SIGN_IN__SUCCESS: (email) => { return {
		type: `success`,
		message: `Prijava uspješna! Dobrodošli ${email}!`,
	}},
	SIGN_IN_UNIPU__WARNING: {
		type: `warning`,
		message: `Molimo da se prijavite s UNIPU Google računom kako biste nastavili.`,
	},
	SIGN_IN__ERROR: {
		type: `error`,
		message: `Greška kod prijave!`,
	},
	USER_CHECK__ERROR: {
		type: `error`,
		message: `Greška kod spajanja na bazu podataka! Kontaktirajte administratora!`,
	},
	USER_LOGIN__SUCCESS: (email) => { return {
		type: `success`,
		message: `Dobrodošli ${email}!`,
	}},
	SIGN_OUT__SUCCESS: {
		type: `success`,
		message: `Korisnik odjavljen!`,
	},
	SIGN_OUT__ERROR: {
		type: `error`,
		message: `Greška pri odjavljivanju!`,
	},
	EXAM_LIMITED_ACCESS__WARNING: {
		type: `warning`,
		message: `Pristup ispitu je ograničen i već je pokrenut na ovom računu!`,
	},
};

const EXAM_MSGS = {
    EXAM_NOT_FOUND__WARNING: (examPassword) => { return {
		type: `warning`,
		message: `Nije pronađen ispit sa šifrom [${examPassword}]!`,
	}},
    EXAM_FETCH__SUCCESS: (examPassword) => { return {
		type: `success`,
		message: `Ispit sa šifrom [${examPassword}] uspješno dohvaćen!`,
	}},
    EXAM_FETCH__ERROR: {
		type: `error`,
		message: `Neuspješno dohvaćanje podataka o ispitu!`,
	},
	EXAM_STARTED__SUCCESS: (examPassword) => { return {
		type: `success`,
		message: `Ispit sa šifrom [${examPassword}] uspješno pokrenut!`,
	}},
	EXAM_START__WARNING: (examPassword) => { return {
		type: `warning`,
		message: `Ispit sa šifrom [${examPassword}] se ne može započeti!`,
	}},
	EXAM_START__ERROR: (examPassword) => { return {
		type: `error`,
		message: `Greška pri pokretanju ispita sa šifrom [${examPassword}]!`,
	}},
	EXAM_UPLOAD__SUCCESS: (examPassword) => { return {
		type: `success`,
		message: `Ispit sa šifrom [${examPassword}] Uspješno spremljen!`,
	}},
	EXAM_UPLOAD__ERROR: (examPassword) => { return {
		type: `error`,
		message: `Greška pri spremanju ispita sa šifrom [${examPassword}]!`,
	}},
	EXAM_LIMITED_ACCESS__WARNING: {
		type: `warning`,
		message: `Pristup ispitu je ograničen i već je pokrenut na ovom računu!`,
	},
	EXAM_ANTI_CHEAT_EXIT__WARNING: {
		type: `warning`,
		message: `⚠️ Izašli ste iz ispita. Ovo vam je upozorenje. Ponovljeni izlazak će rezultatirati automatskim zatvaranjem ispita i predajom zadatka.`,
	},
    EXAM_ANTI_CHEAT_MAX_PASTE_LIMIT__WARNING: (maxPasteLength) => { return {
		type: `warning`,
		message: `Dostignut maksimalno dozvoljen broj znakova kod lijepljenja! Maksimalno dopušteno: ${maxPasteLength} znakova!`,
	}},

};

export { ADMIN_MSGS, FILE_MSGS, USER_MSGS, EXAM_MSGS }