const Reservation = require("../../class/reservation");

// ---------- aujourdhui (horloge mockée) ----------

afterEach(() => {
    jest.useRealTimers();
});

test("aujourdhuiReservation_horlogeFixee_returnJourLocal", () => {
    // Arrange
    jest.useFakeTimers({ now: new Date(2026, 10, 25, 23, 30) });
    const expected = "2026-11-25";

    // Act
    let result;

    try {
        result = Reservation.aujourdhui();
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
