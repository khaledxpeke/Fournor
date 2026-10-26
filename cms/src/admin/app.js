const config = {
  locales: ['fr'],
};

const bootstrap = () => {
  const key = 'strapi-admin-language';
  if (localStorage.getItem(key) !== 'fr') {
    localStorage.setItem(key, 'fr');
    window.location.reload();
  }
};

export default {
  config,
  bootstrap,
};
