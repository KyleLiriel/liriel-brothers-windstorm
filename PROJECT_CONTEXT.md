# PROJECT_CONTEXT.md

## 1. Concept du jeu

`Liriel Brothers: Windstorm` est un prototype de jeu video 2D fantasy centre sur deux jeunes freres mages.

- Kyle Liriel a 8 ans. C'est un apprenti mage de vent.
- Paul Liriel a 12 ans. C'est un apprenti mage de foudre.
- Kyle fait souvent des betises, pleure facilement, improvise beaucoup, et croit que Paul est secretement un mage noir.
- Paul surveille Kyle, le provoque, le protege a sa maniere, et pense que Kyle est un lutin farceur deguise en petit frere.

Le ton vise est drole, tendre, aventureux et legerement absurde.

## 2. Etat actuel du prototype

- Le jeu possede un ecran d'accueil avec le titre `Liriel Brothers: Windstorm` et un bouton/texte `Start`.
- Apres l'ecran d'accueil, le joueur passe par une scene de dialogue d'introduction.
- Le puzzle numero 1 demarre apres ce dialogue.
- L'objectif du puzzle 1 est de remplir ou activer 3 dalles lumineuses.
- Le compteur affiche l'etat du puzzle sous la forme `Glowing tiles filled: 0 / 3`.
- Kyle est le personnage controle par le joueur avec les fleches ou WASD.
- Paul est visible et suit Kyle a courte distance.
- La carte contient des obstacles fixes, dont les bordures et des murs interieurs.
- La carte contient aussi des objets mobiles de puzzle, feuilles et caisse, pousses par le sort de vent.
- Les personnages ne doivent plus traverser les murs, feuilles ou caisse.
- Les collisions utilisent une resolution AABB simple, axe par axe, afin de permettre de longer les obstacles sans bloquer inutilement le mouvement.
- Kyle peut lancer un sort de vent avec Espace.
- Le sort de vent a un cooldown court et affiche un cone/effet de rafale visible.
- Des dialogues contextuels peuvent apparaitre pendant le puzzle.
- La condition de victoire se declenche quand les 3 dalles lumineuses sont remplies.
- Un message final indique la victoire quand le puzzle est resolu.
- Un systeme audio existe deja avec musique de fond, effets sonores placeholder, et touche `M` pour mute/unmute.

## 3. Dialogue d'introduction

Un dialogue existe entre l'ecran d'accueil et le puzzle 1.

- Il se lance apres `Start`, avant le puzzle 1.
- Il explique que Kyle a derange des dalles magiques et doit les ranger.
- Paul est charge de le surveiller.
- Le dialogue insiste sur la dynamique entre les freres :
  - Kyle accuse Paul d'etre un mage noir.
  - Paul appelle Kyle un lutin farceur.
- Le dialogue est stocke sous forme de tableau de lignes avec `speaker` et `text`.
- Il peut etre avance avec Entree, Espace ou un clic.
- La boite de dialogue affiche clairement le nom du personnage et le texte en bas de l'ecran.

## 4. Assets et direction artistique

- Le style actuel est 2D fantasy / chibi RPG.
- Kyle est un jeune garcon blond, mage de vent, avec une tenue bleue, turquoise et or.
- Paul est le grand frere mage de foudre, plus age, dans un style fantasy coherent avec Kyle.
- Les sprites de deplacement necessaires sont :
  - face / bas
  - dos / haut
  - gauche
  - droite
- Les sprites de Kyle viennent de `public/assets/kyle/KyleLiriel_pose.png` et de ses decoupes `kyle-*.png`.
- Les sprites de Paul viennent de `public/assets/paul/PaulLiriel.png` et de ses decoupes `paul-*.png`.
- Les sprites doivent rester lisibles en petit format dans la scene top-down.
- Les objets de puzzle et tuiles utilisent encore des formes Phaser simples.
- La musique principale est chargee depuis `public/assets/audio/music-main.mp3`.
- Les effets sonores actuels sont des placeholders locaux dans `public/assets/audio/sfx/`.

## 5. Mecaniques principales

- Deplacement de Kyle avec fleches ou WASD.
- Paul suit Kyle automatiquement.
- Collisions entre personnages et obstacles :
  - murs fixes
  - feuilles
  - caisse en bois
- Sort de vent de Kyle avec Espace.
- Effet visuel de cone/rafale de vent.
- Cooldown court pour eviter le spam du sort.
- Activation/remplissage des dalles lumineuses quand les objets sont bien places.
- Progression du puzzle via compteur.
- Transition actuelle : menu -> dialogue d'introduction -> puzzle 1.
- Fin du puzzle quand les 3 dalles sont activees.
- Musique de fond en boucle et sons declenches par les actions principales.
- Touche `M` pour mute/unmute.

## 6. Pistes d'amelioration

- Rendre les dalles activees plus visibles.
- Ajouter une animation ou un feedback quand une dalle est remplie.
- Ajouter un ecran de victoire plus clair, separe du simple message d'objectif.
- Ajouter plus de dialogues contextuels entre Kyle et Paul.
- Ameliorer la lisibilite des personnages et de leurs hitboxes.
- Ajouter un mode debug optionnel pour afficher les hitboxes.
- Ajouter plus tard une ambiance sonore et des effets audio mieux produits, mais ne pas agrandir le systeme audio sans besoin clair.
- Ajouter un bouton ou raccourci de redemarrage du puzzle.
- Envisager une configuration de niveau plus explicite si plusieurs puzzles sont ajoutes.

## 7. Notes pour Codex

- Ne pas casser le comportement existant.
- Garder le code simple et maintenable.
- Preferer des systemes reutilisables :
  - scenes / etats de jeu
  - dialogues sous forme de tableaux
  - niveaux configurables
  - fonctions de collision pures et testables
- Ajouter ou mettre a jour les tests quand c'est pertinent.
- Avant une modification importante, verifier les fichiers existants et respecter l'architecture du projet.
- Eviter les refactorisations larges si une solution locale et claire suffit.
- Conserver les assets sources fournis dans `public/assets/` quand ils sont utilises par le jeu.
- Ne pas ajouter d'audio externe, de backend, ou de dependances non necessaires.

## Derniere session

Session du 2026-05-09 :

- Ajout d'une scene `IntroDialogueScene` entre l'ecran titre et le puzzle 1.
- Ajout du dialogue d'introduction Paul/Kyle dans `src/game/data/dialogues.ts`.
- Ajout d'un test pour verifier le dialogue d'introduction.
- Mise a jour de `main.ts` pour inclure la nouvelle scene.
- Mise a jour de `BootScene` pour lancer l'intro depuis `Start`.
- Retrait du dialogue d'ouverture directement dans `MainScene`, afin que le puzzle commence sans bloquer les controles.
- Mise a jour de `AGENTS.md` pour corriger la structure attendue et inclure les systemes/scenes actuels.
- Validation recente : `npm test`, `npx tsc --noEmit` et `npm run build` passent.
