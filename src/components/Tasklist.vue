<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="tasks"
      :items-per-page="5"
      :loading="loading"
      loading-text="Estamos cargando las tareas"
      class="elevation-1"
    >
      <template v-slot:item.nombre="{item}">
        <a href=""><router-link :to="'../taskView/'+ item.id">{{item.nombre}}</router-link></a>
      </template>
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Lista de Tareas</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <router-link to="../createTask">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nueva Tarea
                </v-btn>
              </router-link>
            </template>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">Estás seguro que quieres eliminar esta tarea?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">Sí</v-btn>
                <v-btn color="blue darken-1" text @click="closeDelete">No, cancela</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'TaskList',
  props: {
    msg: String
  },
  
  data: ()=>({
      dialog: false,
      dialogDelete: false,
      loading: true,
      headers: [
        { text: 'ID', value: 'id' },
        {
          text: 'Nombre Tarea',
          align: 'start',
          sortable: false,
          value: 'nombre',
        },
        { text: 'Fecha Inicio', value: 'finicio' },
        { text: 'Fecha de Término', value: 'ffin' },
        { text: 'Cantidad de Inscritos', value: 'cant_vol_inscritos' },
        { text: 'Cantidad de Requeridos', value: 'cant_vol_requeridos' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editeTask: {
        nombre: '',
        finicio: '',
        fin: '',
        cant_vol_inscritos: 0,
        cant_vol_requeridos: 0,
      },
      defaultTask: {
        nombre: '',
        finicio: '',
        fin: '',
        cant_vol_inscritos: 0,
        cant_vol_requeridos: 0,
      },
    tasks: [],
    tasksPerPage: 5,
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Tarea' : 'Editar Tarea'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created(){
    this.getTasks();
  },

  methods: {
    async getTasks(){
    await axios.get('http://localhost:8081/task/getAll')
      .then( response => {
        this.tasks = response.data
        console.log(this.tasks.nombre);
      })
      .catch( e=> console.log(e))
      this.loading = false;
      },
      editItem (item) {
        this.editedIndex = this.tasks.indexOf(item)
        this.editeTask = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.tasks.indexOf(item)
        this.editeTask = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.tasks.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editeTask = Object.assign({}, this.defaultTask)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editeTask = Object.assign({}, this.defaultTask)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.tasks[this.editedIndex], this.editeTask)
        } else {
          this.tasks.push(this.editeTask)
        }
        this.close()
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
