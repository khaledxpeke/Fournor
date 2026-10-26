'use strict';

const { factories } = require('@strapi/strapi');

module.exports = factories.createCoreController('api::produit.produit', ({ strapi }) => ({
  async searchIndex(ctx) {
    const docs = await strapi.documents('api::produit.produit').findMany({
      locale: 'fr',
      status: 'published',
      fields: ['slug', 'famille'],
    });
    ctx.body = {
      data: docs.map((doc) => ({
        slug: doc.slug,
        famille: doc.famille || '',
      })),
    };
  },
}));
