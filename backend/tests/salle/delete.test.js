const Salle = require("../../class/salle");

// Remet le vrai fetch après chaque test
afterEach(() => {
    jest.restoreAllMocks();
});

// ---------- delete (base json-server mockée) ----------

test("deleteSalle_idNull_returnAucunAppelBase", async () => {
    // Arrange
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => [] });
    const expected = { message: "L'id de la salle est obligatoire", appelsBase: 0 };

    // Act
    let result;

    try {
        await Salle.delete(null);
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("deleteSalle_avecReservations_returnRefus", async () => {
    // Arrange
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => [{ id: 1, idSalle: 1 }] });
    const expected = { message: "Impossible de supprimer une salle qui a des réservations", appelsBase: 1 };

    // Act
    let result;

    try {
        await Salle.delete(1);
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("deleteSalle_valide_returnTrue", async () => {
    // Arrange
    const expected = true;
    jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => [] })
        .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) });

    // Act
    let result;

    try {
        result = await Salle.delete(1);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("deleteSalle_valide_returnRequeteDelete", async () => {
    // Arrange
    const expected = { url: "http://localhost:3000/salles/1", method: "DELETE" };
    const fetchMock = jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => [] })
        .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) });

    // Act
    let result;

    try {
        await Salle.delete(1);
        const [url, options] = fetchMock.mock.calls[1];
        result = { url, method: options.method };
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("deleteSalle_salleIntrouvable_returnIntrouvable", async () => {
    // Arrange
    const expected = "Salle introuvable";
    jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => [] })
        .mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) });

    // Act
    let result;

    try {
        await Salle.delete(99);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("deleteSalle_apiRefuse_returnErreurSuppression", async () => {
    // Arrange
    const expected = "Erreur lors de la suppression de la salle";
    jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => [] })
        .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });

    // Act
    let result;

    try {
        await Salle.delete(1);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
