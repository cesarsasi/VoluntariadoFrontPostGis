<template>
  <v-dialog v-if="show" persistent v-model="msg" max-width="600px" min-width="360px">
      <div>
          <v-tabs v-model="tab" show-arrows background-color="deep-purple accent-4" icons-and-text dark grow>
              <v-tabs-slider color="purple darken-4"></v-tabs-slider>
              <v-tab v-for="(tab, i) in tabs" :key="i">
                  <v-icon large>{{ tab.icon }}</v-icon>
                  <div class="caption py-1">{{ tab.name }}</div>
              </v-tab>
              <v-tab-item>
                  <v-card class="px-4" v-if = "show">
                      <v-card-text>
                          <v-form ref="loginForm" v-model="valid" lazy-validation>
                              <v-row>
                                  <v-col cols="12">
                                      <v-text-field v-model="loginEmail" :rules="loginEmailRules" label="Email" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12">
                                      <v-text-field v-model="loginPassword" :append-icon="show1?'eye':'eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password"  counter @click:append="show1 = !show1"></v-text-field>
                                  </v-col>
                                  <v-col class="d-flex" cols="12" sm="6" xsm="12">
                                  </v-col>
                                  <v-spacer></v-spacer>
                                  <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                      <v-btn x-large block :disabled="!valid" color="success" @click="validate"> Login </v-btn>
                                  </v-col>
                              </v-row>
                          </v-form>
                      </v-card-text>
                  </v-card>
              </v-tab-item>
              <v-tab-item>
                  <v-card class="px-4">
                      <v-card-text>
                          <v-form ref="registerForm" v-model="valid" lazy-validation>
                              <v-row>
                                  <v-col cols="12" sm="6" md="6">
                                      <v-text-field v-model="firstName"
                                       :rules="[rules.required]" 
                                       label="First Name" 
                                       maxlength="20" 
                                       required
                                       
                                       ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                      <v-text-field v-model="lastName" :rules="[rules.required]" label="Last Name" maxlength="20" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                      <v-text-field v-model="phoneNumber" :rules="phoneRules" label="Phone" maxlength="9" type="number" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="VolunteerID" :rules="VolunteerIDRules" label="VolunteerID" maxlength="9" type="number" required></v-text-field>
                                        </v-col>
                                  <v-col cols="12">
                                      <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12">
                                      <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" counter @click:append="show1 = !show1"></v-text-field>
                                  </v-col>
                                  <v-col cols="12">
                                      <v-text-field block v-model="verify" :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, passwordMatch]" :type="show2 ? 'text' : 'password'" name="input-10-1" label="Confirm Password" counter @click:append="show2 = !show2"></v-text-field>
                                  </v-col>
                                  <div class="d-flex flex-column justify-center w-100">
                                    <!-- Mapa georeferanciado-->
                                    <div style="height: 350px; width: 100%">
                                      <div style="overflow: auto;">
                                        <p>El punto del voluntario será {{ position.lat }}, {{ position.lng }}</p>
                                      </div>
                                      <l-map
                                        v-if="showMap"
                                        :zoom="zoom"
                                        :center="center"
                                        :options="mapOptions"
                                        style="height: 80%"
                                        @update:center="centerUpdate"
                                        @update:zoom="zoomUpdate"
                                        >
                                        <l-tile-layer
                                            :url="url"
                                            :attribution="attribution"
                                        />
                                        <l-geo-json
                                        v-if="showMap"
                                        :geojson="geojson"
                                        :options="options"
                                        :options-style="styleFunction"
                                        />
                                        <l-marker 
                                            :visible="true"
                                            :lat-lng.sync="position"
                                            :draggable="true"
                                            :icon="icon" 
                                        ></l-marker>
                                      </l-map>
                                    </div>
                                    <!-- FIN MAPA-->
                                    <v-spacer></v-spacer>
                                    <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                                        <v-btn x-large block :disabled="!valid" color="success" @click="registerVolunteer">Register</v-btn>
                                    </v-col>
                                  </div>
                              </v-row>
                          </v-form>
                      </v-card-text>
                  </v-card>
              </v-tab-item>
          </v-tabs>
      </div>
  </v-dialog>
</template>


<script>
import axios from 'axios';
import L from 'leaflet';
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LIconDefault, LGeoJson  } from "vue2-leaflet";

