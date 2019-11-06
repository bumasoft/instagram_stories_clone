<template>
    <v-app id="instaclone">
        <v-content>
            <v-container
                class="fill-height"
                fluid
            >
                <v-row
                    align="center"
                    justify="center"
                >
                    <v-col cols="12" sm="12" md="4">
                        <v-card>
                            <v-toolbar dense>
                                <v-app-bar-nav-icon id="app-menu" @click="menuShown = !menuShown"></v-app-bar-nav-icon>

                                <v-menu activator="#app-menu" :absolute="true" bottom nudge-bottom>
                                    <v-list>
                                        <v-list-item router :to="{ name: 'stories' }">
                                            <v-list-item-title>
                                                My Stories
                                            </v-list-item-title>
                                        </v-list-item>
                                        <v-list-item router :to="{ name: 'create' }">
                                            <v-list-item-title>
                                                Add Story
                                            </v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                                <v-toolbar-title>Instagram Stories Clone</v-toolbar-title>

                                <template v-slot:extension>
                                    <v-btn
                                        color="pink"
                                        dark
                                        small
                                        absolute
                                        top
                                        right
                                        fab
                                        router :to="{ name: 'create' }"
                                    >
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                            </v-toolbar>
                            <v-card-text style="height: 536px;" class="grey dark-text lighten-5">
                                <router-view></router-view>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
    export default {
        data() {
            return {
                menuShown: false
            }
        }
    }
</script>
<style scoped>
    .dark-text {
        color: #000 !important;
    }
</style>
