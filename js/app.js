/**
 * app.js — Interface : calendrier, formulaires, liste des réservations.
 *
 * Tout le métier (validation, formats de date, appels à la base) vient des
 * classes Salle et Reservation de backend/class : ce fichier ne fait que
 * brancher le DOM dessus.
 */

calendarjs.setDictionary({
    'January': 'Janvier', 'February': 'Février', 'March': 'Mars', 'April': 'Avril',
    'May': 'Mai', 'June': 'Juin', 'July': 'Juillet', 'August': 'Août',
    'September': 'Septembre', 'October': 'Octobre', 'November': 'Novembre', 'December': 'Décembre',
    'Sunday': 'Dimanche', 'Monday': 'Lundi', 'Tuesday': 'Mardi', 'Wednesday': 'Mercredi',
    'Thursday': 'Jeudi', 'Friday': 'Vendredi', 'Saturday': 'Samedi'
});

const { Calendar } = calendarjs;

// Même ordre que le dictionnaire ci-dessus : sert à relire le mois affiché.
const MOIS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const roomFilter = document.getElementById('room-filter');
const editRoomButton = document.getElementById('edit-room-button');
const deleteRoomButton = document.getElementById('delete-room-button');
const roomInput = document.getElementById('room');
const calendarRoot = document.getElementById('calendar');
const dateStartInput = document.getElementById('dateDebut');
const dateEndInput = document.getElementById('dateFin');
const peopleInput = document.getElementById('nbPersonnes');
const submitButton = document.getElementById('submit-button');
const cancelEditButton = document.getElementById('cancel-edit-button');
const formTitle = document.getElementById('form-title');
const status = document.getElementById('status');
const reservationList = document.getElementById('day-reservations');
const selectedDateTitle = document.getElementById('selected-date-title');
const roomDialog = document.getElementById('room-dialog');
const roomDialogTitle = document.getElementById('room-dialog-title');
const roomForm = document.getElementById('room-form');
const roomNameInput = document.getElementById('room-name');
const roomCapacityInput = document.getElementById('room-capacity');
const roomSubmitButton = document.getElementById('room-submit-button');

let rooms = [];
let reservations = [];
let selectedDate = Reservation.aujourdhui();
let editedId = null;       // réservation en cours de modification
let editedRoomId = null;   // salle en cours de modification (popup)
let calendrier = null;
let joursReserves = new Set();

// -------------------------------------------------------------------------
// Chargement des listes et messages
// -------------------------------------------------------------------------

// appelerApi() est défini par backend/class/salle.js : on réutilise le même
// accès à la base plutôt que d'en écrire un second.
async function lister(chemin) {
    const reponse = await appelerApi(chemin);

    if (!reponse.ok) {
        throw new Error(`Erreur lors du chargement (${reponse.status})`);
    }

    return reponse.json();
}

async function rechargerDonnees() {
    [rooms, reservations] = await Promise.all([
        lister('/salles'),
        lister('/reservations')
    ]);
}

/** Les erreurs sont signalées par une alerte ; le reste par la ligne d'état. */
function signalerErreur(message) {
    window.alert(message);
}

function showStatus(message, kind) {
    status.textContent = message;
    status.className = kind || '';
}

function getSelectedRoomId() {
    return roomFilter.value;
}

// -------------------------------------------------------------------------
// Affichage
// -------------------------------------------------------------------------

function renderReservationsForDate() {
    const entries = Reservation.duJour(reservations, getSelectedRoomId(), selectedDate);

    selectedDateTitle.textContent = `Réservations du ${Reservation.formaterJour(selectedDate)}`;
    reservationList.replaceChildren();

    if (entries.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'muted';
        empty.textContent = 'Aucune réservation ce jour-là.';
        reservationList.append(empty);
        return;
    }

    entries.forEach((reservation) => {
        const item = document.createElement('li');

        const label = document.createElement('span');
        label.textContent = `${Reservation.formaterCreneau(reservation)} · ${reservation.nbPersonnes} personne(s)`;

        const edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'link';
        edit.textContent = 'Modifier';
        edit.addEventListener('click', () => startEdit(reservation));

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'link danger';
        remove.textContent = 'Annuler';
        remove.addEventListener('click', () => cancelReservation(reservation));

        item.append(label, edit, remove);
        reservationList.append(item);
    });
}

