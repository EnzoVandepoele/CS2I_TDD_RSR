const Reservation = require("../../class/reservation");

// ---------- formaterDate ----------

test("formaterDateReservation_dateHeure_returnJourEtHeure", () => {
    // Arrange
    const valeur = "2026-11-25T09:30";
    const expected = "25/11/2026 09:30";

    // Act
    let result;

    try {
        result = Reservation.formaterDate(valeur);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
