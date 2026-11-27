const Reservation = require("../../class/reservation");

// ---------- joursCouverts ----------

test("joursCouvertsReservation_unJour_returnCeJour", () => {
    // Arrange
    const reservation = { dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T10:00" };
    const expected = ["2026-11-25"];

    // Act
    let result;

    try {
        result = Reservation.joursCouverts(reservation);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("joursCouvertsReservation_surDeuxMois_returnTousLesJours", () => {
    // Arrange
    const reservation = { dateDebut: "2026-11-30T09:00", dateFin: "2026-12-02T10:00" };
    const expected = ["2026-11-30", "2026-12-01", "2026-12-02"];

    // Act
    let result;

    try {
        result = Reservation.joursCouverts(reservation);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("joursCouvertsReservation_dateManquante_returnVide", () => {
    // Arrange
    const reservation = { dateDebut: "2026-11-25T09:00", dateFin: null };
    const expected = [];

    // Act
    let result;

    try {
        result = Reservation.joursCouverts(reservation);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});
