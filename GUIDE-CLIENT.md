# Modifier le site SATIA

Ce guide est pour la personne qui met à jour fournor.com. L’adresse de l’administration est `https://cms.fournor.com/admin`. Le site public est `https://fournor.com`.

L’écran est en français. Un contenu seulement enregistré reste invisible. Il apparaît après **Publier**, puis quelques minutes d’attente (voir le point 8).

## 1. Se connecter

1. Ouvrez `https://cms.fournor.com/admin`.
2. Entrez l’adresse e-mail et le mot de passe qu’on vous a remis.
3. À gauche, ouvrez **Gestionnaire de contenu**. Les rubriques du site y sont listées : Produit, Actualite, Bloc publicitaire, Accueil, Page, et les autres.

## 2. Ajouter un produit

1. **Gestionnaire de contenu**, puis **Produit**, puis **Créer une nouvelle entrée**.
2. Remplissez **nom**.
3. Remplissez **slug**. C’est le nom court dans l’adresse de la page : minuscules, tirets, sans espace ni accent. Exemple : `pain-complet`. Il est le même pour les trois langues. Ne le changez plus une fois le produit publié.
4. Choisissez une **gamme** déjà existante.
5. Remplissez les textes à afficher (chapo, description, et le reste si vous les avez).
6. Dans **images**, ajoutez une ou plusieurs photos.
7. Dans **ficheTechnique**, ajoutez le fichier de la fiche technique (fichier, pas une photo).
8. Cliquez sur **Publier**.
9. Refaites les textes en anglais et en arabe, comme au point 7. La photo, la fiche et le slug ne se remettent pas : ils sont communs aux trois langues.

## 3. Publier une actualité

1. **Gestionnaire de contenu**, puis **Actualite**, puis **Créer une nouvelle entrée**.
2. Remplissez **titre**, **slug**, **date**, **image**, **extrait** et **contenu**. La date est obligatoire.
3. Cliquez sur **Publier**.
4. Passez à l’anglais, puis à l’arabe (point 7), traduisez les textes, et publiez chaque langue. L’image et la date sont communes.

## 4. Changer une bannière, ou en programmer une

Les bannières sont dans **Bloc publicitaire**.

Pour en modifier une : ouvrez-la, changez l’image ou les textes, puis **Publier**.

Pour une période précise :

1. Laissez **actif** coché. Décoché, la bannière ne s’affiche pas.
2. **emplacement** : `accueil-grille` pour les images de la page d’accueil, ou `accueil-bandeau` pour le bandeau défilant. Écrivez exactement l’un de ces deux mots.
3. **ordre** : un plus petit nombre s’affiche avant un plus grand.
4. **dateDebut** : premier jour et heure d’affichage. **dateFin** : dernier jour et heure. Laissez les deux vides pour un affichage permanent.
5. **Publier**.

Le texte alternatif de l’image se traduit dans chaque langue (point 7). L’image, les dates et l’emplacement sont communs.

Une date future n’agit pas toute seule à la minute dite. Le site regarde ces dates au moment où il se prépare. Il se prépare quelques minutes après une publication, et aussi chaque nuit. Une bannière prévue pour demain n’apparaît donc qu’après la préparation de la nuit, ou plus tôt si vous publiez à nouveau cette bannière une fois l’heure arrivée, puis que vous attendez quelques minutes. La fin d’affichage suit la même règle.

## 5. Réordonner, ajouter ou retirer un bloc de l’accueil

1. **Gestionnaire de contenu**, puis **Accueil**. La page s’ouvre directement.
2. La liste **sections** est l’ordre des blocs sur la page d’accueil.
3. Pour déplacer un bloc, saisissez la poignée à gauche du bloc et déposez-le à la nouvelle place.
4. Pour en ajouter un, utilisez le bouton d’ajout en bas de la liste et choisissez le type de bloc. Le premier bloc, **Hero**, est la grande image du haut. **Image + texte** est un bloc avec une image et un texte.
5. Pour en retirer un, utilisez la corbeille de ce bloc.
6. Cliquez sur **Publier**.

L’ordre des blocs est propre à chaque langue. Refaites le même rangement en anglais et en arabe si les trois pages d’accueil doivent se suivre.

## 6. Changer une image sur une page déjà en ligne

Sur un produit : ouvrez le produit, champ **images**, choisissez la nouvelle photo, puis **Publier**.

Sur une autre page : **Page** ou **Expertise**, ouvrez la page, trouvez le bloc qui porte l’image (**Image + texte**, ou **Hero** pour la grande image du haut), cliquez sur l’image, choisissez la nouvelle, puis **Publier**.

L’image est commune aux trois langues : la changer en français la change aussi en anglais et en arabe. Inutile de la remettre dans chaque langue.

Ne supprimez pas l’ancienne image dans la médiathèque. Une même image peut servir à plusieurs endroits.

## 7. Les trois langues

En haut de la fiche, une liste indique la langue en cours : **French (fr)**, **English (en)**, **Arabic (ar)**.

1. Rédigez et publiez d’abord le français.
2. Ouvrez **English (en)**. Si la fiche est vide, demandez de la remplir à partir du français, puis traduisez les textes.
3. Cliquez sur **Publier** pour l’anglais. Une langue non publiée ne change pas sur le site.
4. Faites de même pour **Arabic (ar)**.

Le français modifié ne remplace pas l’anglais ni l’arabe. Chaque langue a son bouton **Publier**.

## 8. Après avoir publié

Le site public ne change pas à la seconde où vous cliquez. Il est une copie préparée à l’avance. Publier demande une nouvelle copie : comptez quelques minutes, puis rechargez la page du site.

**Enregistrer** seul laisse un brouillon. Seul **Publier** déclenche cette préparation.

Si rien n’a changé au bout d’une dizaine de minutes, passez au point 10. Vérifiez d’abord que vous avez bien publié la bonne langue.

## 9. Ce qu’il ne faut pas toucher

- Le menu **Paramètres**.
- Le **Constructeur de types de contenu**.
- Les suppressions dans la **Médiathèque**. Ajouter une image depuis une fiche est normal. Supprimer un fichier peut l’enlever de plusieurs pages à la fois.

## 10. Quand quelque chose ne va pas

Écrivez à la personne qui vous a remis l’adresse et le mot de passe. Dites quelle page, quelle langue, à quelle heure vous avez publié, et ce que vous voyez. N’essayez pas de corriger le problème dans **Paramètres** ni dans le **Constructeur de types de contenu**.
