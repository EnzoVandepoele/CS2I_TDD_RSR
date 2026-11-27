const Reservation = require("../../class/reservation");

// Remet le vrai fetch après chaque test
afterEach(() => {
    jest.restoreAllMocks();
});

// ---------- update (base json-server mockée) ----------

const salle = { id: 1, nom: "Salle 1", capacite: 10 };
const reservations = [
    { id: 1, idSalle: 1, dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T10:00", nbPersonnes: 5 },
    { id: 2, idSalle: 1, dateDebut: "2026-11-25T14:00", dateFin: "2026-11-25T15:00", nbPersonnes: 5 },
];
const candidate = { idSalle: "1", dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T11:00", nbPersonnes: 8 };

test("updateReservation_idNull_returnAucunAppelBase", async () => {
    // Arrange
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => [] });
    const expected = { message: "L'id de la réservation est obligatoire", appelsBase: 0 };

    // Act
    let result;

    try {
        await Reservation.update(null, candidate);
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("updateReservation_nbPersonnes0_returnAucunAppelBase", async () => {
    // Arrange
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => [] });
    const expected = { message: "Le nombre de personnes doit être supérieur à 0", appelsBase: 0 };

    // Act
    let result;

    try {
        await Reservation.update(1, { ...candidate, nbPersonnes: 0 });
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("updateReservation_conflitAvecAutre_returnRefusSansPatch", async () => {
    // Arrange
    const fetchMock = jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => salle })
        .mockResolvedValueOnce({ ok: true, json: async () => reservations });
    const expected = { message: "Cette salle est déjà réservée sur ce créneau (25/11/2026 14:00 – 15:00).", appelsBase: 2 };

    // Act
    let result;

    try {
        await Reservation.update(1, { ...candidate, dateFin: "2026-11-25T14:30" });
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("updateReservation_chevaucheSonAncienCreneau_returnReservationModifiee", async () => {
    // Arrange
    const expected = { id: 1, idSalle: 1, dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T11:00", nbPersonnes: 8 };
    jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => salle })
        .mockResolvedValueOnce({ ok: true, json: async () => reservations })
        .mockResolvedValueOnce({ ok: true, status: 200, json: async () => expected });

    // Act
    let result;

    try {
        result = await Reservation.update(1, candidate);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("updateReservation_valide_returnRequetePatch", async () => {
    // Arrange
    const expected = {
        url: "http://localhost:3000/reservations/1",
        method: "PATCH",
        body: { idSalle: 1, dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T11:00", nbPersonnes: 8 },
    };
    const fetchMock = jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => salle })
        .mockResolvedValueOnce({ ok: true, json: async () => reservations })
        .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ id: 1 }) });

    // Act
    let result;

    try {
        await Reservation.update(1, candidate);
        const [url, options] = fetchMock.mock.calls[2];
        result = { url, method: options.method, body: JSON.parse(options.body) };
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("updateReservation_reservationIntrouvable_returnIntrouvable", async () => {
    // Arrange
    const expected = "Réservation introuvable";
    jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => salle })
        .mockResolvedValueOnce({ ok: true, json: async () => reservations })
        .mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) });

    // Act
    let result;

    try {
        await Reservation.update(99, { ...candidate, dateDebut: "2026-11-25T16:00", dateFin: "2026-11-25T17:00" });
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("updateReservation_apiRefuse_returnErreurModification", async () => {
    // Arrange
    const expected = "Erreur lors de la modification de la réservation";
    jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => salle })
        .mockResolvedValueOnce({ ok: true, json: async () => reservations })
        .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });

    // Act
    let result;

    try {
        await Reservation.update(1, candidate);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
