class Reservation {
    constructor(idSalle, dateDebut, dateFin, nbPersonnes) {
        if (idSalle === undefined || idSalle === null) {
            throw new Error("L'id de la salle est obligatoire");
        }

        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);

        if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
            throw new Error("Le format de la date est invalide");
        }

        if (fin <= debut) {
            throw new Error("La date de fin doit être après la date de début");
        }

        if (!Number.isInteger(nbPersonnes)) {
            throw new Error("Le nombre de personnes doit être un entier");
        }

        if (nbPersonnes <= 0) {
            throw new Error("Le nombre de personnes doit être supérieur à 0");
        }

        this.idSalle = idSalle;
        this.dateDebut = debut;
        this.dateFin = fin;
        this.nbPersonnes = nbPersonnes;
    }

    // Compare deux ids, que la base les stocke en nombre (2) ou que le site les donne en texte ("2")
    static memeId(a, b) {
        return String(a) === String(b);
    }

    // Ramène une date au format "AAAA-MM-JJTHH:MM" pour pouvoir comparer les dates comme du texte
    static normaliserDate(valeur) {
        const texte = valeur === undefined || valeur === null ? "" : String(valeur);

        if (texte.length === 10) {
            return `${texte}T00:00`;
        }

        return texte.slice(0, 16);
    }

    // Jour d'une date, au format "AAAA-MM-JJ"
    static jourDe(valeur) {
        return Reservation.normaliserDate(valeur).slice(0, 10);
    }

    // Transforme une date JavaScript en "AAAA-MM-JJ", en heure locale
    static #formatJour(date) {
        const mois = String(date.getMonth() + 1).padStart(2, "0");
        const jour = String(date.getDate()).padStart(2, "0");

        return `${date.getFullYear()}-${mois}-${jour}`;
    }

    // Lendemain d'un jour "AAAA-MM-JJ" (gère la fin de mois et d'année)
    static jourSuivant(jour) {
        const [annee, mois, numero] = jour.split("-").map(Number);

        return Reservation.#formatJour(new Date(annee, mois - 1, numero + 1));
    }

    // Date du jour, au format "AAAA-MM-JJ"
    static aujourdhui() {
        return Reservation.#formatJour(new Date());
    }

    // "2026-11-25" -> "25/11/2026"
    static formaterJour(valeur) {
        const [annee, mois, jour] = Reservation.jourDe(valeur).split("-");

        return `${jour}/${mois}/${annee}`;
    }

    // "2026-11-25T09:00" -> "25/11/2026 09:00"
    static formaterDate(valeur) {
        const heure = Reservation.normaliserDate(valeur).slice(11);

        return `${Reservation.formaterJour(valeur)} ${heure}`;
    }

    // "25/11/2026 09:00 – 10:00", ou les deux dates complètes si la réunion dure plusieurs jours
    static formaterCreneau(reservation) {
        const debut = Reservation.normaliserDate(reservation.dateDebut);
        const fin = Reservation.normaliserDate(reservation.dateFin);

        if (Reservation.jourDe(debut) === Reservation.jourDe(fin)) {
            return `${Reservation.formaterDate(debut)} – ${fin.slice(11)}`;
        }

        return `${Reservation.formaterDate(debut)} – ${Reservation.formaterDate(fin)}`;
    }

    // Tous les jours couverts par une réservation, début et fin inclus (pour colorer le calendrier)
    static joursCouverts(reservation) {
        const debut = Reservation.jourDe(reservation.dateDebut);
        const fin = Reservation.jourDe(reservation.dateFin);

        if (debut.length !== 10 || fin.length !== 10) {
            return [];
        }

        const jours = [];
        for (let jour = debut; jour <= fin; jour = Reservation.jourSuivant(jour)) {
            jours.push(jour);
        }

        return jours;
    }

    // Réservations d'une salle qui couvrent le jour demandé ("AAAA-MM-JJ")
    static duJour(reservations, idSalle, jour) {
        return reservations.filter((reservation) =>
            Reservation.memeId(reservation.idSalle, idSalle) &&
            Reservation.jourDe(reservation.dateDebut) <= jour &&
            Reservation.jourDe(reservation.dateFin) >= jour
        );
    }

    // Deux créneaux se chevauchent-ils ? Finir à 10h et commencer à 10h n'est pas un chevauchement
    static chevauche(a, b) {
        return Reservation.normaliserDate(a.dateDebut) < Reservation.normaliserDate(b.dateFin) &&
            Reservation.normaliserDate(b.dateDebut) < Reservation.normaliserDate(a.dateFin);
    }

    // Première réservation de la même salle qui chevauche le créneau demandé, sinon null.
    // idIgnore : la réservation en cours de modification (elle ne doit pas être en conflit avec elle-même)
    static trouverConflit(reservations, candidate, idIgnore = null) {
        const conflit = reservations.find((reservation) =>
            Reservation.memeId(reservation.idSalle, candidate.idSalle) &&
            !(idIgnore !== null && Reservation.memeId(reservation.id, idIgnore)) &&
            Reservation.chevauche(reservation, candidate)
        );

        return conflit || null;
    }

    // Pour les formulaires : renvoie le message d'erreur, ou null si la réservation est valide.
    // Règles : celles du constructeur + la capacité de la salle + pas de conflit de créneau
    static valider(candidate, salle, reservations, idIgnore = null) {
        if (!salle) {
            return "Veuillez choisir une salle.";
        }

        try {
            new Reservation(candidate.idSalle, candidate.dateDebut, candidate.dateFin, candidate.nbPersonnes);
        } catch (error) {
            return error.message;
        }

        if (candidate.nbPersonnes > salle.capacite) {
            return `${salle.nom} accueille au maximum ${salle.capacite} personnes.`;
        }

        const conflit = Reservation.trouverConflit(reservations, candidate, idIgnore);
        if (conflit) {
            return `Cette salle est déjà réservée sur ce créneau (${Reservation.formaterCreneau(conflit)}).`;
        }

        return null;
    }

    // ---------- Base de données (json-server) ----------
    // Privé (#) : dans le navigateur, salle.js déclare déjà API_URL en global, on évite le doublon
    static #API_URL = "http://localhost:3000";

    static async #appelerApi(chemin, options) {
        try {
            return await fetch(`${Reservation.#API_URL}${chemin}`, options);
        } catch {
            throw new Error("Impossible de contacter la base de données");
        }
    }

    // Relit la salle et ses réservations DANS LA BASE, puis applique valider.
    // Renvoie la salle (son id a le bon type, nombre) ; lève une erreur si la réservation est refusée.
    static async #verifierDansLaBase(candidate, idIgnore = null) {
        const reponseSalle = await Reservation.#appelerApi(`/salles/${candidate.idSalle}`);
        if (!reponseSalle.ok) {
            throw new Error("Salle introuvable");
        }
        const salle = await reponseSalle.json();

        const reservations = await (await Reservation.#appelerApi(`/reservations?idSalle=${salle.id}`)).json();

        const erreur = Reservation.valider(candidate, salle, reservations, idIgnore);
        if (erreur) {
            throw new Error(erreur);
        }

        return salle;
    }

    // Données envoyées à la base : dates au format "AAAA-MM-JJTHH:MM" (sans fuseau horaire)
    static #corps(candidate, salle) {
        return JSON.stringify({
            idSalle: salle.id,
            dateDebut: Reservation.normaliserDate(candidate.dateDebut),
            dateFin: Reservation.normaliserDate(candidate.dateFin),
            nbPersonnes: candidate.nbPersonnes,
        });
    }

    // Crée une réservation (POST /reservations) et renvoie la réservation enregistrée, avec son id
    static async create(candidate) {
        // Le constructeur vérifie les données AVANT d'appeler la base
        new Reservation(candidate.idSalle, candidate.dateDebut, candidate.dateFin, candidate.nbPersonnes);

        const salle = await Reservation.#verifierDansLaBase(candidate);

        const reponse = await Reservation.#appelerApi("/reservations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: Reservation.#corps(candidate, salle),
        });

        if (!reponse.ok) {
            throw new Error("Erreur lors de la création de la réservation");
        }

        return reponse.json();
    }

    // Modifie une réservation (PATCH /reservations/:id) et renvoie la réservation enregistrée
    static async update(id, candidate) {
        if (id === undefined || id === null) {
            throw new Error("L'id de la réservation est obligatoire");
        }

        new Reservation(candidate.idSalle, candidate.dateDebut, candidate.dateFin, candidate.nbPersonnes);

        // id en idIgnore : la réservation ne doit pas être en conflit avec son ancien créneau
        const salle = await Reservation.#verifierDansLaBase(candidate, id);

        const reponse = await Reservation.#appelerApi(`/reservations/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: Reservation.#corps(candidate, salle),
        });

        if (reponse.status === 404) {
            throw new Error("Réservation introuvable");
        }
        if (!reponse.ok) {
            throw new Error("Erreur lors de la modification de la réservation");
        }

        return reponse.json();
    }

    // Supprime une réservation (DELETE /reservations/:id) et renvoie true
    static async delete(id) {
        if (id === undefined || id === null) {
            throw new Error("L'id de la réservation est obligatoire");
        }

        const reponse = await Reservation.#appelerApi(`/reservations/${id}`, { method: "DELETE" });

        if (reponse.status === 404) {
            throw new Error("Réservation introuvable");
        }
        if (!reponse.ok) {
            throw new Error("Erreur lors de la suppression de la réservation");
        }

        return true;
    }
}

if (typeof module !== "undefined") {
    module.exports = Reservation;
}
