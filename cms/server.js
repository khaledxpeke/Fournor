// Strapi 5 programmatic start for the CMS on Hostinger.
// The public site is static. This file is only the CMS process.
// Docs: https://docs.strapi.io/cms/deployment
// The v4 call `require('@strapi/strapi')().start()` is not valid here.
const strapi = require('@strapi/strapi');

strapi
  .createStrapi()
  .start()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
