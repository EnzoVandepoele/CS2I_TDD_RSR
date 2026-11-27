const Reservation = require("../../class/reservation");

// ---------- jourDe ----------

test("jourDeReservation_dateHeure_returnJour", () => {
    // Arrange
    const valeur = "2026-11-25T09:30";
    const expected = "2026-11-25";

    // Act
    let result;

    try {
        result = Reservation.jourDe(valeur);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
