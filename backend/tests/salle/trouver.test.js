const Salle = require("../../class/salle");

// ---------- trouver (pas de base : cherche dans une liste déjà chargée) ----------

const salles = [
    { id: 1, nom: "Salle 1", capacite: 10 },
    { id: 2, nom: "Salle 2", capacite: 20 },
];

test("trouverSalle_idNombre_returnSalle", () => {
    // Arrange
    const id = 2;
    const expected = { id: 2, nom: "Salle 2", capacite: 20 };

    // Act
    let result;

    try {
        result = Salle.trouver(salles, id);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("trouverSalle_idTexte_returnSalle", () => {
    // Arrange
    const id = "2";
    const expected = { id: 2, nom: "Salle 2", capacite: 20 };

    // Act
    let result;

    try {
        result = Salle.trouver(salles, id);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("trouverSalle_idInconnu_returnUndefined", () => {
    // Arrange
    const id = 99;
    const expected = undefined;

    // Act
    let result;

    try {
        result = Salle.trouver(salles, id);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
