import 'intl-pluralrules';

import { createApp } from 'vue';

import vueFinalModal from 'vue-final-modal';

import Configuration from './data/config.js';
import { fluent } from './lib/l10n.js';
import autosizeDirective from './lib/autosize-directive.js';


import App from './App.vue';

const app = createApp(App)
  .use(fluent)
  .use(vueFinalModal())
  .directive('autosize', autosizeDirective);

app.mount(Configuration['mountroot'] ?? '#app');
