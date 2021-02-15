<template>
    <div class="d-flex align-items-center h-100 justify-center">
        <div>
            <v-container class="d-flex justify-center align-items-center w-100 h-100 mt-5 p-5">
                <img class="rounded-pill" src="../../src/assets/Oscar.jpg" alt="" width="200px" >
                <v-col md="5">
                    <v-container class="d-flex align-center h-100">
                        <h1>Ingresaste al Sistema de Emergencias como Voluntario</h1>
                    </v-container>
                </v-col>
                <v-col class="d-flex flex-column flex-nowrap" md="4">
                    <router-link to="/editVolunteer">
                        <v-btn color="success" class="mr-4 mb-2 w-50">
                                Editar Información
                        </v-btn>
                    </router-link>
                    <v-btn color="error" @click="LogOut" class="w-50 mr-4 mb-2">
                            Salir
                    </v-btn>
                </v-col>
            </v-container>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VolunteerView',
    methods: {
        LogOut(){
            localStorage.removeItem('logged');
            localStorage.removeItem('idRol');
            window.location.href = "/";
        }
    }
}
</script>