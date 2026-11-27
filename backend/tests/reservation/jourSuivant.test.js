const Reservation = require("../../class/reservation");

// ---------- jourSuivant ----------

test("jourSuivantReservation_finDeMois_returnPremierDuMoisSuivant", () => {
    // Arrange
    const jour = "2026-11-30";
    const expected = "2026-12-01";

    // Act
    let result;

    try {
        result = Reservation.jourSuivant(jour);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("jourSuivantReservation_finAnnee_returnPremierJanvier", () => {
    // Arrange
    const jour = "2026-12-31";
    const expected = "2027-01-01";

    // Act
    let result;

    try {
        result = Reservation.jourSuivant(jour);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
