const Reservation = require("../class/reservation");

// ---------- id de la salle ----------

test("idSalle_undefined_return_obligatoire", () => {
    // Arrange
    const idSalle = undefined;
    const expected = "L'id de la salle est obligatoire";

    // Act
    let result;

    try {
        new Reservation(idSalle, "2026-12-01T10:00", "2026-12-01T11:00", 5);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

// ---------- format de la date ----------

test("dateDebut_texte_return_format_invalide", () => {
    // Arrange
    const dateDebut = "pas une date";
    const expected = "Le format de la date est invalide";

    // Act
    let result;

    try {
        new Reservation(1, dateDebut, "2026-12-01T11:00", 5);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("dateFin_texte_return_format_invalide", () => {
    // Arrange
    const dateFin = "pas une date";
    const expected = "Le format de la date est invalide";

    // Act
    let result;

    try {
        new Reservation(1, "2026-12-01T10:00", dateFin, 5);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("dateDebut_valide_return_date", () => {
    // Arrange
    const dateDebut = "2026-12-01T10:00";
    const expected = new Date("2026-12-01T10:00").getTime();

    // Act
    let result;

    try {
        result = new Reservation(1, dateDebut, "2026-12-01T11:00", 5).dateDebut.getTime();
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

// ---------- ordre des dates ----------

test("dateFin_avant_dateDebut_return_fin_apres_debut", () => {
    // Arrange
    const dateDebut = "2026-12-01T11:00";
    const dateFin = "2026-12-01T10:00";
    const expected = "La date de fin doit être après la date de début";

    // Act
    let result;

    try {
        new Reservation(1, dateDebut, dateFin, 5);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("dateFin_egale_dateDebut_return_fin_apres_debut", () => {
    // Arrange
    const dateDebut = "2026-12-01T10:00";
    const dateFin = "2026-12-01T10:00";
    const expected = "La date de fin doit être après la date de début";

    // Act
    let result;

    try {
        new Reservation(1, dateDebut, dateFin, 5);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

// ---------- nombre de personnes ----------

test("nbPersonnes_0_return_superieur_a_0", () => {
    // Arrange
    const nbPersonnes = 0;
    const expected = "Le nombre de personnes doit être supérieur à 0";

    // Act
    let result;

    try {
        new Reservation(1, "2026-12-01T10:00", "2026-12-01T11:00", nbPersonnes);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("nbPersonnes_-1_return_superieur_a_0", () => {
    // Arrange
    const nbPersonnes = -1;
    const expected = "Le nombre de personnes doit être supérieur à 0";

    // Act
    let result;

    try {
        new Reservation(1, "2026-12-01T10:00", "2026-12-01T11:00", nbPersonnes);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("nbPersonnes_2.5_return_entier", () => {
    // Arrange
    const nbPersonnes = 2.5;
    const expected = "Le nombre de personnes doit être un entier";

    // Act
    let result;

    try {
        new Reservation(1, "2026-12-01T10:00", "2026-12-01T11:00", nbPersonnes);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("nbPersonnes_texte_return_entier", () => {
    // Arrange
    const nbPersonnes = "cinq";
    const expected = "Le nombre de personnes doit être un entier";

    // Act
    let result;

    try {
        new Reservation(1, "2026-12-01T10:00", "2026-12-01T11:00", nbPersonnes);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("nbPersonnes_5_return_5", () => {
    // Arrange
    const nbPersonnes = 5;
    const expected = 5;

    // Act
    let result;

    try {
        result = new Reservation(1, "2026-12-01T10:00", "2026-12-01T11:00", nbPersonnes).nbPersonnes;
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
