const Salle = require("../class/salle");

// ---------- id de la salle ----------

test("id_undefined_return_obligatoire", () => {
    // Arrange
    const id = undefined;
    const expected = "L'id de la salle est obligatoire";

    // Act
    let result;

    try {
        new Salle(id, "Salle A", 10);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("id_1_return_1", () => {
    // Arrange
    const id = 1;
    const expected = 1;

    // Act
    let result;

    try {
        result = new Salle(id, "Salle A", 10).id;
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

// ---------- nom de la salle ----------

test("nom_vide_return_obligatoire", () => {
    // Arrange
    const nom = "";
    const expected = "Le nom de la salle est obligatoire";

    // Act
    let result;

    try {
        new Salle(1, nom, 10);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("nom_espaces_return_obligatoire", () => {
    // Arrange
    const nom = "   ";
    const expected = "Le nom de la salle est obligatoire";

    // Act
    let result;

    try {
        new Salle(1, nom, 10);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("nom_nombre_return_obligatoire", () => {
    // Arrange
    const nom = 42;
    const expected = "Le nom de la salle est obligatoire";

    // Act
    let result;

    try {
        new Salle(1, nom, 10);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("nom_Salle_A_return_Salle_A", () => {
    // Arrange
    const nom = "Salle A";
    const expected = "Salle A";

    // Act
    let result;

    try {
        result = new Salle(1, nom, 10).nom;
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

// ---------- capacité ----------

test("capacite_0_return_superieure_a_0", () => {
    // Arrange
    const capacite = 0;
    const expected = "La capacité doit être supérieure à 0";

    // Act
    let result;

    try {
        new Salle(1, "Salle A", capacite);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("capacite_-1_return_superieure_a_0", () => {
    // Arrange
    const capacite = -1;
    const expected = "La capacité doit être supérieure à 0";

    // Act
    let result;

    try {
        new Salle(1, "Salle A", capacite);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("capacite_2.5_return_entier", () => {
    // Arrange
    const capacite = 2.5;
    const expected = "La capacité doit être un entier";

    // Act
    let result;

    try {
        new Salle(1, "Salle A", capacite);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("capacite_texte_return_entier", () => {
    // Arrange
    const capacite = "dix";
    const expected = "La capacité doit être un entier";

    // Act
    let result;

    try {
        new Salle(1, "Salle A", capacite);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("capacite_2_return_2", () => {
    // Arrange
    const capacite = 2;
    const expected = 2;

    // Act
    let result;

    try {
        result = new Salle(1, "Salle A", capacite).capacite;
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
