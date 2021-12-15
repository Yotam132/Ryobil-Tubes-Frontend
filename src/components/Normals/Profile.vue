<template>
<v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 white--text">Profile</h3>
        <v-spacer></v-spacer>
        <v-card>
            <table class="mx-auto">
            <br><br>
            <tr>
                <th width="180px" height="50px" style="text-align:center;padding-left:8%;">Nama</th>
                <td width="510px" style="text-align:center;padding-left:8%;"> {{ users.username }} </td>
            </tr>
            <tr>
                <th width="180px" height="50px" style="text-align:center;padding-left:8%;">Email</th>
                <td width="510px" style="text-align:center;padding-left:8%;"> {{ users.email }} </td>
            </tr>
            <tr>
                <th width="180px" height="50px" style="text-align:center;padding-left:8%;">Alamat</th>
                <td width="510px" style="text-align:center;padding-left:8%;"> {{ users.alamat }} </td>
            </tr>

            <tr>

            </tr>
                <td colspan="2" height="40px" style="padding-bottom:15px;padding-top:30px;">
                    <v-btn color="orange darken-1" text @click="editHandler"> Edit User </v-btn>
                    <v-btn color="red darken-1" text @click="deleteHandler"> Delete User </v-btn>
                </td>
                <td>
                </td>
            <tr>
            </tr>
        </table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headLine">{{ formTitle }} User</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="form.username"
                            label="Nama User"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.email"
                            label="Email"
                            disabled
                        ></v-text-field>
                        <v-text-field
                            v-model="form.alamat"
                            label="Alamat User"
                            required
                        ></v-text-field>
                                                
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="orange darken-1" text @click="cancel"> Batal </v-btn>
                    <v-btn color="orange darken-1" text @click="setForm"> Simpan </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Apakah anda ingin menghapus data?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="orange darken-1" text @click="dialogDelete = false">Tidak</v-btn>
              <v-btn color="orange darken-1" text @click="deleteData">Ya</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar
            v-model="snackbar"
            :timeout="2000" :color="color" bottom>
            {{ error_message }}
        </v-snackbar>

    </v-main>
</template>

<script>
export default {
    name: "List",
    data() {
        return {
            inputType: 'Tambah',
            load: false,
            snackbar: false,
            error_message: '',
            color: '',

            search: null,
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            profileId: null,

            user: new FormData,
            users: [],
            form: {
              username: null,
              email: null,
              alamat: null,
            },
           
        }
    },

    methods: {
        setForm(){
            if(this.inputType !== 'Tambah')
            {
                this.update();
            }
            else
            {
                this.save();
            }
        },
        readData(){
            var url = this.$api + '/userLogin';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.users = response.data.data;
                this.profileId = this.users.id;
            })
        },
        update(){
            let newData = {
                username: this.form.username,
                email: this.form.email,
                alamat: this.form.alamat,
            };

            var url = this.$api + '/user/' + this.profileId;
            this.load = true;
            this.$http.put(url, newData, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = 'green';
                this.snackbar = true;
                this.load = false;
                this.close();
                location.reload();
                this.readData();
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        deleteData(){
            var url = this.$api + '/user/' + this.profileId;
            this.load = true;
            this.$http.delete(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = 'green';
                this.snackbar = true;
                this.load = false;
                this.close();
                localStorage.clear();
                this.$router.push({
                  name: 'Home',
                });
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        editHandler(){
            this.inputType = 'Ubah';
            this.form.username = this.users.username;
            this.form.email = this.users.email;
            this.form.alamat = this.users.alamat;
            this.dialog = true;
        },
        deleteHandler(){
            this.dialogDelete = true;
        },
        close(){
            this.dialog = false;
            this.inputType = 'Tambah';
            this.dialogDelete = false;
            this.readData();
        },
        cancel(){
            this.resetForm();
            this.readData();
            this.dialog = false;
            this.dialogDelete = false;
            this.inputType = 'Tambah';
        },
        resetForm(){
            this.form = {
              username: null,
              email: null,
              alamat: null,
            };
        },
    },

    computed: {
        formTitle(){
            return this.inputType;
        },
    },
    mounted(){
        this.readData();
    },
}
</script>