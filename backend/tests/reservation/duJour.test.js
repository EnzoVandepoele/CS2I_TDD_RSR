const Reservation = require("../../class/reservation");

// ---------- duJour ----------

const reservations = [
    { id: 1, idSalle: 1, dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T10:00" },
    { id: 2, idSalle: 1, dateDebut: "2026-11-24T09:00", dateFin: "2026-11-26T10:00" },
    { id: 3, idSalle: 2, dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T10:00" },
    { id: 4, idSalle: 1, dateDebut: "2026-11-27T09:00", dateFin: "2026-11-27T10:00" },
];

test("duJourReservation_salleEtJour_returnReservationsQuiCouvrentLeJour", () => {
    // Arrange
    const expected = [1, 2];

    // Act
    let result;

    try {
        result = Reservation.duJour(reservations, "1", "2026-11-25").map((r) => r.id);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("duJourReservation_jourSansReservation_returnVide", () => {
    // Arrange
    const expected = [];

    // Act
    let result;

    try {
        result = Reservation.duJour(reservations, "1", "2026-11-28");
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});
