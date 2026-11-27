const Reservation = require("../../class/reservation");

// Remet le vrai fetch après chaque test
afterEach(() => {
    jest.restoreAllMocks();
});

// ---------- delete (base json-server mockée) ----------

test("deleteReservation_idNull_returnAucunAppelBase", async () => {
    // Arrange
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    const expected = { message: "L'id de la réservation est obligatoire", appelsBase: 0 };

    // Act
    let result;

    try {
        await Reservation.delete(null);
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("deleteReservation_valide_returnTrue", async () => {
    // Arrange
    const expected = true;
    jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) });

    // Act
    let result;

    try {
        result = await Reservation.delete(1);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("deleteReservation_valide_returnRequeteDelete", async () => {
    // Arrange
    const expected = { url: "http://localhost:3000/reservations/1", method: "DELETE" };
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) });

    // Act
    let result;

    try {
        await Reservation.delete(1);
        const [url, options] = fetchMock.mock.calls[0];
        result = { url, method: options.method };
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("deleteReservation_reservationIntrouvable_returnIntrouvable", async () => {
    // Arrange
    const expected = "Réservation introuvable";
    jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) });

    // Act
    let result;

    try {
        await Reservation.delete(99);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("deleteReservation_apiRefuse_returnErreurSuppression", async () => {
    // Arrange
    const expected = "Erreur lors de la suppression de la réservation";
    jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });

    // Act
    let result;

    try {
        await Reservation.delete(1);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
