const Reservation = require("../../class/reservation");

// ---------- chevauche ----------

const neufDix = { dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T10:00" };

test("chevaucheReservation_creneauxCroises_returnTrue", () => {
    // Arrange
    const autre = { dateDebut: "2026-11-25T09:30", dateFin: "2026-11-25T11:00" };
    const expected = true;

    // Act
    let result;

    try {
        result = Reservation.chevauche(neufDix, autre);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("chevaucheReservation_finEgaleDebut_returnFalse", () => {
    // Arrange
    const autre = { dateDebut: "2026-11-25T10:00", dateFin: "2026-11-25T11:00" };
    const expected = false;

    // Act
    let result;

    try {
        result = Reservation.chevauche(neufDix, autre);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("chevaucheReservation_creneauxSepares_returnFalse", () => {
    // Arrange
    const autre = { dateDebut: "2026-11-25T14:00", dateFin: "2026-11-25T15:00" };
    const expected = false;

    // Act
    let result;

    try {
        result = Reservation.chevauche(neufDix, autre);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
