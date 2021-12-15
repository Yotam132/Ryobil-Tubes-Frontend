<template>
    <div class="dashboard">
        <v-navigation-drawer class="fullheight" width="256" permanent app fixed>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">RYOBIL</v-list-item-title>
                    <v-list-item-subtitle> JASA ANTAR NO.1 </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list dense nav v-if="isAdmin">
                <v-list-item
                    v-for="item in itemsAdmin"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-list dense nav v-if="!isAdmin">
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>


        </v-navigation-drawer>

        <v-app-bar app fixed height="75px">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-spacer/>
            <v-toolbar-items>
                <v-btn text router @click="logout"><v-icon>mdi-power</v-icon></v-btn>
            </v-toolbar-items>
        </v-app-bar>

        <div class="orange fullheight pa-5">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

export default {
    name: "Dashboard",
    data(){
        return {
            drawer: true,

            items: [
                { title: "Perusahaan", to: "/about"},
                { title: "Pemesanan", to: "/pesanan"},
                { title: "Profile", to: "/profile"},
            ],

            itemsAdmin: [
                { title: "Kurir", to: "/adminKurir"},
                { title: "Paket", to: "/adminPaket"},
            ],
        };
    },
    methods: {
        logout(){
            localStorage.clear();
            this.$router.push({
                name: 'Home',
            });
        },
    },
    computed: {
        isAdmin(){
            return localStorage.getItem("isAdmin") == 1;
        },
    },
};
</script>

<style scoped>
.fullheight{
    min-height: 100vh !important;
}

.router{
    text-decoration: none;
    color: black;
}
</style>
