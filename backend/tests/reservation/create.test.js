const Reservation = require("../../class/reservation");

// Remet le vrai fetch après chaque test
afterEach(() => {
    jest.restoreAllMocks();
});

// ---------- create (base json-server mockée) ----------

const candidate = { idSalle: "1", dateDebut: "2026-11-25T14:00", dateFin: "2026-11-25T15:00", nbPersonnes: 5 };
const salle = { id: 1, nom: "Salle 1", capacite: 10 };
const reservations = [{ id: 1, idSalle: 1, dateDebut: "2026-11-25T09:00", dateFin: "2026-11-25T10:00", nbPersonnes: 5 }];

test("createReservation_nbPersonnes0_returnAucunAppelBase", async () => {
    // Arrange
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => [] });
    const expected = { message: "Le nombre de personnes doit être supérieur à 0", appelsBase: 0 };

    // Act
    let result;

    try {
        await Reservation.create({ ...candidate, nbPersonnes: 0 });
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("createReservation_salleIntrouvable_returnIntrouvable", async () => {
    // Arrange
    const expected = "Salle introuvable";
    jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) });

    // Act
    let result;

    try {
        await Reservation.create(candidate);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("createReservation_depasseCapacite_returnRefusSansPost", async () => {
    // Arrange
    const fetchMock = jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => salle })
        .mockResolvedValueOnce({ ok: true, json: async () => reservations });
    const expected = { message: "Salle 1 accueille au maximum 10 personnes.", appelsBase: 2 };

    // Act
    let result;

    try {
        await Reservation.create({ ...candidate, nbPersonnes: 11 });
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("createReservation_conflit_returnRefusSansPost", async () => {
    // Arrange
    const fetchMock = jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => salle })
        .mockResolvedValueOnce({ ok: true, json: async () => reservations });
    const expected = { message: "Cette salle est déjà réservée sur ce créneau (25/11/2026 09:00 – 10:00).", appelsBase: 2 };

    // Act
    let result;

    try {
        await Reservation.create({ ...candidate, dateDebut: "2026-11-25T09:30", dateFin: "2026-11-25T11:00" });
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("createReservation_valide_returnReservationAvecId", async () => {
    // Arrange
    const expected = { id: 2, idSalle: 1, dateDebut: "2026-11-25T14:00", dateFin: "2026-11-25T15:00", nbPersonnes: 5 };
    jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => salle })
        .mockResolvedValueOnce({ ok: true, json: async () => reservations })
        .mockResolvedValueOnce({ ok: true, json: async () => expected });

    // Act
    let result;

    try {
        result = await Reservation.create(candidate);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("createReservation_valide_returnRequetePost", async () => {
    // Arrange
    const expected = {
        url: "http://localhost:3000/reservations",
        method: "POST",
        body: { idSalle: 1, dateDebut: "2026-11-25T14:00", dateFin: "2026-11-25T15:00", nbPersonnes: 5 },
    };
    const fetchMock = jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => salle })
        .mockResolvedValueOnce({ ok: true, json: async () => reservations })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 2 }) });

    // Act
    let result;

    try {
        await Reservation.create({ ...candidate, dateDebut: "2026-11-25T14:00:00" });
        const [url, options] = fetchMock.mock.calls[2];
        result = { url, method: options.method, body: JSON.parse(options.body) };
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("createReservation_apiRefuse_returnErreurCreation", async () => {
    // Arrange
    const expected = "Erreur lors de la création de la réservation";
    jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => salle })
        .mockResolvedValueOnce({ ok: true, json: async () => reservations })
        .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });

    // Act
    let result;

    try {
        await Reservation.create(candidate);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("createReservation_baseInjoignable_returnImpossibleContacter", async () => {
    // Arrange
    const expected = "Impossible de contacter la base de données";
    jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("ECONNREFUSED"));

    // Act
    let result;

    try {
        await Reservation.create(candidate);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
