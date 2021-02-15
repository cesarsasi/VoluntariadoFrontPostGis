<template>
    <div class="d-flex align-items-center h-100 justify-center">
        <div>
            <Login :msg="openDialog" v-on:logged="logged = $event"></Login>
            <v-container  v-if="logged === false" class="d-flex justify-center align-items-center w-100 h-100 mt-5 p-5">
                <img src="../../src/assets/placeholder.svg" alt="" width="100px">
                <v-col md="5">
                    <v-container class="d-flex align-center h-100">
                        <h1>Bienvenido al Sistema de Emergencias</h1>
                    </v-container>
                </v-col>
                <v-col class="d-flex flex-column flex-nowrap" md="4">
                    <v-btn color="success" @click="dialogTrue()" class="mr-4 mb-2">
                            Ingresar
                    </v-btn>
                </v-col>
            </v-container>
        </div>
    </div>
</template>


<script>
    import Login from './Login.vue';

    export default {
        components: {
            Login
        },
        data: () => ({
            logged: false,
            openDialog: false
        }),
        methods: {
            dialogTrue(){
                this.openDialog = true;
                console.log(this.openDialog);
            }
        },
        created() {
            const rol =  localStorage.getItem('idRol');
            if ( rol == null) {
                console.log ('¡Bienvenido al Sistema de Emergencias!')
            } else if ( rol == 0) {
                this.$router.push({path: '/adminView'});
            } else if ( rol == 1) {
                this.$router.push({path: '/volunteerView'});
            }
        }

    }
</script>

<style>

</style>