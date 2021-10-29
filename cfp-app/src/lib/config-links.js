import Configuration from '../data/config.js';

const camelCase = (s) => (s??'').replace(/\_(.)/g, (_,c) => c.toUpperCase());


export default function() {
  return Object.fromEntries(
    Configuration.links
      .map(({ label, url }) => ([ 'link_'+label, url ]))
      .map( ([k,v]) => [camelCase(k),v])
  );
}
