import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
// import '@fortawesome/fontawesome-free/css/all.css'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'

// import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const opts = {
    icons: {
        iconfont: 'fa' || 'md',
    }
};

export default new Vuetify(opts);