function renderCalendar() {
    calendarRoot.replaceChildren();

    joursReserves = new Set();
    reservations
        .filter(reservation => Reservation.memeId(reservation.idSalle, getSelectedRoomId()))
        .forEach((reservation) => {
            Reservation.joursCouverts(reservation).forEach(jour => joursReserves.add(jour));
        });

    calendrier = Calendar(calendarRoot, {
        type: 'inline',
        value: selectedDate,
        format: 'DD/MM/YYYY HH:mm',
        startingDay: 1,
        footer: false,
        onchange: (self, value) => {
            selectedDate = Reservation.jourDe(String(value));
            if (editedId === null) {
                dateStartInput.value = `${selectedDate}T09:00`;
                dateEndInput.value = `${selectedDate}T10:00`;
            }
            renderReservationsForDate();
        }
    });

    marquerJoursReserves();
    renderReservationsForDate();
}

/**
 * Colore les cases des jours réservés.
 * L'option `data` de CalendarJS ne produit aucun rendu dans cette version :
 * on pose donc nous-mêmes une classe sur les cases concernées.
 */
function marquerJoursReserves() {
    if (!calendrier) {
        return;
    }

    const mois = MOIS_FR.indexOf(String(calendrier.month));
    const cellules = calendarRoot.querySelectorAll('.lm-calendar-container[data-view="days"] .lm-calendar-content > div');

    cellules.forEach((cellule) => {
        cellule.classList.remove('jour-reserve');

        if (mois < 0 || cellule.getAttribute('data-grey') === 'true') {
            return;
        }

        const jour = `${calendrier.year}-${String(mois + 1).padStart(2, '0')}-${cellule.textContent.trim().padStart(2, '0')}`;
        if (joursReserves.has(jour)) {
            cellule.classList.add('jour-reserve');
        }
    });
}

// Le composant redessine sa grille à chaque navigation (mois précédent/suivant,
// molette, clavier) : on repasse derrière lui pour reposer les couleurs.
['click', 'wheel', 'keyup'].forEach((type) => {
    calendarRoot.addEventListener(type, () => setTimeout(marquerJoursReserves, 0));
});

function populateRooms() {
    const previous = roomFilter.value;

    [roomFilter, roomInput].forEach((select) => {
        select.replaceChildren();
        rooms.forEach((room) => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = `${room.nom} · ${room.capacite} places`;
            select.append(option);
        });
        select.disabled = rooms.length === 0;
    });

    const resteDesSalles = rooms.length > 0;
    submitButton.disabled = !resteDesSalles;
    editRoomButton.disabled = !resteDesSalles;
    deleteRoomButton.disabled = !resteDesSalles;

    if (resteDesSalles) {
        const selected = Salle.trouver(rooms, previous) ? previous : String(rooms[0].id);
        roomFilter.value = selected;
        roomInput.value = selected;
        syncCapacity();
    }
}

function syncCapacity() {
    const salle = Salle.trouver(rooms, roomInput.value);
    peopleInput.max = salle ? salle.capacite : '';
}

// -------------------------------------------------------------------------
// Réservations : créer, modifier, annuler
// -------------------------------------------------------------------------

function startEdit(reservation) {
    editedId = reservation.id;
    roomInput.value = String(reservation.idSalle);
    dateStartInput.value = Reservation.normaliserDate(reservation.dateDebut);
    dateEndInput.value = Reservation.normaliserDate(reservation.dateFin);
    peopleInput.value = reservation.nbPersonnes;
    syncCapacity();

    formTitle.textContent = 'Modifier la réservation';
    submitButton.textContent = 'Enregistrer les modifications';
    cancelEditButton.hidden = false;
    showStatus('Modifiez le créneau puis enregistrez.', '');
    dateStartInput.focus();
}

function stopEdit() {
    editedId = null;
    formTitle.textContent = 'Nouvelle réservation';
    submitButton.textContent = 'Réserver';
    cancelEditButton.hidden = true;
}

async function cancelReservation(reservation) {
    if (!window.confirm(`Annuler la réservation du ${Reservation.formaterCreneau(reservation)} ?`)) {
        return;
    }

    try {
        await Reservation.delete(reservation.id);

        if (Reservation.memeId(editedId, reservation.id)) {
            stopEdit();
        }

        await rechargerDonnees();
        renderCalendar();
        showStatus('Réservation annulée.', 'success');
    } catch (error) {
        signalerErreur(error.message);
    }
}

document.getElementById('reservation-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const candidate = {
        idSalle: roomInput.value,
        dateDebut: dateStartInput.value,
        dateFin: dateEndInput.value,
        nbPersonnes: Number(peopleInput.value)
    };

    // Premier filtre côté site, avec les données déjà chargées.
    // Reservation.create / update revérifient ensuite dans la base.
    const salle = Salle.trouver(rooms, candidate.idSalle);
    const erreur = Reservation.valider(candidate, salle, reservations, editedId);
    if (erreur) {
        signalerErreur(erreur);
        return;
    }

    submitButton.disabled = true;
    try {
        if (editedId === null) {
            await Reservation.create(candidate);
            showStatus('Réservation enregistrée.', 'success');
        } else {
            await Reservation.update(editedId, candidate);
            showStatus('Réservation modifiée.', 'success');
            stopEdit();
        }

        await rechargerDonnees();
        selectedDate = Reservation.jourDe(candidate.dateDebut);
        roomFilter.value = String(candidate.idSalle);
        renderCalendar();
    } catch (error) {
        signalerErreur(error.message);
    } finally {
        submitButton.disabled = rooms.length === 0;
    }
});

