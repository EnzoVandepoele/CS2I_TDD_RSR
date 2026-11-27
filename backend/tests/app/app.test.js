/**
 * Tests de js/app.js : la partie « site » (affichage et formulaires).
 *
 * app.js ne contient que du câblage DOM : on lui donne donc une page
 * (celle d'index.html), un faux calendrier et un faux accès à la base,
 * puis on vérifie ce qu'il affiche.
 *
 * @jest-environment @stryker-mutator/jest-runner/jest-env/jsdom
 */

const fs = require("fs");
const path = require("path");

const RACINE = path.join(__dirname, "..", "..", "..");
const CHEMIN_APP = path.join(RACINE, "js", "app.js");

// Le corps de la vraie page, sans les <script> : les id testés sont donc
// toujours ceux d'index.html.
const CORPS_PAGE = fs.readFileSync(path.join(RACINE, "index.html"), "utf8")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "")
    .match(/<body[^>]*>([\s\S]*)<\/body>/)[1];

const SALLES = [
    { id: 1, nom: "Salle 1", capacite: 10 },
    { id: 2, nom: "Salle 2", capacite: 20 },
];

const RESERVATIONS = [
    { id: 1, idSalle: 1, dateDebut: "2026-11-23T09:00", dateFin: "2026-11-23T10:00", nbPersonnes: 5 },
    { id: 2, idSalle: 2, dateDebut: "2026-11-25T14:00", dateFin: "2026-11-25T15:00", nbPersonnes: 8 },
];

let app;                 // les fonctions exportées par app.js
let choisirJour;         // le onchange donné au calendrier par app.js
let alertes;

/** Faux calendrier : une grille de novembre 2026, comme celle de CalendarJS. */
function fauxCalendrier(racine, options) {
    choisirJour = options.onchange;

    const cases = [];
    for (let jour = 1; jour <= 30; jour++) {
        cases.push(`<div data-grey="false">${jour}</div>`);
    }

    racine.innerHTML =
        '<div class="lm-calendar-container" data-view="days">' +
        '<div class="lm-calendar-content">' + cases.join("") + "</div></div>";

    return { month: "Novembre", year: 2026, value: options.value };
}

/**
 * Charge app.js dans une page neuve.
 * @param {object} options - salles, reservations, ou baseInjoignable
 */
async function chargerApp({ salles = SALLES, reservations = RESERVATIONS, baseInjoignable = false } = {}) {
    document.body.innerHTML = CORPS_PAGE;

    alertes = [];
    window.alert = (message) => alertes.push(String(message));
    window.confirm = () => true;

    global.Salle = require("../../class/salle");
    global.Reservation = require("../../class/reservation");
    global.calendarjs = { setDictionary: () => {}, Calendar: fauxCalendrier };

    // appelerApi() vient de salle.js dans le navigateur : ici on le remplace
    // pour que les tests ne lancent jamais json-server.
    global.appelerApi = async (chemin) => {
        if (baseInjoignable) {
            throw new Error("Impossible de contacter la base de données");
        }
        return { ok: true, json: async () => (chemin === "/salles" ? salles : reservations) };
    };

    jest.isolateModules(() => {
        app = require(CHEMIN_APP);
    });

    // initialize() est asynchrone : on laisse le chargement se terminer.
    await new Promise((resoudre) => setTimeout(resoudre, 0));
}

const $ = (id) => document.getElementById(id);
const textes = (selecteur) => [...document.querySelectorAll(selecteur)].map((el) => el.textContent);

// ---------- chargement de la page ----------

test("initialize_donneesChargees_returnSallesDansLesListes", async () => {
    // Arrange / Act
    await chargerApp();

    // Assert
    expect(textes("#room-filter option")).toEqual(["Salle 1 · 10 places", "Salle 2 · 20 places"]);
    expect($("room").options.length).toBe(2);
});

test("initialize_donneesChargees_returnStatutSucces", async () => {
    // Arrange / Act
    await chargerApp();

    // Assert
    expect($("status").textContent).toBe("Données chargées depuis la base de données.");
    expect($("status").className).toBe("success");
});

test("initialize_baseInjoignable_returnAlerte", async () => {
    // Arrange / Act
    await chargerApp({ baseInjoignable: true });

    // Assert
    expect(alertes).toHaveLength(1);
    expect(alertes[0]).toContain("Impossible de contacter la base de données");
    expect($("status").className).toBe("error");
});

// ---------- liste des réservations du jour ----------

