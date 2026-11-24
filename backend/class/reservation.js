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
}

module.exports = Reservation;
