const Salle = require("../../class/salle");

// Remet le vrai fetch après chaque test
afterEach(() => {
    jest.restoreAllMocks();
});

// ---------- create (base json-server mockée) ----------

test("createSalle_nomVide_returnAucunAppelBase", async () => {
    // Arrange
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => [] });
    const expected = { message: "Le nom de la salle est obligatoire", appelsBase: 0 };

    // Act
    let result;

    try {
        await Salle.create("", 10);
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("createSalle_capacite0_returnAucunAppelBase", async () => {
    // Arrange
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => [] });
    const expected = { message: "La capacité doit être supérieure à 0", appelsBase: 0 };

    // Act
    let result;

    try {
        await Salle.create("Salle D", 0);
    } catch (error) {
        result = { message: error.message, appelsBase: fetchMock.mock.calls.length };
    }

    // Assert
    expect(result).toEqual(expected);
});

test("createSalle_nomExistant_returnExisteDeja", async () => {
    // Arrange
    const nom = "Salle A";
    const expected = "Une salle avec ce nom existe déjà";
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, nom: "Salle A", capacite: 10 }],
    });

    // Act
    let result;

    try {
        await Salle.create(nom, 10);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("createSalle_nomAutreCasse_returnExisteDeja", async () => {
    // Arrange
    const nom = "  salle a ";
    const expected = "Une salle avec ce nom existe déjà";
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, nom: "Salle A", capacite: 10 }],
    });

    // Act
    let result;

    try {
        await Salle.create(nom, 10);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("createSalle_valide_returnSalleAvecId", async () => {
    // Arrange
    const nom = "Salle D";
    const capacite = 8;
    const expected = new Salle("Salle D", 8, 4);
    jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => [] })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 4, nom: "Salle D", capacite: 8 }) });

    // Act
    let result;

    try {
        result = await Salle.create(nom, capacite);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toStrictEqual(expected);
});

test("createSalle_valide_returnRequetePost", async () => {
    // Arrange
    const expected = {
        url: "http://localhost:3000/salles",
        method: "POST",
        body: { nom: "Salle D", capacite: 8 },
    };
    const fetchMock = jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => [] })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 4, nom: "Salle D", capacite: 8 }) });

    // Act
    let result;

    try {
        await Salle.create("  Salle D  ", 8);
        const [url, options] = fetchMock.mock.calls[1];
        result = { url, method: options.method, body: JSON.parse(options.body) };
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toEqual(expected);
});

test("createSalle_apiRefuse_returnErreurCreation", async () => {
    // Arrange
    const expected = "Erreur lors de la création de la salle";
    jest.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => [] })
        .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });

    // Act
    let result;

    try {
        await Salle.create("Salle D", 8);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});

test("createSalle_baseInjoignable_returnImpossibleContacter", async () => {
    // Arrange
    const expected = "Impossible de contacter la base de données";
    jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("ECONNREFUSED"));

    // Act
    let result;

    try {
        await Salle.create("Salle D", 8);
    } catch (error) {
        result = error.message;
    }

    // Assert
    expect(result).toBe(expected);
});
