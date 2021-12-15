<template>
  <v-container>
      <v-row align="center" justify="center" >
          <v-col cols="12" sm="10">
            <v-card class="elevation-6 mt-10"  >
             <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-card-text class="mt-12">
                        <h4 class="text-center">RYOBIL - Jasa Antar Barang</h4>
                        <v-row align="center" justify="center">
                          <v-col cols="12" sm="8">      
                          <v-form v-model="validLogin" ref="formLogin">
                            <v-text-field label="Email" v-model="loginEmail" :rules="emailRules" outlined dense color="orange" autocomplete="false" class="mt-16" required/>
                            <v-text-field label="Password" v-model="loginPassword" :rules="passwordRules" outlined dense color="orange" autocomplete="false" type="password" required/>

                            <v-btn color="orange" dark block tile @click="submitLogin">Masuk</v-btn> 

                          </v-form>                   
                          </v-col>
                        </v-row>  
                      </v-card-text>
                    </v-col>
                    <v-col cols="12" md="6" class="orange rounded-bl-xl" >
                    <div style="  text-align: center; padding: 180px 0;">
                      <v-card-text class="white--text" >
                        <h3 class="text-center ">Belum Punya Akun? Daftar Disini</h3>
                        <h6
                          class="text-center"
                        >GRATIS SAMPAI KAPANPUN!<br> LAYANAN ANTAR PAKET PALING BEDEBEST!</h6>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn tile outlined dark @click="step++">DAFTAR</v-btn>
                      </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="2">
                  <v-row >
                    <v-col cols="12" md="6" class="orange rounded-br-xl">
                     <div style="  text-align: center; padding: 180px 0;">
                      <v-card-text class="white--text" >
                        <h3 class="text-center ">Akun Sudah Terdaftar?</h3>
                        <h6
                          class="text-center"
                        >Silahkan Login Untuk Menikmati Website Kami<br> RYOBIL Siap Melayani Anda.</h6>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn tile outlined dark @click="step--">MASUK</v-btn>
                      </div>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card-text class="mt-12">
                        <h4 class="text-center">Buat Akun Baru</h4>
                        <h6 class="text-center  black--text ">Bergabunglah Bersama RYOBIL Sekarang Juga! <br>GRATIS LOHHH...</h6>
                        <v-row align="center" justify="center">
                            <v-col cols="12" sm="8">
                                <v-form v-model="validRegister" ref="formRegister">
                                  <v-text-field label="Nama Lengkap" v-model="regNamaLengkap" :rules="namaRules" outlined dense color="orange" autocomplete="false" class="mt-4" required/>
                                  <v-text-field label="Alamat" v-model="regAlamat" :rules="alamatRules" outlined dense color="orange" autocomplete="false" required/>
                                  <v-text-field label="Email" v-model="regEmail" :rules="emailRules" outlined dense color="orange" autocomplete="false" required/>
                                  <v-text-field label="Password" v-model="regPassword" :rules="passwordRules" outlined dense color="orange" autocomplete="false" type="password" required/>

                                  <v-btn color="orange" dark block tile @click="submitRegister">Daftar</v-btn>
                                </v-form>

                          </v-col>
                        </v-row>  
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
      </v-row>

      <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>

  </v-container>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Jolly%20Lodger");
    .grey--text{
        font-family: "Jolly Lodger";
    }
    .posisinya{
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
    }
    .v-application .rounded-bl-xl {
        border-bottom-left-radius: 300px !important;
    }
    .v-application .rounded-br-xl {
        border-bottom-right-radius: 300px !important;
    }
</style>

<script>
export default{
    data(){
        return{
            step: 1,
            snackbar: false,
            error_message: '',
            color: '',

            loginPassword: '',
            passwordRules: [
                (v) => !!v || 'Password tidak boleh kosong',
            ],
            loginEmail: '',
            emailRules: [
                (v) => !!v || 'E-mail tidak boleh kosong',
            ],
            regAlamat: '',
            alamatRules: [
                (v) => !!v || 'Alamat tidak boleh kosong',
            ],
            regNamaLengkap: '',
            regEmail: '',
            regPassword: '',
            namaRules: [
                (v) => !!v || 'Nama Lengkap tidak boleh kosong',
            ],

            load: false,
            validLogin: false,
            validRegister: false,
        };
    },
    props: {
        source: String,
    },
    methods: {
        submitLogin(){
            if(this.$refs.formLogin.validate()){
                this.load = true;
                this.$http.post(this.$api + '/login', {
                    email: this.loginEmail,
                    password: this.loginPassword
                }).then(response => {
                    localStorage.setItem('id', response.data.user.id);
                    localStorage.setItem('token', response.data.access_token);
                    localStorage.setItem('isAdmin', response.data.user.is_admin);
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.clearLogin();
                    this.$router.push({
                        name: 'About',
                    });
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    localStorage.removeItem('token');
                    this.load = false;
                })
            }
            else
            {
              this.error_message = "Silahkan isi semua field";
              this.color = "red";
              this.snackbar = true;
              this.load = false;
            }
        },

        submitRegister(){
            if(this.$refs.formRegister.validate()){
                this.load = true;
                this.$http.post(this.$api + '/register', {
                    email: this.regEmail,
                    password: this.regPassword,
                    username: this.regNamaLengkap,
                    alamat: this.regAlamat,
                }).then(response => {
                    localStorage.setItem('id', response.data.user.id);
                    localStorage.setItem('token', response.data.access_token);
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.clearRegister(); 
                    this.step = 1;
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    localStorage.removeItem('token');
                    this.load = false;
                })
            }
            else
            {
              this.error_message = "Silahkan isi semua field";
              this.color = "red";
              this.snackbar = true;
              this.load = false;
            }
        },

        clearLogin(){
            this.$refs.formLogin.reset()
        },

        clearRegister(){
            this.$refs.formRegister.reset()
        },
    },
};

</script>
