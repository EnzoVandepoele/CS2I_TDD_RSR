const Reservation = require("../../class/reservation");

// ---------- formaterJour ----------

test("formaterJourReservation_dateHeure_returnFormatFrancais", () => {
    // Arrange
    const valeur = "2026-11-25T09:30";
    const expected = "25/11/2026";

    // Act
    let result;

    try {
        result = Reservation.formaterJour(valeur);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
