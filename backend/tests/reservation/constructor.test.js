const Reservation = require("../../class/reservation");

// ---------- id de la salle ----------

test("reservation_idSalleUndefined_returnObligatoire", () => {
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

test("reservation_dateDebutTexte_returnFormatInvalide", () => {
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

test("reservation_dateFinTexte_returnFormatInvalide", () => {
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

test("reservation_dateDebutValide_returnDate", () => {
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

test("reservation_dateFinAvantDebut_returnFinApresDebut", () => {
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

test("reservation_dateFinEgaleDebut_returnFinApresDebut", () => {
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

test("reservation_nbPersonnes0_returnSuperieurA0", () => {
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

test("reservation_nbPersonnesNegatif_returnSuperieurA0", () => {
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

test("reservation_nbPersonnesDecimal_returnEntier", () => {
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

test("reservation_nbPersonnesTexte_returnEntier", () => {
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

test("reservation_nbPersonnes5_return5", () => {
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
