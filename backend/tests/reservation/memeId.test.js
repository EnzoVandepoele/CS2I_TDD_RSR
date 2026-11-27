const Reservation = require("../../class/reservation");

// ---------- memeId ----------

test("memeIdReservation_nombreEtTexte_returnTrue", () => {
    // Arrange
    const expected = true;

    // Act
    let result;

    try {
        result = Reservation.memeId(2, "2");
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("memeIdReservation_idsDifferents_returnFalse", () => {
    // Arrange
    const expected = false;

    // Act
    let result;

    try {
        result = Reservation.memeId(1, "2");
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
