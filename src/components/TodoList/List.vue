<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">To Do List</h3>
        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify"
                    label="Search" single-line hide-detail></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="todos" :search="search" 
                show-expand item-key="task" class="elevation-1">

                <template v-slot:[`item.priority`]="{ item}">
                    <v-icon color="yellow" @click="showSnackPriority(item.priority)" style="margin-left:12%;">mdi-information</v-icon>
                </template>

                <template v-slot:[`item.actions`]="{ item}">
                    <v-icon color="red" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon color="green" @click="deleteItem(item)">mdi-delete</v-icon>
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length" style="padding:0px;">
                        <v-toolbar v-if="item.priority === 'Penting'" color="red"> {{item.note}} </v-toolbar>
                        <v-toolbar v-if="item.priority === 'Biasa'" color="green"> {{item.note}} </v-toolbar>
                        <v-toolbar v-if="item.priority === 'Tidak Penting'" color="blue"> {{item.note}} </v-toolbar>
                    </td>
                </template>
            </v-data-table>

        </v-card>

        <!-- Add Dialog -->
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Form Todo</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formTodo.task" label="Task" required></v-text-field>
                        <v-select v-model="formTodo.priority" :items="['Penting', 'Biasa', 'Tidak Penting']" label="Priority" required></v-select>
                        <v-textarea v-model="formTodo.note" label="Note" required></v-textarea>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog Delete Yes No -->
        <v-dialog v-model="confirmation" persistent max-width="250px">
            <v-card>
                <v-card-title>
                    <span class="headline">Konfirmasi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        Ingin Menghapus Data?
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelDel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteConfirmation"> Delete </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Edit Dialog -->
        <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Form Edit</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formEdit.task" label="Task" required></v-text-field>
                        <v-select v-model="formEdit.priority" :items="['Penting', 'Biasa', 'Tidak Penting']" label="Priority" required></v-select>
                        <v-textarea v-model="formEdit.note" label="Note" required></v-textarea>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelEdit"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="editData"> Edit </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar
            v-model="snackRed"
            :timeout="timeout" color="red" top right>
            Penting!
        </v-snackbar>

        <v-snackbar
            v-model="snackGreen"
            :timeout="timeout" color="green" top left>
            Biasa!
        </v-snackbar>

        <v-snackbar
            v-model="snackBlue"
            :timeout="timeout" color="blue">
            Tidak Penting!
        </v-snackbar>

    </v-main>

</template>

<script>
export default{
    name: "List",
    data(){
        return {
            search: null,
            dialog: false,
            editDialog: false,
            confirmation: false,
            tempDelete: null,
            timeout: 1000,
            snackRed: false,
            snackGreen: false,
            snackBlue: false,
            tempEditItem: null,
            index: null,
            headers: [
                {
                    text: "Task",
                    align: "start",
                    sortable: "true",
                    value: "task",
                },
                {text: "Check Priority", value: "priority" },
                // {text: "Note", value: "note" },
                {text: "Actions", value: "actions" },
            ],

            todos: [
                {
                    task: "Coding",
                    priority: "Penting",
                    note: "Code for your life",
                },
                {
                    task: "Gaming",
                    priority: "Tidak Penting",
                    note: "Wasting Time",
                },
                {
                    task: "Masak",
                    priority: "Biasa",
                    note: "Indomi saat coding terbaik gan",
                },
            ],

            formTodo: {task: null, priority: null, note: null},
            formEdit: {task: null, priority: null, note: null},
        };
    },
    methods: {
        save(){
            this.todos.push(this.formTodo);
            this.resetForm();
            this.dialog = false;
        },
        cancel(){
            this.resetForm();
            this.dialog = true;
        },
        resetForm(){
            this.formTodo = {task: null, priority: null, note: null};
        },
        cancelDel(){
            this.confirmation = false;
        },
        deleteItem(item){
            this.confirmation = true;
            this.tempDelete = this.todos.indexOf(item);
        },
        deleteConfirmation(){
            this.todos.splice(this.tempDelete, 1);
            this.confirmation = false;
            this.tempDelete = null;
        },
        editItem(item){
            this.editDialog = true;
            this.index = this.todos.indexOf(item);
            this.formEdit = Object.assign({}, this.todos[this.index]);
            this.tempEditItem = Object.assign({}, this.todos[this.index]);
        },
        cancelEdit(){
            this.tempEditItem = null;
            this.index = null;
            this.formEdit = {task: null, priority: null, note: null};
            this.editDialog = false;
        },
        editData(){
            if(this.index >= 0)
            {
                Object.assign(this.todos[this.index], this.formEdit);
            }
            else
            {
                this.todos.push(this.formEdit);
            }

            this.cancelEdit();
        },
        showSnackPriority(priority){
            if(priority === 'Biasa')
            {
                this.snackGreen = true;
            }
            else if(priority === 'Penting')
            {
                this.snackRed = true;
            }
            else if(priority === 'Tidak Penting')
            {
                this.snackBlue = true;
            }
        },
    },
};
</script>
