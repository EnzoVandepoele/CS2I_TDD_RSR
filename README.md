# CS2I_TDD_RSR
CS2I - TP de TDD : Système de Réservation de Salles de Réunion

## Variables requises :
Salle :
* Nom
* Capacité max (en personne)
* Date début réu
* Date fin réu
* Nb personne à la réunion

# Aide 

Installer Jest :
```Bash
npm install --save-dev jest
```

Lancer les tests : 
```Bash
npx jest
```

Lancer la bdd :
```Bash
npm run db
```

# Tests

**100 tests** (`npx jest`)

- Un fichier par méthode : `backend/tests/<classe>/<methode>.test.js`
- Nom des tests : `sujet_test_resultat`
- Les méthodes qui appellent la base (`create`, `update`, `delete`) sont testées avec un **mock de `fetch`** : les tests ne lancent jamais json-server.

## Salle — constructeur (`salle/constructor.test.js`)
| Test | Description |
|---|---|
| `salle_sansId_returnIdNull` | Une salle pas encore enregistrée a un id `null` |
| `salle_id1_return1` | L'id donné est conservé |
| `salle_nomVide_returnObligatoire` | Nom `""` refusé |
| `salle_nomEspaces_returnObligatoire` | Nom `"   "` refusé |
| `salle_nomNombre_returnObligatoire` | Nom qui n'est pas du texte refusé |
| `salle_nomSalleA_returnSalleA` | Nom valide conservé |
| `salle_capacite0_returnSuperieureA0` | Capacité `0` refusée (limite) |
| `salle_capaciteNegative_returnSuperieureA0` | Capacité `-1` refusée |
| `salle_capaciteDecimale_returnEntier` | Capacité `2.5` refusée |
| `salle_capaciteTexte_returnEntier` | Capacité `"dix"` refusée |
| `salle_capacite2_return2` | Capacité valide conservée |

## Salle — create (`salle/create.test.js`)
| Test | Description |
|---|---|
| `createSalle_nomVide_returnAucunAppelBase` | Nom vide refusé **avant** d'appeler la base |
| `createSalle_capacite0_returnAucunAppelBase` | Capacité 0 refusée **avant** d'appeler la base |
| `createSalle_nomExistant_returnExisteDeja` | Nom déjà pris refusé |
| `createSalle_nomAutreCasse_returnExisteDeja` | `" salle a "` = doublon de `"Salle A"` |
| `createSalle_valide_returnSalleAvecId` | Renvoie la salle avec l'id donné par la base |
| `createSalle_valide_returnRequetePost` | Envoie un `POST /salles` avec le nom nettoyé |
| `createSalle_apiRefuse_returnErreurCreation` | Erreur de la base (500) signalée |
| `createSalle_baseInjoignable_returnImpossibleContacter` | Serveur éteint signalé |

## Salle — update (`salle/update.test.js`)
| Test | Description |
|---|---|
| `updateSalle_sansId_returnPasEnregistree` | Salle sans id refusée, aucun appel à la base |
| `updateSalle_nomVide_returnAucunAppelBase` | Nom vide refusé **avant** d'appeler la base |
| `updateSalle_capacite0_returnAucunAppelBase` | Capacité 0 refusée **avant** d'appeler la base |
| `updateSalle_nomExistant_returnExisteDeja` | Nom déjà pris par une autre salle refusé |
| `updateSalle_capaciteSeule_returnSalleModifiee` | Modifie un seul champ, l'autre est conservé |
| `updateSalle_valide_returnRequetePatch` | Envoie un `PATCH /salles/:id` |
| `updateSalle_salleIntrouvable_returnIntrouvable` | Id inconnu (404) signalé |
| `updateSalle_apiRefuse_returnSalleInchangee` | Erreur de la base : l'objet n'est pas modifié |

## Salle — delete (`salle/delete.test.js`)
| Test | Description |
|---|---|
| `deleteSalle_idNull_returnAucunAppelBase` | Id vide refusé, aucun appel à la base |
| `deleteSalle_avecReservations_returnRefus` | Salle avec réservations : refus, pas de DELETE |
| `deleteSalle_valide_returnTrue` | Suppression réussie : renvoie `true` |
| `deleteSalle_valide_returnRequeteDelete` | Envoie un `DELETE /salles/:id` |
| `deleteSalle_salleIntrouvable_returnIntrouvable` | Id inconnu (404) signalé |
| `deleteSalle_apiRefuse_returnErreurSuppression` | Erreur de la base (500) signalée |

