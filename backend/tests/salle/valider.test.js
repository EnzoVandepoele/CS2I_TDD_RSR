const Salle = require("../../class/salle");

// ---------- valider (renvoie un message ou null, ne lève jamais d'erreur) ----------

test("validerSalle_donneesValides_returnNull", () => {
    // Arrange
    const donnees = { nom: "Salle 4", capacite: 8 };
    const expected = null;

    // Act
    let result;

    try {
        result = Salle.valider(donnees);
    } catch (error) {
        result = "erreur levée : " + error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("validerSalle_nomVide_returnMessageObligatoire", () => {
    // Arrange
    const donnees = { nom: "", capacite: 8 };
    const expected = "Le nom de la salle est obligatoire";

    // Act
    let result;

    try {
        result = Salle.valider(donnees);
    } catch (error) {
        result = "erreur levée : " + error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("validerSalle_capacite0_returnMessageSuperieureA0", () => {
    // Arrange
    const donnees = { nom: "Salle 4", capacite: 0 };
    const expected = "La capacité doit être supérieure à 0";

    // Act
    let result;

    try {
        result = Salle.valider(donnees);
    } catch (error) {
        result = "erreur levée : " + error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
