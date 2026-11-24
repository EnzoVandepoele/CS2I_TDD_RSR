class Salle {
    constructor(id, nom, capacite) {
        if (id === undefined || id === null) {
            throw new Error("L'id de la salle est obligatoire");
        }

        if (typeof nom !== "string" || nom.trim() === "") {
            throw new Error("Le nom de la salle est obligatoire");
        }

        if (!Number.isInteger(capacite)) {
            throw new Error("La capacité doit être un entier");
        }

        if (capacite <= 0) {
            throw new Error("La capacité doit être supérieure à 0");
        }

        this.id = id;
        this.nom = nom.trim();
        this.capacite = capacite;
    }
}

module.exports = Salle;
