<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5 font-color-white white--text">Pemesanan</h3>
        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="orange" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="pesanans" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small color="green" class="mr-2" @click="editHandler(item)"> mdi-pencil </v-icon>
                    <v-icon small color="red" @click="deleteHandler(item.id)"> mdi-delete </v-icon>
                </template>
            </v-data-table>
        </v-card>


        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headLine">{{ formTitle }} Pesanan</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <!-- Pengirim -->
                        <v-text-field
                            v-model="form.pengirim_nama"
                            label="Nama Pengirim"
                            required
                        ></v-text-field>

                        <v-textarea
                            v-model="form.pengirim_alamat"
                            label="Alamat Pengirim"
                            required
                        ></v-textarea>

                        <v-text-field
                            v-model="form.pengirim_nomor"
                            label="Nomor Telepon Pengirim"
                            required
                        ></v-text-field>
                       
                       <!-- Penerima -->
                        <v-text-field
                            v-model="form.penerima_nama"
                            label="Nama Penerima"
                            required
                        ></v-text-field>

                        <v-textarea
                            v-model="form.penerima_alamat"
                            label="Alamat Penerima"
                            required
                        ></v-textarea>

                        <v-text-field
                            v-model="form.penerima_nomor"
                            label="Nomor Telepon Penerima"
                            required
                        ></v-text-field>

                        <!-- Kurir dan Paket -->
                        <v-select
                            v-model="form.jenisKurir"
                            :items="kurirs"
                            item-text="jenisKurir"
                            item-value="jenisKurir"
                            label="Kurir"
                            required
                        ></v-select>

                        <v-select
                            v-model="form.jenisPaket"
                            :items="pakets"
                            item-text="jenisPaket"
                            item-value="jenisPaket"
                            label="Paket"
                            required
                        ></v-select>


                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="orange darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="orange darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Apakah anda ingin membatalkan pesanan?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="orange darken-1" text @click="dialogDelete = false">Cancel</v-btn>
              <v-btn color="orange darken-1" text @click="deleteData">OK</v-btn>
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
            headers: [
                {
                    text: "Nama Pengirim",
                    align: "start",
                    sortable: true,
                    value: "pengirim_nama",
                },
                
                { text: "Alamat Pengirim", value: "pengirim_alamat" },
                { text: "Nomor Telepon Pengirim", value: "pengirim_nomor" },

                {
                    text: "Nama Penerima",
                    align: "start",
                    sortable: true,
                    value: "penerima_nama",
                },
                { text: "Alamat Penerima", value: "penerima_alamat" },
                { text: "Nomor Telepon Penerima", value: "penerima_nomor" },

                {
                    text: "Kurir",
                    align: "start",
                    sortable: true,
                    value: "jenisKurir",
                },

                {
                    text: "Paket",
                    align: "start",
                    sortable: true,
                    value: "jenisPaket",
                },
                { text: "Actions", value: "actions" },
            ],

            pesanan: new FormData,
            pesanans: [],
            kurirs: [],
            pakets: [],
            form: {
              pengirim_nama: null,
              pengirim_alamat: null,
              pengirim_nomor: null,

              penerima_nama: null,
              penerima_alamat: null,
              penerima_nomor: null,

              jenisKurir: null,
              jenisPaket: null,
            },

            deleteId: null,
            editId: null,
           
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
            var url = this.$api + '/pesanan';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.pesanans = response.data.data;
            })
        },
        getKurir(){
             var url = this.$api + '/kurir';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.kurirs = response.data.data;
            })
        },
        getPaket(){
            var url = this.$api + '/paket';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.pakets = response.data.data;
            })
        },
        save(){
            this.pesanan.append('pengirim_nama', this.form.pengirim_nama);
            this.pesanan.append('pengirim_alamat', this.form.pengirim_alamat);
            this.pesanan.append('pengirim_nomor', this.form.pengirim_nomor);

            this.pesanan.append('penerima_nama', this.form.penerima_nama);
            this.pesanan.append('penerima_alamat', this.form.penerima_alamat);
            this.pesanan.append('penerima_nomor', this.form.penerima_nomor);

            this.pesanan.append('jenisKurir', this.form.jenisKurir);
            this.pesanan.append('jenisPaket', this.form.jenisPaket);


            var url = this.$api + '/pesanan'
            this.load = true;
            this.$http.post(url, this.pesanan, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.close();
                this.readData();
                this.resetForm();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        update(){
            let newData = {
                pengirim_nama: this.form.pengirim_nama,
                pengirim_alamat: this.form.pengirim_alamat,
                pengirim_nomor: this.form.pengirim_nomor,

                penerima_nama: this.form.penerima_nama,
                penerima_alamat: this.form.penerima_alamat,
                penerima_nomor: this.form.penerima_nomor,

                jenisKurir: this.form.jenisKurir,
                jenisPaket: this.form.jenisPaket,
            };

            var url = this.$api + '/pesanan/' + this.editId;
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
            var url = this.$api + '/pesanan/' + this.deleteId;
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
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.id;

            this.form.pengirim_nama = item.pengirim_nama;
            this.form.pengirim_alamat = item.pengirim_alamat;
            this.form.pengirim_nomor = item.pengirim_nomor;

            this.form.penerima_nama = item.penerima_nama;
            this.form.penerima_alamat = item.penerima_alamat;
            this.form.penerima_nomor = item.penerima_nomor;

            this.form.jenisKurir = item.jenisKurir;
            this.form.jenisPaket = item.jenisPaket;

            this.dialog = true;
        },
        deleteHandler(id){
            this.deleteId = id;
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
              pengirim_nama: null,
              pengirim_alamat: null,
              pengirim_nomor: null,

              penerima_nama: null,
              penerima_alamat: null,
              penerima_nomor: null,

              jenisKurir: null,
              jenisPaket: null,
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
        this.getKurir();
        this.getPaket();
    },
};
</script>