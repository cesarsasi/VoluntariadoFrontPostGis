<template>
  <v-container>
  <v-card
    :loading="loading"
    class="mx-auto my-12"
    max-width="374"
  >
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="250"
      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
    ></v-img>

    <v-card-title>Tarea: {{task.nombre}}</v-card-title>

    <v-card-text>
      <v-row
        align="center"
        class="mx-0"
      >
        

        <div class="px-4 grey--text ml-4">
          Status : {{task.invisible}}
        </div>

        <div class="px-4 grey--text ml-4">
          Emergencia asociada : {{emergency.nombre}}
        </div>
      </v-row>

      <div class="my-4 subtitle-1">
        Voluntarios Inscritos • {{ task.cant_vol_inscritos }}
      </div>
      <div class="my-4 subtitle-1">
        Voluntarios Requeridos • {{ task.cant_vol_requeridos }}
      </div>

      <div>{{ task.descripcion }}</div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-title>Duración</v-card-title>

    <v-card-text>
      <v-chip-group
        v-model="selection"
        active-class="deep-purple accent-4 white--text"
        column
      >
        <v-chip>Inicio:{{ task.finicio }}</v-chip>

        <v-chip>Termino: {{ task.ffin }}</v-chip>
      </v-chip-group>
    </v-card-text>

    <v-card-actions>
      <router-link to="../taskList">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Volver a Tareas
                </v-btn>
              </router-link>
    </v-card-actions>
  </v-card>

  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TaskView',
  props: {
    msg: String
  },

  data: ()=>({
    task:null,
    emergency:null
  }),

  mounted(){
    this.getTask();
  },

  methods: {
    getTask(){
    axios.get('http://localhost:8081/tarea/getById/'+this.$route.params.idTask)
      .then( response => {
        this.task = response.data
        axios.get('http://localhost:8081/emergencias/getById/'+this.task.id_emergencia)
        .then(response=>{
          this.emergency = response.data
        })
        .chatch(e=>console.log(e))
      })
      .catch( e=> console.log(e))
    },
  }
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