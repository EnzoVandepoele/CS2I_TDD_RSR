const Salle = require("../../class/salle");

// ---------- id de la salle ----------

test("salle_sansId_returnIdNull", () => {
    // Arrange
    const expected = null;

    // Act
    let result;

    try {
        result = new Salle("Salle A", 10).id;
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("salle_id1_return1", () => {
    // Arrange
    const id = 1;
    const expected = 1;

    // Act
    let result;

    try {
        result = new Salle("Salle A", 10, id).id;
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

// ---------- nom de la salle ----------

test("salle_nomVide_returnObligatoire", () => {
    // Arrange
    const nom = "";
    const expected = "Le nom de la salle est obligatoire";

    // Act
    let result;

    try {
        new Salle(nom, 10, 1);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("salle_nomEspaces_returnObligatoire", () => {
    // Arrange
    const nom = "   ";
    const expected = "Le nom de la salle est obligatoire";

    // Act
    let result;

    try {
        new Salle(nom, 10, 1);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("salle_nomNombre_returnObligatoire", () => {
    // Arrange
    const nom = 42;
    const expected = "Le nom de la salle est obligatoire";

    // Act
    let result;

    try {
        new Salle(nom, 10, 1);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("salle_nomSalleA_returnSalleA", () => {
    // Arrange
    const nom = "Salle A";
    const expected = "Salle A";

    // Act
    let result;

    try {
        result = new Salle(nom, 10, 1).nom;
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

// ---------- capacité ----------

test("salle_capacite0_returnSuperieureA0", () => {
    // Arrange
    const capacite = 0;
    const expected = "La capacité doit être supérieure à 0";

    // Act
    let result;

    try {
        new Salle("Salle A", capacite, 1);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("salle_capaciteNegative_returnSuperieureA0", () => {
    // Arrange
    const capacite = -1;
    const expected = "La capacité doit être supérieure à 0";

    // Act
    let result;

    try {
        new Salle("Salle A", capacite, 1);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("salle_capaciteDecimale_returnEntier", () => {
    // Arrange
    const capacite = 2.5;
    const expected = "La capacité doit être un entier";

    // Act
    let result;

    try {
        new Salle("Salle A", capacite, 1);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("salle_capaciteTexte_returnEntier", () => {
    // Arrange
    const capacite = "dix";
    const expected = "La capacité doit être un entier";

    // Act
    let result;

    try {
        new Salle("Salle A", capacite, 1);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("salle_capacite2_return2", () => {
    // Arrange
    const capacite = 2;
    const expected = 2;

    // Act
    let result;

    try {
        result = new Salle("Salle A", capacite, 1).capacite;
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
