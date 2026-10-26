const products = [
  'baguette-fournor', 'tradition', 'mix-farine-croissant', 'complet', 'campagne',
  'cereales-noir', 'chia-quinoa', 'maxi-graines', 'multigrain', 'mais',
];
const expertise = [
  'metiers', 'rd', 'artisan', 'industriel', 'patisserie', 'agro', 'autres',
  'xp-ingredient', 'parcours', 'solutions-ing', 'formulation', 'sur-mesure',
  'analyses', 'reponses', 'innovation-hub', 'innovation', 'marketing',
  'collections', 'services', 'snacking',
];
const families = ['poudre', 'grains', 'liquide', 'sans-gluten', 'divers'];
const mixes = ['premix-poudres', 'mix-poudres', 'mix-graines', 'mix-liquides'];

const pages = {
  'index.html': '/',
  'maison.html': '/maison/',
  'solution.html': '/solution/',
  'gamme.html': '/gamme/',
  'expertise.html': '/expertise/',
  'ingredients.html': '/ingredients/',
  'formation.html': '/formation/',
  'partenaires.html': '/partenaires/',
  'actualites.html': '/actualites/',
  'contact.html': '/contact/',
};

export function redirectTarget(pathname, searchParams) {
  const path = pathname.replace(/^\/+/, '');
  if (path === 'gamme.html') {
    const mix = searchParams.get('mix');
    if (mixes.includes(mix)) return `/gamme/${mix}/`;
    return '/gamme/';
  }
  if (path === 'produit.html') {
    const id = searchParams.get('id');
    if (products.includes(id)) return `/produit/${id}/`;
    return null;
  }
  if (path === 'xp.html') {
    const id = searchParams.get('id');
    if (id === 'formation') return '/formation/';
    if (expertise.includes(id)) return `/xp/${id}/`;
    return null;
  }
  if (path === 'ingredients.html') {
    const family = searchParams.get('fam');
    if (families.includes(family)) return `/ingredients/${family}/`;
    return '/ingredients/';
  }
  return pages[path] || null;
}

export const redirectCases = [
  ...Object.entries(pages),
  ...mixes.map((mix) => [`gamme.html?mix=${mix}`, `/gamme/${mix}/`]),
  ...products.map((id) => [`produit.html?id=${id}`, `/produit/${id}/`]),
  ['xp.html?id=formation', '/formation/'],
  ...expertise.map((id) => [`xp.html?id=${id}`, `/xp/${id}/`]),
  ...families.map((id) => [`ingredients.html?fam=${id}`, `/ingredients/${id}/`]),
  ['gamme.html?utm=1&mix=mix-poudres', '/gamme/mix-poudres/'],
  ['produit.html?id=tradition&lang=fr', '/produit/tradition/'],
];
