<template>
    <v-container class="d-flex justify-center align-items-center w-100 h-100 mt-5 p-5">
            <img src="../../src/assets/placeholder.svg" alt="" width="100px">
            <v-col md="5">
                <v-container class="d-flex align-center h-100">
                    <h1>Bienvenido al Sistema de Admin</h1>
                </v-container>
            </v-col>
            <v-col class="d-flex flex-column flex-fill" md="4">
                        <v-btn :to="{path: '/taskList'}" color="success" class="mr-4 mb-2">
                            Ver lista de Tareas
                        </v-btn>
                        <v-btn :to="{path: '/createEmergency'}" color="success" class="mr-4 mb-2">
                            Crear Emergencia
                        </v-btn>
                        <v-btn :to="{path: '/createTask'}" color="success" class="mr-4 mb-2">
                            Crear Tarea
                        </v-btn>
                        <v-btn :to="{path: '/searchVolunteer'}" color="success" class="mr-4 mb-2">
                            Buscar voluntarios alrededor de una emergencia
                        </v-btn>
            </v-col>
        </v-container>
</template>

<script>
    //import Login from './Login.vue';
    
    export default {
        name: 'AdminView',
    }
</script>

<style>

</style>