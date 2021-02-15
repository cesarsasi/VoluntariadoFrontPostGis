<template>
<div id="app">
    <v-app>
        <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px" >
            <div>
                <v-tabs  v-model="tab" show-arrows background-color="deep-purple accent-4" icons-and-text dark grow>
                    <v-tabs-slider color="purple darken-4"></v-tabs-slider>
                    <v-icon >mdi-account</v-icon>
                    <v-tab-item>
                        <v-card class="px-4">
                            <v-card-text>
                                <v-form ref="registerForm" v-model="valid" lazy-validation>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="firstName" :rules="[rules.required]" label="First Name" maxlength="20" required></v-text-field>
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
                                        <v-col align-center justify-center>
                                            <v-btn x-large block :disabled="!valid" color="error" @click="exitDialog">Salir</v-btn>
                                        </v-col>
                                        <v-col align-center justify-center>
                                            <v-btn x-large block :disabled="!valid" color="success" @click="registerAdmin">Registrarse</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </div>
        </v-dialog>
    </v-app>
</div>
</template>


<script>
import axios from 'axios';
export default {
  name: 'Login',
  props: {
    msg: String
  },
//new Vue({
  //el: '#app',
  //vuetify: new Vuetify(),
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    }
  },
    data: () => ({
    dialog: true,
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
    password: "",
    verify: "",
    phoneNumber: "",
    VolunteerID: "",
    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      v => !!v || "Required",
      //v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    emailRules: [
      v => !!v || "Required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    phoneRules: [
      v => !!v || "Required"
    ],
    VolunteerIDRules: [
      v => !!v || "Required"
    ],

    show1: false,
    show2: false,
    rules: {
      required: value => !!value || "Required.",
      //min: v => (v && v.length >= 8) || "Min 8 characters"
      max: v => (v && v.length <= 8) || "Máximo 8 caracteres"
    }
  }),

  methods: {
    registerAdmin(){
        if (this.$refs.registerForm.validate()) {
        axios.post('http://localhost:8081/user/createUser/', 
        {"name":this.firstName+" "+this.lastName,
         "mail":this.email,
         "phone":this.phone,
         "idRol":0,
         "idVol":this.VolunteerID,
         "password":this.password,
         "invisible":0})
      .then( response => {
        this.user = response.data;
        this.logged = true;
        this.msg = false;
        this.$emit('logeado', this.logged);
        window.history.back();
      })
      .catch( e=> console.log(e))
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    exitDialog() {
      window.history.back();
    }
  }
  
//});
}
</script>