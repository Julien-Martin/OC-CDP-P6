<template>
    <div id="appToolbar" class="hidden-print-only">
        <v-toolbar color="primary" dark fixed app clipped-right>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>ME Assistant</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu offset-y>
                <v-btn icon slot="activator">
                    <v-icon>account_circle</v-icon>
                </v-btn>
                <v-card>
                    <v-list>
                        <v-list-tile router to="settings">
                            <v-list-tile-action>
                                <v-icon>settings</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-title>Paramètres</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="logout">
                            <v-list-tile-action>
                                <v-icon>exit_to_app</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-title>Déconnexion</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-menu>
        </v-toolbar>
        <v-navigation-drawer v-model="drawer" fixed app>
            <v-list>
                <v-list-tile v-for="link in links" :key="link.path" router :to="link.path">
                    <v-list-tile-action>
                        <v-icon>{{link.icon}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>{{link.name}}</v-list-tile-title>
                </v-list-tile>
            </v-list>
            <v-spacer></v-spacer>
            <v-list>
                <v-list-group prepend-icon="security" v-if="isAdmin">
                    <template v-slot:activator>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>Administration</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                    <v-list-tile v-for="link in adminLinks" :key="link.path" router :to="link.path">
                        <v-spacer></v-spacer>
                        <v-list-tile-action>
                            <v-icon>{{link.icon}}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title>{{link.name}}</v-list-tile-title>
                    </v-list-tile>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
    import {links, adminLinks} from "../utils";
    import {onLogout} from '../vue-apollo'

    export default {
        data() {
            return {
                drawer: null,
            }
        },
        methods: {
            logout() {
                const apolloClient = this.$apollo.provider.defaultClient;
                onLogout(apolloClient).then(() => {
                    this.$store.dispatch('logout').then(() => {
                        this.$router.push('/')
                    })
                })
            }
        },
        computed: {
            links() {
                return links
            },
            adminLinks() {
                return adminLinks
            },
            isAdmin() {
                return this.$store.getters.isAdmin
            }
        }
    }
</script>

<style scoped>

</style>