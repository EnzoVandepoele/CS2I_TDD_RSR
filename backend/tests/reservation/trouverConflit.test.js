const Reservation = require("../../class/reservation");

// ---------- trouverConflit ----------

const reservations = [
    { id: 1, idSalle: 1, dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T10:00" },
];

test("trouverConflitReservation_memeSalleMemeCreneau_returnReservation", () => {
    // Arrange
    const candidate = { idSalle: "1", dateDebut: "2026-11-25T09:30", dateFin: "2026-11-25T11:00" };
    const expected = reservations[0];

    // Act
    let result;

    try {
        result = Reservation.trouverConflit(reservations, candidate);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("trouverConflitReservation_autreSalle_returnNull", () => {
    // Arrange
    const candidate = { idSalle: "2", dateDebut: "2026-11-25T09:30", dateFin: "2026-11-25T11:00" };
    const expected = null;

    // Act
    let result;

    try {
        result = Reservation.trouverConflit(reservations, candidate);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("trouverConflitReservation_reservationModifiee_returnNull", () => {
    // Arrange
    const candidate = { idSalle: "1", dateDebut: "2026-11-25T09:30", dateFin: "2026-11-25T11:00" };
    const idIgnore = 1;
    const expected = null;

    // Act
    let result;

    try {
        result = Reservation.trouverConflit(reservations, candidate, idIgnore);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
