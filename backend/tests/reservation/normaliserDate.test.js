const Reservation = require("../../class/reservation");

// ---------- normaliserDate ----------

test("normaliserDateReservation_jourSeul_returnMinuit", () => {
    // Arrange
    const valeur = "2026-11-25";
    const expected = "2026-11-25T00:00";

    // Act
    let result;

    try {
        result = Reservation.normaliserDate(valeur);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("normaliserDateReservation_avecSecondes_returnSansSecondes", () => {
    // Arrange
    const valeur = "2026-11-25T09:30:00.000Z";
    const expected = "2026-11-25T09:30";

    // Act
    let result;

    try {
        result = Reservation.normaliserDate(valeur);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("normaliserDateReservation_null_returnVide", () => {
    // Arrange
    const valeur = null;
    const expected = "";

    // Act
    let result;

    try {
        result = Reservation.normaliserDate(valeur);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
