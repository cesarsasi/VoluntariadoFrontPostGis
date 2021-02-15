import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import routes from './router/index';
import VueRouter from 'vue-router'
import { LMap, LTileLayer, LMarker, LTooltip, LGeoJson, LCircle } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon }  from 'leaflet';

Vue.config.productionTip = false
Vue.use(vuetify);
Vue.use(VueAxios, Axios);
Vue.use(VueRouter);
Vue.component('l-map', LMap);
Vue.component('l-tooltip', LTooltip);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-geo-json', LGeoJson);
Vue.component('l-circle', LCircle);

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const router = new VueRouter({
  routes: routes,
  mode: "history",
  base: "public"
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')