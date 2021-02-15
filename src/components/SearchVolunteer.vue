<template>
    <div class="d-flex justify-center w-100 h-100">
        <v-container>
                <v-col cols="6">
                    <v-select
                    v-model = "emergency"
                    :items="emergencies"
                    item-text = "nombre"
                    item-value = "id"
                    :rules="[v => !!v || 'Emergencia requerida']"
                    label="Selecciona Emergencia"
                    return-object
                    v-on:change="emergencyCenterUpdate(emergency)"
                    prepend-icon="mdi-access-point" 
                    required
                    ></v-select>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        v-model.number="radius"
                        type="number"
                        :counter="100"
                        label="Radio (mt)"
                        required
                    ></v-text-field>
                </v-col>
                <v-btn
                    color="success"
                    class="mr-4 mb-5"
                    @click="getVolunteers()">
                    Buscar
                </v-btn>
        <div style="height: 500px; width: 50%">
            <div style="height: 200px overflow: auto;">
            <p>Voluntarios en la emergencia: </p>
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
            <l-circle
            :lat-lng="center"
            :radius="radius"
            :color="circle.color"
            />
            <l-tile-layer
                :url="url"
                :attribution="attribution"
            />
            <l-marker 
                v-for="volunteer in volunteers"
                :key="volunteer.id"
                :visible="true"
                :lat-lng="[volunteer.latitude, volunteer.longitude]"
                :icon="icon" 
            >
            <l-tooltip>{{volunteer.nombre}} {{volunteer.apellido}}  -  {{volunteer.email}} <br>
                        ( {{volunteer.latitude}},{{volunteer.longitude}} )
            </l-tooltip>
            </l-marker>
            </l-map>
        </div>
        </v-container>
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
        >
            {{ text }}

            <template v-slot:action="{ attrs }">
            <v-btn
                color="blue"
                text
                v-bind="attrs"
                @click="snackbar = false"
            >
                Close
            </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import axios from 'axios';
import L from 'leaflet';
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LIconDefault, LGeoJson, LCircle } from "vue2-leaflet";

export default {
    
    data: function(){
        return {
            snackbar: false,
            text: 'No se han encontrado voluntarios, por favor pruebe con un número mayor de radio',
            timeout: 5000,
            components: {
                LMap,
                LTileLayer,
                LMarker,
                LPopup,
                LIconDefault,
                LGeoJson,
                LCircle 
            },
            circle: {
                color: 'red'
            },
            emergency: null,
            emergencies: [],
            radius: 0,
            volunteers: [],
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
            icon: L.icon({
            iconUrl: require('../../src/assets/placeholder.svg'),
            iconSize: [32, 37],
            iconAnchor: [16, 37]
            }),

        }
    },
    created(){
      this.getEmergencies();
    },
    methods: {
        validate () {
            const validForm = this.$refs.form.validate()
            if(validForm){
            this.send();
            }
        },
        async getEmergencies(){
            let response = await axios.get('http://localhost:8081/emergencies/getAll')
            this.emergencies = response.data
        },
        async getVolunteers(){
            await axios.get('http://localhost:8081/emergencies/getVolunteerByRadius/'+ this.emergency.id + '?radius=' + this.radius)
            .then( response => {
                this.volunteers = response.data;
                console.log(response);
                if (this.volunteers.length == 0){
                    this.snackbar = true;
                }
              })
            .catch( e=> {
                console.log(e);
                this.text = 'Ha existido un problema con su solicitud, por favor intente más tarde'
                this.snackbar = true;
            })
        },
        zoomUpdate(zoom) {
            this.currentZoom = zoom;
        },
        centerUpdate(center) {
            this.currentCenter = center;
        },
        emergencyCenterUpdate(emergency) {
            this.center = latLng(emergency.latitude, emergency.longitude);
        },
        showLongText() {
            this.showParagraph = !this.showParagraph;
        },
        innerClick() {
            alert("Click!");
        },
    }

}
</script>

<style>

</style>