export default {
  name: 'Login',
  props: {
    msg: Boolean
  },
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
    styleFunction() {
      const fillColor = this.fillColor; // important! need touch fillColor in computed for re-calculate when change fillColor
      return () => {
        return {
        weight: 2,
        color: "#ECEFF1",
        opacity: 1,
        fillColor: fillColor,
        fillOpacity: 1
        };
      };
    },
    options() {
        return {
        onEachFeature: this.onEachFeatureFunction
      };
    }
  },
  data: () => ({
    //para mapa
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LIconDefault,
        LGeoJson
        },
    zoom: 8,
    center: latLng(-38.719, -72.478),
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    url_division : 'https://gist.githubusercontent.com/dfao/a8dc40cd822acd2bdc0c707322599539/raw/01ce0385c5f8164e7f983506a94d17c79b7d0789/division_regional.json',
    attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    currentZoom: 5,
    currentCenter: latLng(-38.719, -72.478),
    showParagraph: false,
    mapOptions: {
        zoomSnap: 0.5
    },
    showMap: true,
    position: {lat: -38.719, lng: -72.478},
    values : [],
    loading: false,
    geojson: null,
    icon: L.icon({
    iconUrl: require('../../src/assets/placeholder.svg'),
    iconSize: [32, 37],
    iconAnchor: [16, 37]
    }),
    //para mapa
    dialog: false,
    idRol: null,
    idUser: -1,
    tab: 0,
    tabs: [
        {name:"Login", icon:"mdi-account"},
        {name:"Register", icon:"mdi-account-outline"}

    ],
    valid: true,
    user: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: null,
    password: "",
    verify: "",
    VolunteerID:"",
    loginPassword: "",
    loginEmail: "",

    loginEmailRules: [
      v => !!v || "Required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    emailRules: [
      v => !!v || "Required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    phoneRules: [
      v => !!v || "Required",
    ],
    VolunteerIDRules: [
      v => !!v || "Required"
    ],
    show: true,
    show1: false,
    show2: false,
    rules: {
      required: value => !!value || "Required.",
      min: v => (v && v.length >= 8) || "Min 8 characters"
      // max: v => (v && v.length <= 8) || "Max 8 characters"
    },
    logged: 0,
  }),

  methods: {
    validate() {
      if (this.$refs.loginForm.validate()) {
        axios.post('http://localhost:8081/user/logIn', {
          "mail":this.loginEmail,
          "password":this.loginPassword,
          "invisible":0,
          })
          
      .then( response => {
        console.log(response);
        this.user = response.data;
        this.idRol = this.user.idRol; 
        this.idUser = this.user.id;
        //Login fail
        if (this.idRol === 2 || this.idRol === null){
            this.logged = false;
            this.$emit('msg', false);
            localStorage.removeItem('logged');
            localStorage.removeItem('idRol');
            localStorage.removeItem('idUser');
            this.$router.push({path: '/'});
        //Login Volunteer
        }else if(this.idRol === 1){
          this.logged = true;
          localStorage.setItem('logged', this.logged);
          localStorage.setItem('idRol',this.idRol);
          localStorage.setItem('idUser',this.idUser);
          this.$emit('logged', this.logged);
          this.$emit('msg', false);
          this.show = false; 
          this.longitude = this.position.lng;
          this.latitude = this.position.lat;
          this.$router.push({path: '/volunteerView'});
        //Login Admin
        }else if(this.idRol === 0){
          this.logged = true;
          localStorage.setItem('logged', this.logged);
          localStorage.setItem('idRol',this.idRol);
          localStorage.setItem('idUser',this.idUser);        
          this.$emit('logged', this.logged);
          this.$emit('msg', false);
          this.show = true;
          this.$router.push({path: '/adminView'});
        }
      })
      .catch( e=> console.log(e))
      }
    }, 
    registerVolunteer(){
      if (this.$refs.registerForm.validate()) {
        axios.post('http://localhost:8081/user/createUser/', 
        {"name":this.firstName+" "+this.lastName,
          "mail":this.email,
          "phone":this.phone,
          "idRol":1,
          "idVol":this.VolunteerID,
          "password":this.password,
          "invisible":0})
      .then( response => {
        this.user = response.data;
        this.logged = true;
        this.$emit('msg', false);
        this.$emit('logged', this.logged);
        this.$router.push({path: '/'});
      })
      .catch( e=> console.log(e))
      }
    },
    async getDataDivision () {
        this.loading = false;
        let response = await axios.fetch(this.url_division);
        const data = await response.json();
        this.geojson = data;
        this.loading = false;
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    },
  },
}
</script>