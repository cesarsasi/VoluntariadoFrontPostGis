<template>
    <v-app>
          <v-app-bar
            app
            color="primary"
            dark
          >
            <div class="d-flex align-center">
                <v-btn icon color="blue" @click="goHome">
                  <v-img
                    alt="Vuetify Logo"
                    class="shrink mr-2"
                    contain
                    src="../src/assets/placeholder.svg"
                    transition="scale-transition"
                    width="40"
                  />
                </v-btn>
                <h3 style="margin-bottom: 0;">Sistema de Emergencias</h3>
            </div >
            <v-spacer></v-spacer>
            <div v-if="idRol == 0">
                <!-- Colocar if para saber el Rol del usuario para que no se muestre a un voluntario-->
                <v-btn text to="/registroAdmin">
                  <v-icon left>mdi-pencil</v-icon>
                    Registrar Admin
                </v-btn>
            </div>
            <div v-if = "logged">
              <v-btn text @click="logOut">
                <v-icon rigth>mdi-heart</v-icon>
                Salir  
              </v-btn> 
            </div>
          </v-app-bar>
          <v-main>
            <router-view to="/taskList"></router-view>
          </v-main>
      </v-app>
</template>

<script>


export default {
  name: 'App',
  components: {
  },
  data: () => ({
    logged: localStorage.getItem('logged'),
    idRol: localStorage.getItem('idRol'),
    idUser: localStorage.getItem('idUser')
  }),
  methods: {
    goHome() {
      window.location.href = '/';

    },
    logOut(){
      this.logged = false;
      localStorage.removeItem('logged');
      this.idRol = 0;
      localStorage.removeItem('idRol');
      this.idUser = -1;
      localStorage.removeItem('idUser');
      window.location.href = "/";
    }
  },
  created() {
    this.idRol = localStorage.getItem('idRol');
  }
  
};

</script>