## Salle — trouver (`salle/trouver.test.js`)
| Test | Description |
|---|---|
| `trouverSalle_idNombre_returnSalle` | Trouve la salle avec un id nombre (`2`) |
| `trouverSalle_idTexte_returnSalle` | Trouve la salle avec un id texte (`"2"`, venant d'un `<select>`) |
| `trouverSalle_idInconnu_returnUndefined` | Id absent de la liste : `undefined` |

## Salle — valider (`salle/valider.test.js`)
| Test | Description |
|---|---|
| `validerSalle_donneesValides_returnNull` | Données valides : `null` |
| `validerSalle_nomVide_returnMessageObligatoire` | Renvoie le message (ne lève pas d'erreur) |
| `validerSalle_capacite0_returnMessageSuperieureA0` | Renvoie le message (ne lève pas d'erreur) |

## Reservation — constructeur (`reservation/constructor.test.js`)
| Test | Description |
|---|---|
| `reservation_idSalleUndefined_returnObligatoire` | Réservation sans salle refusée |
| `reservation_dateDebutTexte_returnFormatInvalide` | Date de début invalide refusée |
| `reservation_dateFinTexte_returnFormatInvalide` | Date de fin invalide refusée |
| `reservation_dateDebutValide_returnDate` | Date valide conservée |
| `reservation_dateFinAvantDebut_returnFinApresDebut` | Fin avant le début refusée |
| `reservation_dateFinEgaleDebut_returnFinApresDebut` | Fin égale au début refusée (limite) |
| `reservation_nbPersonnes0_returnSuperieurA0` | `0` personne refusé (limite) |
| `reservation_nbPersonnesNegatif_returnSuperieurA0` | `-1` personne refusé |
| `reservation_nbPersonnesDecimal_returnEntier` | `2.5` personnes refusé |
| `reservation_nbPersonnesTexte_returnEntier` | `"cinq"` refusé |
| `reservation_nbPersonnes5_return5` | Nombre valide conservé |

## Reservation — memeId (`reservation/memeId.test.js`)
| Test | Description |
|---|---|
| `memeIdReservation_nombreEtTexte_returnTrue` | `2` et `"2"` sont le même id |
| `memeIdReservation_idsDifferents_returnFalse` | `1` et `"2"` sont différents |

## Reservation — normaliserDate (`reservation/normaliserDate.test.js`)
| Test | Description |
|---|---|
| `normaliserDateReservation_jourSeul_returnMinuit` | `"2026-11-25"` → `"2026-11-25T00:00"` |
| `normaliserDateReservation_avecSecondes_returnSansSecondes` | Secondes et fuseau retirés |
| `normaliserDateReservation_null_returnVide` | Date absente → `""` |

## Reservation — jourDe (`reservation/jourDe.test.js`)
| Test | Description |
|---|---|
| `jourDeReservation_dateHeure_returnJour` | `"2026-11-25T09:30"` → `"2026-11-25"` |

## Reservation — jourSuivant (`reservation/jourSuivant.test.js`)
| Test | Description |
|---|---|
| `jourSuivantReservation_finDeMois_returnPremierDuMoisSuivant` | 30/11 → 01/12 |
| `jourSuivantReservation_finAnnee_returnPremierJanvier` | 31/12 → 01/01 de l'année suivante |

## Reservation — aujourdhui (`reservation/aujourdhui.test.js`)
| Test | Description |
|---|---|
| `aujourdhuiReservation_horlogeFixee_returnJourLocal` | Horloge mockée : renvoie le jour local |

## Reservation — formaterJour (`reservation/formaterJour.test.js`)
| Test | Description |
|---|---|
| `formaterJourReservation_dateHeure_returnFormatFrancais` | → `"25/11/2026"` |

## Reservation — formaterDate (`reservation/formaterDate.test.js`)
| Test | Description |
|---|---|
| `formaterDateReservation_dateHeure_returnJourEtHeure` | → `"25/11/2026 09:30"` |

## Reservation — formaterCreneau (`reservation/formaterCreneau.test.js`)
| Test | Description |
|---|---|
| `formaterCreneauReservation_memeJour_returnHeureDeFinSeule` | → `"25/11/2026 09:00 – 10:00"` |
| `formaterCreneauReservation_plusieursJours_returnDatesCompletes` | Les deux dates complètes |

## Reservation — joursCouverts (`reservation/joursCouverts.test.js`)
| Test | Description |
|---|---|
| `joursCouvertsReservation_unJour_returnCeJour` | Réunion d'un jour → 1 jour |
| `joursCouvertsReservation_surDeuxMois_returnTousLesJours` | Du 30/11 au 02/12 → 3 jours |
| `joursCouvertsReservation_dateManquante_returnVide` | Date absente → `[]` |

## Reservation — duJour (`reservation/duJour.test.js`)
| Test | Description |
|---|---|
| `duJourReservation_salleEtJour_returnReservationsQuiCouvrentLeJour` | Garde la bonne salle, y compris les réunions sur plusieurs jours |
| `duJourReservation_jourSansReservation_returnVide` | Jour libre → `[]` |

## Reservation — chevauche (`reservation/chevauche.test.js`)
| Test | Description |
|---|---|
| `chevaucheReservation_creneauxCroises_returnTrue` | 9h-10h et 9h30-11h se chevauchent |
| `chevaucheReservation_finEgaleDebut_returnFalse` | 9h-10h et 10h-11h ne se chevauchent pas (limite) |
| `chevaucheReservation_creneauxSepares_returnFalse` | Créneaux éloignés |

## Reservation — trouverConflit (`reservation/trouverConflit.test.js`)
| Test | Description |
|---|---|
| `trouverConflitReservation_memeSalleMemeCreneau_returnReservation` | Renvoie la réservation en conflit |
| `trouverConflitReservation_autreSalle_returnNull` | Même créneau mais autre salle : pas de conflit |
| `trouverConflitReservation_reservationModifiee_returnNull` | Une réservation n'est pas en conflit avec elle-même |

## Reservation — valider (`reservation/valider.test.js`)
| Test | Description |
|---|---|
| `validerReservation_sansSalle_returnChoisirSalle` | Pas de salle choisie |
| `validerReservation_nbPersonnes0_returnMessageSuperieurA0` | Règle du constructeur : renvoie le message (ne lève pas) |
| `validerReservation_depasseCapacite_returnMaximum` | 11 personnes pour 10 places refusé |
| `validerReservation_egaleCapacite_returnNull` | 10 personnes pour 10 places accepté (limite) |
| `validerReservation_conflit_returnDejaReservee` | Créneau déjà pris |
| `validerReservation_modificationDeSoiMeme_returnNull` | Modifier sa propre réservation n'est pas un conflit |

## Reservation — create (`reservation/create.test.js`)
| Test | Description |
|---|---|
| `createReservation_nbPersonnes0_returnAucunAppelBase` | Données invalides refusées **avant** d'appeler la base |
| `createReservation_salleIntrouvable_returnIntrouvable` | Salle absente de la base (404) |
| `createReservation_depasseCapacite_returnRefusSansPost` | Capacité vérifiée avec la salle **de la base**, pas de POST |
| `createReservation_conflit_returnRefusSansPost` | Conflit vérifié avec les réservations **de la base**, pas de POST |
| `createReservation_valide_returnReservationAvecId` | Renvoie la réservation avec l'id donné par la base |
| `createReservation_valide_returnRequetePost` | `POST /reservations`, idSalle en nombre, dates normalisées |
| `createReservation_apiRefuse_returnErreurCreation` | Erreur de la base (500) signalée |
| `createReservation_baseInjoignable_returnImpossibleContacter` | Serveur éteint signalé |

## Reservation — update (`reservation/update.test.js`)
| Test | Description |
|---|---|
| `updateReservation_idNull_returnAucunAppelBase` | Id vide refusé, aucun appel à la base |
| `updateReservation_nbPersonnes0_returnAucunAppelBase` | Données invalides refusées **avant** d'appeler la base |
| `updateReservation_conflitAvecAutre_returnRefusSansPatch` | Conflit avec une autre réservation, pas de PATCH |
| `updateReservation_chevaucheSonAncienCreneau_returnReservationModifiee` | Prolonger sa réservation n'est pas un conflit |
| `updateReservation_valide_returnRequetePatch` | `PATCH /reservations/:id` |
| `updateReservation_reservationIntrouvable_returnIntrouvable` | Id inconnu (404) signalé |
| `updateReservation_apiRefuse_returnErreurModification` | Erreur de la base (500) signalée |

## Reservation — delete (`reservation/delete.test.js`)
| Test | Description |
|---|---|
| `deleteReservation_idNull_returnAucunAppelBase` | Id vide refusé, aucun appel à la base |
| `deleteReservation_valide_returnTrue` | Suppression réussie : renvoie `true` |
| `deleteReservation_valide_returnRequeteDelete` | `DELETE /reservations/:id` |
| `deleteReservation_reservationIntrouvable_returnIntrouvable` | Id inconnu (404) signalé |
| `deleteReservation_apiRefuse_returnErreurSuppression` | Erreur de la base (500) signalée |