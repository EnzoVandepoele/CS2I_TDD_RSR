const Salle = require("../../class/salle");

// Remet le vrai fetch après chaque test
afterEach(() => {
    jest.restoreAllMocks();
});

// ---------- update (base json-server mockée) ----------

test("updateSalle_sansId_returnPasEnregistree", async () => {
    // Arrange
    const salle = new Salle("Salle A", 10);
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => [] });
    const expected = { message: "La salle n'est pas enregistrée", appelsBase: 0 };

    // Act
    let result;

    try {
        await salle.update({ capacite: 12 });
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("updateSalle_nomVide_returnAucunAppelBase", async () => {
    // Arrange
    const salle = new Salle("Salle A", 10, 1);
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => [] });
    const expected = { message: "Le nom de la salle est obligatoire", appelsBase: 0 };

    // Act
    let result;

    try {
        await salle.update({ nom: "" });
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("updateSalle_capacite0_returnAucunAppelBase", async () => {
    // Arrange
    const salle = new Salle("Salle A", 10, 1);
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => [] });
    const expected = { message: "La capacité doit être supérieure à 0", appelsBase: 0 };

    // Act
    let result;

    try {
        await salle.update({ capacite: 0 });
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("updateSalle_nomExistant_returnExisteDeja", async () => {
    // Arrange
    const salle = new Salle("Salle A", 10, 1);
    const expected = "Une salle avec ce nom existe déjà";
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, nom: "Salle A", capacite: 10 }, { id: 2, nom: "Salle B", capacite: 4 }],
    });

    // Act
    let result;

    try {
        await salle.update({ nom: "salle b" });
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("updateSalle_capaciteSeule_returnSalleModifiee", async () => {
    // Arrange
    const salle = new Salle("Salle A", 10, 1);
    const expected = new Salle("Salle A", 12, 1);
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, nom: "Salle A", capacite: 12 }),
    });

    // Act
    let result;

    try {
        result = await salle.update({ capacite: 12 });
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toStrictEqual(expected);
});

test("updateSalle_valide_returnRequetePatch", async () => {
    // Arrange
    const salle = new Salle("Salle A", 10, 1);
    const expected = {
        url: "http://localhost:3000/salles/1",
        method: "PATCH",
        body: { nom: "Salle Z", capacite: 10 },
    };
    const fetchMock = jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, nom: "Salle A", capacite: 10 }] })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, nom: "Salle Z", capacite: 10 }) });

    // Act
    let result;

    try {
        await salle.update({ nom: "  Salle Z " });
        const [url, options] = fetchMock.mock.calls[1];
        result = { url, method: options.method, body: JSON.parse(options.body) };
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("updateSalle_salleIntrouvable_returnIntrouvable", async () => {
    // Arrange
    const salle = new Salle("Salle A", 10, 99);
    const expected = "Salle introuvable";
    jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) });

    // Act
    let result;

    try {
        await salle.update({ capacite: 12 });
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("updateSalle_apiRefuse_returnSalleInchangee", async () => {
    // Arrange
    const salle = new Salle("Salle A", 10, 1);
    const expected = { message: "Erreur lors de la modification de la salle", capacite: 10 };
    jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });

    // Act
    let result;

    try {
        await salle.update({ capacite: 12 });
    } catch (error) {
        result = { message: error.message, capacite: salle.capacite };
    }

    // Assert
    expect(result).toEqual(expected);
});