test("renderReservationsForDate_jourReserve_returnCreneauAuFormatFrancais", async () => {
    // Arrange
    await chargerApp();

    // Act : on sélectionne le 23/11/2026 dans le calendrier
    choisirJour(null, "2026-11-23");

    // Assert
    const ligne = $("day-reservations").textContent;
    expect(ligne).toContain("23/11/2026 09:00 – 10:00");
    expect(ligne).toContain("5 personne(s)");
    expect($("selected-date-title").textContent).toBe("Réservations du 23/11/2026");
});

test("renderReservationsForDate_jourReserve_returnBoutonsModifierEtAnnuler", async () => {
    // Arrange
    await chargerApp();

    // Act
    choisirJour(null, "2026-11-23");

    // Assert
    expect(textes("#day-reservations button")).toEqual(["Modifier", "Annuler"]);
});

test("renderReservationsForDate_jourLibre_returnAucuneReservation", async () => {
    // Arrange
    await chargerApp();

    // Act
    choisirJour(null, "2026-11-10");

    // Assert
    expect($("day-reservations").textContent).toBe("Aucune réservation ce jour-là.");
});

test("renderReservationsForDate_autreSalle_returnReservationsDeCetteSalleSeulement", async () => {
    // Arrange
    await chargerApp();

    // Act : la salle 2 n'a rien le 23, mais a une réunion le 25
    $("room-filter").value = "2";
    choisirJour(null, "2026-11-23");
    const le23 = $("day-reservations").textContent;
    choisirJour(null, "2026-11-25");

    // Assert
    expect(le23).toBe("Aucune réservation ce jour-là.");
    expect($("day-reservations").textContent).toContain("25/11/2026 14:00 – 15:00");
});

// ---------- calendrier ----------

test("marquerJoursReserves_salle1_returnClasseSurLeJourReserve", async () => {
    // Arrange / Act
    await chargerApp();

    // Assert : seul le 23 novembre est réservé pour la salle 1
    expect(textes(".lm-calendar-content .jour-reserve")).toEqual(["23"]);
});

test("marquerJoursReserves_salleSansReservation_returnAucuneCaseColoree", async () => {
    // Arrange / Act
    await chargerApp({ reservations: [] });

    // Assert
    expect(document.querySelectorAll(".lm-calendar-content .jour-reserve")).toHaveLength(0);
});

// ---------- formulaire de réservation ----------

test("startEdit_reservation_returnFormulairePreRempli", async () => {
    // Arrange
    await chargerApp();

    // Act
    app.startEdit(RESERVATIONS[0]);

    // Assert
    expect($("form-title").textContent).toBe("Modifier la réservation");
    expect($("dateDebut").value).toBe("2026-11-23T09:00");
    expect($("dateFin").value).toBe("2026-11-23T10:00");
    expect($("nbPersonnes").value).toBe("5");
    expect($("cancel-edit-button").hidden).toBe(false);
});

test("stopEdit_apresModification_returnFormulaireEnCreation", async () => {
    // Arrange
    await chargerApp();
    app.startEdit(RESERVATIONS[0]);

    // Act
    app.stopEdit();

    // Assert
    expect($("form-title").textContent).toBe("Nouvelle réservation");
    expect($("submit-button").textContent).toBe("Réserver");
    expect($("cancel-edit-button").hidden).toBe(true);
});

test("syncCapacity_salleChoisie_returnMaxEgalALaCapacite", async () => {
    // Arrange
    await chargerApp();

    // Act
    $("room").value = "2";
    app.syncCapacity();

    // Assert
    expect($("nbPersonnes").max).toBe("20");
});

// ---------- salles ----------

test("populateRooms_aucuneSalle_returnBoutonsDesactives", async () => {
    // Arrange / Act
    await chargerApp({ salles: [] });

    // Assert
    expect($("room-filter").disabled).toBe(true);
    expect($("submit-button").disabled).toBe(true);
    expect($("edit-room-button").disabled).toBe(true);
    expect($("delete-room-button").disabled).toBe(true);
});

test("editRoomButton_clic_returnPopupPreRemplie", async () => {
    // Arrange
    await chargerApp();
    HTMLDialogElement.prototype.showModal = function () { this.open = true; };

    // Act
    $("room-filter").value = "2";
    $("edit-room-button").click();

    // Assert
    expect($("room-dialog-title").textContent).toBe("Modifier la salle");
    expect($("room-name").value).toBe("Salle 2");
    expect($("room-capacity").value).toBe("20");
});

// ---------- messages ----------

test("signalerErreur_message_returnAlerte", async () => {
    // Arrange
    await chargerApp();

    // Act
    app.signalerErreur("Salle déjà réservée");

    // Assert
    expect(alertes).toEqual(["Salle déjà réservée"]);
});
