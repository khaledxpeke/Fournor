import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsActualitesRecentes extends Struct.ComponentSchema {
  collectionName: 'components_sections_actualites_recentes';
  info: {
    displayName: 'Actualites recentes';
    icon: 'calendar';
  };
  attributes: {
    nombreMax: Schema.Attribute.Integer &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<3>;
    titre: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Actualites'>;
  };
}

export interface SectionsBandeauDefilant extends Struct.ComponentSchema {
  collectionName: 'components_sections_bandeaux_defilants';
  info: {
    description: 'Bande de texte qui defile (noms de produits)';
    displayName: 'Bandeau defilant';
    icon: 'arrowRight';
  };
  attributes: {
    elements: Schema.Attribute.Component<'shared.element-texte', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    vitesse: Schema.Attribute.Enumeration<['lente', 'normale', 'rapide']> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'normale'>;
  };
}

export interface SectionsCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta';
  info: {
    displayName: "Appel a l'action";
    icon: 'bell';
  };
  attributes: {
    bouton: Schema.Attribute.Component<'shared.bouton', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    texte: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    titre: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsGrilleAds extends Struct.ComponentSchema {
  collectionName: 'components_sections_grilles_ads';
  info: {
    description: "Affiche les blocs publicitaires d'un emplacement donne";
    displayName: 'Grille de blocs publicitaires';
    icon: 'grid';
  };
  attributes: {
    colonnes: Schema.Attribute.Integer &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4>;
    emplacement: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'accueil-grille'>;
    nombreMax: Schema.Attribute.Integer &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4>;
    titre: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heros';
  info: {
    description: 'Banniere principale en haut de page';
    displayName: 'Hero';
    icon: 'picture';
  };
  attributes: {
    bouton: Schema.Attribute.Component<'shared.bouton', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    sousTitre: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    titre: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsImageTexte extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_texte';
  info: {
    description: 'Bloc image a gauche ou a droite avec titre et texte';
    displayName: 'Image + texte';
    icon: 'layer';
  };
  attributes: {
    bouton: Schema.Attribute.Component<'shared.bouton', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    chapo: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    positionImage: Schema.Attribute.Enumeration<['gauche', 'droite']> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'gauche'>;
    surtitre: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    texte: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    titre: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsListeProduits extends Struct.ComponentSchema {
  collectionName: 'components_sections_listes_produits';
  info: {
    displayName: 'Liste de produits';
    icon: 'bulletList';
  };
  attributes: {
    affichage: Schema.Attribute.Enumeration<['grille', 'carrousel', 'liste']> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'grille'>;
    gamme: Schema.Attribute.Relation<'oneToOne', 'api::gamme.gamme'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    nombreMax: Schema.Attribute.Integer &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<8>;
    titre: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsTexte extends Struct.ComponentSchema {
  collectionName: 'components_sections_textes';
  info: {
    description: 'Bloc de texte sans image';
    displayName: 'Texte';
    icon: 'pencil';
  };
  attributes: {
    bouton: Schema.Attribute.Component<'shared.bouton', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    surtitre: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    texte: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    titre: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedBouton extends Struct.ComponentSchema {
  collectionName: 'components_shared_boutons';
  info: {
    displayName: 'Bouton';
    icon: 'cursor';
  };
  attributes: {
    libelle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    lien: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    nouvelOnglet: Schema.Attribute.Boolean &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<false>;
    style: Schema.Attribute.Enumeration<['primaire', 'secondaire', 'lien']> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'primaire'>;
  };
}

export interface SharedElementTexte extends Struct.ComponentSchema {
  collectionName: 'components_shared_elements_texte';
  info: {
    displayName: 'Element texte';
    icon: 'alignLeft';
  };
  attributes: {
    texte: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedLienNav extends Struct.ComponentSchema {
  collectionName: 'components_shared_liens_nav';
  info: {
    displayName: 'Lien navigation';
    icon: 'bulletList';
  };
  attributes: {
    libelle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    lien: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ordre: Schema.Attribute.Integer &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<0>;
  };
}

export interface SharedLienSocial extends Struct.ComponentSchema {
  collectionName: 'components_shared_liens_sociaux';
  info: {
    displayName: 'Lien social';
    icon: 'link';
  };
  attributes: {
    reseau: Schema.Attribute.Enumeration<
      ['facebook', 'instagram', 'linkedin', 'youtube', 'tiktok', 'x']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedNote extends Struct.ComponentSchema {
  collectionName: 'components_shared_notes';
  info: {
    description: 'Titre et texte, reutilisable';
    displayName: 'Note';
    icon: 'bulletList';
  };
  attributes: {
    texte: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    titre: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonical: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    imagePartage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 170;
      }>;
    metaTitre: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    noindex: Schema.Attribute.Boolean &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'sections.actualites-recentes': SectionsActualitesRecentes;
      'sections.bandeau-defilant': SectionsBandeauDefilant;
      'sections.cta': SectionsCta;
      'sections.grille-ads': SectionsGrilleAds;
      'sections.hero': SectionsHero;
      'sections.image-texte': SectionsImageTexte;
      'sections.liste-produits': SectionsListeProduits;
      'sections.texte': SectionsTexte;
      'shared.bouton': SharedBouton;
      'shared.element-texte': SharedElementTexte;
      'shared.lien-nav': SharedLienNav;
      'shared.lien-social': SharedLienSocial;
      'shared.note': SharedNote;
      'shared.seo': SharedSeo;
    }
  }
}
