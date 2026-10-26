'use strict';

const { factories } = require('@strapi/strapi');

const core = factories.createCoreRouter('api::produit.produit');

const searchRoute = {
  method: 'GET',
  path: '/produits/index-recherche',
  handler: 'produit.searchIndex',
  config: {
    policies: [],
  },
};

module.exports = {
  get prefix() {
    return core.prefix;
  },
  get routes() {
    const routes = typeof core.routes === 'function' ? core.routes() : core.routes;
    return [searchRoute, ...(routes || [])];
  },
};
