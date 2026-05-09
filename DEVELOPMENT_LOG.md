# DEVELOPMENT_LOG.md

## 2026-05-09

### Fonctionnalites ajoutees

- Creation du prototype Phaser 3 + TypeScript + Vite.
- Ajout de l'ecran d'accueil.
- Ajout du puzzle 1 avec 3 dalles lumineuses a remplir.
- Ajout du controle clavier de Kyle avec fleches/WASD.
- Ajout du sort de vent de Kyle avec Espace.
- Ajout d'un cooldown du sort de vent.
- Ajout d'un effet visuel de cone/rafale pour le sort de vent.
- Ajout de Paul qui suit Kyle.
- Ajout de dialogues contextuels entre Kyle et Paul.
- Ajout d'une condition de victoire quand les 3 dalles sont activees.
- Ajout d'une scene de dialogue d'introduction entre le menu et le puzzle 1.
- Ajout d'un systeme de dialogue reutilisable base sur des tableaux `{ speaker, text }`.
- Ajout d'un systeme de collision AABB axe par axe.
- Ajout de tests unitaires pour les collisions et le dialogue d'introduction.
- Ajout d'un systeme audio simple :
  - musique principale en boucle
  - effets sonores placeholder
  - mute/unmute avec la touche `M`

### Assets integres ou prevus

- Kyle :
  - source : `public/assets/kyle/KyleLiriel_pose.png`
  - decoupes : `kyle-front.png`, `kyle-back.png`, `kyle-left.png`, `kyle-right.png`
- Paul :
  - source : `public/assets/paul/PaulLiriel.png`
  - decoupes : `paul-front.png`, `paul-back.png`, `paul-left.png`, `paul-right.png`
- Audio :
  - musique principale : `public/assets/audio/music-main.mp3`
  - effets placeholder : `public/assets/audio/sfx/*.wav`
- Objets de puzzle :
  - formes Phaser temporaires pour feuilles, caisse et dalles lumineuses.

### Problemes corriges

- Git n'etait pas disponible localement ; une installation portable MinGit a ete ajoutee pour travailler dans le terminal.
- Le depot GitHub etait vide ; le projet a ete initialise et pousse.
- La structure du projet a ete reorganisee sous `src/game/`.
- Kyle regardait du mauvais cote lors du mouvement vers la droite ; les assets ont ensuite ete remplaces par une feuille de poses statiques.
- Les personnages traversaient les obstacles ; un systeme de collision a ete ajoute.
- Les personnages pouvaient encore passer sur les feuilles et la caisse ; ces objets sont maintenant inclus comme obstacles dynamiques.
- `AGENTS.md` contenait un arbre avec des caracteres casses ; il a ete remis en ASCII et mis a jour.

### Decisions de design

- Garder une architecture simple :
  - scenes Phaser minces
  - donnees de dialogue dans `src/game/data/dialogues.ts`
  - logique de collision pure dans `CollisionSystem.ts`
  - logique de puzzle dans `QuestSystem.ts`
- Utiliser des sprites 2D chibi RPG pour Kyle et Paul, mais conserver les objets de puzzle en formes placeholder pour l'instant.
- Resoudre les collisions axe par axe pour permettre de longer les obstacles.
- Garder la musique et les effets sonores dans `public/assets/audio/`.
- Ajouter des tests seulement pour les systemes purs ou les donnees simples, afin d'eviter une suite fragile dependante du canvas.

### Prochaines etapes recommandees

- Manual playtest complet du flux menu -> intro -> puzzle -> victoire.
- Ameliorer le feedback visuel des dalles activees.
- Ajouter un vrai ecran de victoire ou une scene de fin.
- Ajouter un raccourci de reset du puzzle pour faciliter les tests.
- Ajouter un affichage debug optionnel des hitboxes.
- Remplacer les objets placeholder par des sprites coherents avec Kyle et Paul.
- Equilibrer la portee et la force du sort de vent apres test manuel.
- Ajouter des dialogues contextuels supplementaires sans bloquer le rythme du puzzle.
- Si plusieurs puzzles sont ajoutes, extraire une configuration de niveau plus claire.
