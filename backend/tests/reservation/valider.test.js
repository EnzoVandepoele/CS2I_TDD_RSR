const Reservation = require("../../class/reservation");

// ---------- valider (renvoie un message ou null, ne lève jamais d'erreur) ----------

const salle = { id: 1, nom: "Salle 1", capacite: 10 };
const reservations = [
    { id: 1, idSalle: 1, dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T10:00", nbPersonnes: 5 },
];

test("validerReservation_sansSalle_returnChoisirSalle", () => {
    // Arrange
    const candidate = { idSalle: "1", dateDebut: "2026-11-25T14:00", dateFin: "2026-11-25T15:00", nbPersonnes: 5 };
    const expected = "Veuillez choisir une salle.";

    // Act
    let result;

    try {
        result = Reservation.valider(candidate, undefined, reservations);
    } catch (error) {
        result = "erreur levée : " + error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("validerReservation_nbPersonnes0_returnMessageSuperieurA0", () => {
    // Arrange
    const candidate = { idSalle: "1", dateDebut: "2026-11-25T14:00", dateFin: "2026-11-25T15:00", nbPersonnes: 0 };
    const expected = "Le nombre de personnes doit être supérieur à 0";

    // Act
    let result;

    try {
        result = Reservation.valider(candidate, salle, reservations);
    } catch (error) {
        result = "erreur levée : " + error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("validerReservation_depasseCapacite_returnMaximum", () => {
    // Arrange
    const candidate = { idSalle: "1", dateDebut: "2026-11-25T14:00", dateFin: "2026-11-25T15:00", nbPersonnes: 11 };
    const expected = "Salle 1 accueille au maximum 10 personnes.";

    // Act
    let result;

    try {
        result = Reservation.valider(candidate, salle, reservations);
    } catch (error) {
        result = "erreur levée : " + error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("validerReservation_egaleCapacite_returnNull", () => {
    // Arrange
    const candidate = { idSalle: "1", dateDebut: "2026-11-25T14:00", dateFin: "2026-11-25T15:00", nbPersonnes: 10 };
    const expected = null;

    // Act
    let result;

    try {
        result = Reservation.valider(candidate, salle, reservations);
    } catch (error) {
        result = "erreur levée : " + error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("validerReservation_conflit_returnDejaReservee", () => {
    // Arrange
    const candidate = { idSalle: "1", dateDebut: "2026-11-25T09:30", dateFin: "2026-11-25T11:00", nbPersonnes: 5 };
    const expected = "Cette salle est déjà réservée sur ce créneau (25/11/2026 09:00 – 10:00).";

    // Act
    let result;

    try {
        result = Reservation.valider(candidate, salle, reservations);
    } catch (error) {
        result = "erreur levée : " + error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("validerReservation_modificationDeSoiMeme_returnNull", () => {
    // Arrange
    const candidate = { idSalle: "1", dateDebut: "2026-11-25T09:30", dateFin: "2026-11-25T11:00", nbPersonnes: 5 };
    const idIgnore = 1;
    const expected = null;

    // Act
    let result;

    try {
        result = Reservation.valider(candidate, salle, reservations, idIgnore);
    } catch (error) {
        result = "erreur levée : " + error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