cancelEditButton.addEventListener('click', () => {
    stopEdit();
    showStatus('Modification abandonnée.', '');
});

// -------------------------------------------------------------------------
// Salles : créer, modifier, supprimer
// -------------------------------------------------------------------------

function ouvrirPopupSalle(salle) {
    editedRoomId = salle ? salle.id : null;

    roomDialogTitle.textContent = salle ? 'Modifier la salle' : 'Nouvelle salle';
    roomSubmitButton.textContent = salle ? 'Enregistrer' : 'Créer la salle';
    roomNameInput.value = salle ? salle.nom : '';
    roomCapacityInput.value = salle ? salle.capacite : 10;

    roomDialog.showModal();
    roomNameInput.focus();
    roomNameInput.select();
}

document.getElementById('new-room-button').addEventListener('click', () => ouvrirPopupSalle(null));

editRoomButton.addEventListener('click', () => {
    const salle = Salle.trouver(rooms, getSelectedRoomId());
    if (salle) {
        ouvrirPopupSalle(salle);
    }
});

deleteRoomButton.addEventListener('click', async () => {
    const salle = Salle.trouver(rooms, getSelectedRoomId());
    if (!salle) {
        return;
    }

    if (!window.confirm(`Supprimer définitivement « ${salle.nom} » ?`)) {
        return;
    }

    try {
        // Salle.delete refuse la suppression si la salle a des réservations.
        await Salle.delete(salle.id);

        await rechargerDonnees();
        populateRooms();
        renderCalendar();
        showStatus(`Salle « ${salle.nom} » supprimée.`, 'success');
    } catch (error) {
        signalerErreur(error.message);
    }
});

document.getElementById('close-room-dialog').addEventListener('click', () => roomDialog.close());

roomForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const donnees = {
        nom: roomNameInput.value.trim(),
        capacite: Number(roomCapacityInput.value)
    };

    const erreur = Salle.valider(donnees);
    if (erreur) {
        signalerErreur(erreur);
        return;
    }

    roomSubmitButton.disabled = true;
    try {
        let message;

        if (editedRoomId === null) {
            const creee = await Salle.create(donnees.nom, donnees.capacite);
            message = `Salle « ${creee.nom} » créée.`;
            roomFilter.value = String(creee.id);
        } else {
            // update est une méthode d'instance : on reconstruit la salle connue,
            // puis on lui demande d'appliquer les nouvelles valeurs.
            const actuelle = Salle.trouver(rooms, editedRoomId);
            const salle = new Salle(actuelle.nom, actuelle.capacite, actuelle.id);
            await salle.update(donnees);
            message = `Salle « ${salle.nom} » modifiée.`;
        }

        await rechargerDonnees();
        populateRooms();
        syncCapacity();
        roomDialog.close();
        renderCalendar();
        showStatus(message, 'success');
    } catch (error) {
        signalerErreur(error.message);
    } finally {
        roomSubmitButton.disabled = false;
    }
});

// -------------------------------------------------------------------------
// Changements de salle
// -------------------------------------------------------------------------

roomFilter.addEventListener('change', () => {
    if (editedId === null) {
        roomInput.value = roomFilter.value;
    }
    syncCapacity();
    renderCalendar();
});

roomInput.addEventListener('change', () => {
    if (editedId === null) {
        roomFilter.value = roomInput.value;
        renderCalendar();
    }
    syncCapacity();
});

// -------------------------------------------------------------------------
// Démarrage
// -------------------------------------------------------------------------

async function initialize() {
    try {
        await rechargerDonnees();
        populateRooms();
        dateStartInput.value = `${selectedDate}T09:00`;
        dateEndInput.value = `${selectedDate}T10:00`;
        renderCalendar();
        showStatus('Données chargées depuis la base de données.', 'success');
    } catch (error) {
        showStatus('Données indisponibles.', 'error');
        signalerErreur(`${error.message}. Lancez « npm run db » puis rechargez la page.`);
    }
}

initialize();

// Export pour Jest ; ignoré par le navigateur (même principe que les classes).
if (typeof module !== "undefined") {
    module.exports = {
        showStatus,
        signalerErreur,
        getSelectedRoomId,
        renderReservationsForDate,
        marquerJoursReserves,
        populateRooms,
        syncCapacity,
        startEdit,
        stopEdit
    };
}
