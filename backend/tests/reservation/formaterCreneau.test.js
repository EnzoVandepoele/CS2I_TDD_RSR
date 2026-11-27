const Reservation = require("../../class/reservation");

// ---------- formaterCreneau ----------

test("formaterCreneauReservation_memeJour_returnHeureDeFinSeule", () => {
    // Arrange
    const reservation = { dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T10:00" };
    const expected = "25/11/2026 09:00 – 10:00";

    // Act
    let result;

    try {
        result = Reservation.formaterCreneau(reservation);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("formaterCreneauReservation_plusieursJours_returnDatesCompletes", () => {
    // Arrange
    const reservation = { dateDebut: "2026-11-25T09:00", dateFin: "2026-11-26T10:00" };
    const expected = "25/11/2026 09:00 – 26/11/2026 10:00";

    // Act
    let result;

    try {
        result = Reservation.formaterCreneau(reservation);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
