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

**50 tests** (`npx jest`)

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