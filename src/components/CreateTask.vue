<template>
  <v-container>
    <v-layout justify-center>
        <v-flex xs6>
          <h2>Agregar Tarea</h2>
            </v-flex>
    </v-layout>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="task.nombre"
        :counter="30"
        :rules="nameRules"
        label="Nombre Tarea"
        required
      ></v-text-field>  

      <v-text-field v-model="task.cant_vol_requeridos" :rules="membersRules" type="number" label="Voluntarios Requeridos" required></v-text-field>

      <v-text-field
        v-model="task.descripcion"
        :counter="30"
        :rules="descriptionRules"
        label="Descripción"
        required
      ></v-text-field>

      <v-container fluid>
        <v-row align="center">
          <v-col cols="6">
            <v-select
              v-model = "task.id_emergencia"
              :items="emergencies.items"
              :reduce="emergency => emergency.id"
              :rules="[v => !!v || 'Emergencia requerida']"
              label="Selecciona Emergencia"
              prepend-icon="mdi-access-point" 
              required
            ></v-select>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-date-picker
              v-model="dates"
              range
            ></v-date-picker>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="dateRangeText"
              label="Rango de tiempo"
              prepend-icon="mdi-calendar"
              readonly
              :rules="dateRangeRules"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>

      <div style="height: 500px; width: 50%">
        <div style="height: 200px overflow: auto;">
        <p>El punto de la tarea será {{ position.lat }}, {{ position.lng }}</p>
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

      <v-btn
        color="success"
        class="mr-4"
        @click="validate"
      >
        Crear
      </v-btn>

      <v-btn
        color="error"
        class="mr-4"
        @click="reset"
      >
        LIMPIAR
      </v-btn>
    </v-form>

    
  </v-container>
</template>

<script>

import axios from 'axios';
import L from 'leaflet';
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LIconDefault, LGeoJson  } from "vue2-leaflet";


export default {
  name: 'CreateTask',
  props: {
    msg: String
  },
  data: function(){
    return{
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
          emergencies: {
            name: "Emergencias",
            data: null,
            items: [],
          },
          error: false,
          error_msg: "",
          nameRules: [
            v => !!v || 'Nombre es requerido',
            v => (v && v.length >= 3) || 'El nombre no puede tener menos de 3 caracteres',
          ],
          descriptionRules: [
            v => !!v || 'Descripción es requerida',
            v => (v && v.length >= 3) || 'La descripción no puede tener menos de 3 caracteres',
          ],
          emergencyRules: [
            v => !!v || 'Emergencia requerida',
          ],
          membersRules: [
            v => !!v || 'Cantidad de Integrantes requerida',
            v => (v && v.length >= 0) || 'Debes pon er integrantes',
          ],
          dateRangeRules: [
            v => !!v || 'Rango de Fecha requerida',
          ],
          valid: true,
          dates: ['2020-11-20', '2020-12-20'],
          task: {
              id: null,
              id_emergencia: null,
              id_estado: 1,
              nombre: "",
              finicio: null,
              ffin: null,
              cant_vol_inscritos: 0,
              cant_vol_requeridos: null,
              invisible: 0,
              descripcion: ""
          }
      }
    },
    created(){
      this.getEmergencies();
    },
    methods: {
      validate () {
        const validForm = this.$refs.form.validate()
        if(validForm){
          console.log(this.valid);
          this.send();
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      defineEmergencies(data){
          this.emergencies.items.push({value: 0, text: 'Selecciona una emergencia'});
          data.forEach(emergency => {
            let emergencyData = {
              value: emergency.id+1,
              text: emergency.nombre
            }
            this.emergencies.items.push(emergencyData);
          });
          console.log(this.emergencies);
      },
      async getEmergencies(){
        let response = await axios.get('http://localhost:8081/emergencies/getAll')
        console.log(response);
        this.emergencies.data = response.data
        this.defineEmergencies(this.emergencies.data);
      },
      async send(){
        this.task.finicio = this.dates[0];
            if(this.dates[1] !=null){
              this.task.ffin = this.dates[1];
            }
            let json = {
              "id": this.task.id,
              "id_emergencia": this.task.id_emergencia-1,
              "id_estado": this.task.id_estado,
              "nombre": this.task.nombre,
              "finicio": this.task.finicio,
              "ffin": this.task.ffin,
              "cant_vol_inscritos": this.task.cant_vol_inscritos,
              "cant_vol_requeridos": this.task.cant_vol_requeridos,
              "invisible": this.task.invisible,
              "descrip": this.task.descripcion,
              "longitude": this.position.lng,
              "latitude": this.position.lat,
            }
            await axios.post('http://localhost:8081/task/create', json)
            .then( data=> {
                console.log(data);
              })
            .catch( e=> console.log(e))
            this.$router.push({path:'/taskList'});
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
        }
    },
    computed: {
      options() {
        return {
        onEachFeature: this.onEachFeatureFunction
       };
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

      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>