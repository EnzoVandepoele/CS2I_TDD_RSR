const API_URL = "http://localhost:3000";

// Appelle json-server
async function appelerApi(chemin, options) {
    try {
        return await fetch(`${API_URL}${chemin}`, options);
    } catch {
        throw new Error("Impossible de contacter la base de données");
    }
}

class Salle {
    // id facultatif : une salle pas encore enregistrée n'a pas d'id (null), c'est json-server qui le donne lors du POST
    constructor(nom, capacite, id = null) {
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

    // Crée une salle dans la base json-server et renvoie l'objet Salle avec son id
    static async create(nom, capacite) {
        const nouvelleSalle = new Salle(nom, capacite);
        const salles = await (await appelerApi("/salles")).json();
        
        const existe = salles.some(
            (salle) => salle.nom.trim().toLowerCase() === nouvelleSalle.nom.toLowerCase()
        );
        if (existe) {
            throw new Error("Une salle avec ce nom existe déjà");
        }

        const reponse = await appelerApi("/salles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: nouvelleSalle.nom, capacite: nouvelleSalle.capacite }),
        });

        if (!reponse.ok) {
            throw new Error("Erreur lors de la création de la salle");
        }

        const data = await reponse.json();
        return new Salle(data.nom, data.capacite, data.id);
    }

    // Modifie une salle déjà enregistrée (PATCH /salles/:id) ; le champ non fourni garde sa valeur
    async update({ nom = this.nom, capacite = this.capacite } = {}) {
        if (this.id === null) {
            throw new Error("La salle n'est pas enregistrée");
        }

        // Le constructeur vérifie les nouvelles valeurs AVANT d'appeler la base
        const salleModifiee = new Salle(nom, capacite, this.id);

        // Si le nom change, il ne doit pas être pris par une AUTRE salle
        if (salleModifiee.nom.toLowerCase() !== this.nom.toLowerCase()) {
            const salles = await (await appelerApi("/salles")).json();
            const existe = salles.some(
                (salle) => salle.id !== this.id && salle.nom.trim().toLowerCase() === salleModifiee.nom.toLowerCase()
            );
            if (existe) {
                throw new Error("Une salle avec ce nom existe déjà");
            }
        }

        const reponse = await appelerApi(`/salles/${this.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: salleModifiee.nom, capacite: salleModifiee.capacite }),
        });

        if (reponse.status === 404) {
            throw new Error("Salle introuvable");
        }
        if (!reponse.ok) {
            throw new Error("Erreur lors de la modification de la salle");
        }

        // La base a accepté : on met à jour l'objet
        const data = await reponse.json();
        this.nom = data.nom;
        this.capacite = data.capacite;
        return this;
    }

    // Pour les formulaires : renvoie le message d'erreur, ou null si les données sont valides.
    // Les règles sont celles du constructeur : on essaie de construire la salle.
    static valider(donnees) {
        try {
            new Salle(donnees.nom, donnees.capacite, donnees.id);
            return null;
        } catch (error) {
            return error.message;
        }
    }

    // Retrouve une salle dans une liste déjà chargée, sinon undefined.
    // La liste "salles" est récupérée UNE fois depuis la base (au chargement du site) puis gardée
    // en mémoire : on cherche dedans plutôt que de rappeler la base à chaque fois (moins d'appels réseau).
    // On compare en texte : le front donne l'id d'un <select> ("2") alors que la base stocke 2.
    static trouver(salles, id) {
        return salles.find((salle) => String(salle.id) === String(id));
    }

    // Supprime une salle de la base (DELETE /salles/:id) et renvoie true.
    static async delete(id) {
        if (id === undefined || id === null) {
            throw new Error("L'id de la salle est obligatoire");
        }

        const reservations = await (await appelerApi(`/reservations?idSalle=${id}`)).json();
        if (reservations.length > 0) {
            throw new Error("Impossible de supprimer une salle qui a des réservations");
        }

        const reponse = await appelerApi(`/salles/${id}`, {
            method: "DELETE"
        });

        if (reponse.status === 404) {
            throw new Error("Salle introuvable");
        }
        if (!reponse.ok) {
            throw new Error("Erreur lors de la suppression de la salle");
        }

        return true;
    }
}

if (typeof module !== "undefined") {
    module.exports = Salle;
}
