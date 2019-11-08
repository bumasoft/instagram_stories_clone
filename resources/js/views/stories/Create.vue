<template>
    <v-container>
        <v-form
            class="storyForm"
            ref="form"
            v-model="valid"
        >
            <v-text-field
                light
                v-model="pageName"
                :counter="25"
                :rules="pageNameRules"
                label="Page Name"
                required
            ></v-text-field>

            <v-row
                v-if="selectedPage"
                class="page-editor"
            >
                <v-chip class="file-chip" close @click="confirmDelete(i)" @click:close="confirmDelete(i)" v-for="(slide, i) in selectedPage.slides" :key="i">
                    {{ slide.backgroundImage ? slide.backgroundImage : slide.backgroundVideo }}
                </v-chip>
            </v-row>

            <v-file-input
                v-model="fileUpload"
                light
                required
                :rules="uploadRules"
                accept="image/*,video/*"
                show-size
                label="Select an Image or Video"
                prepend-icon="mdi-camera"
                class="mb-10"
            ></v-file-input>

            <v-container>
                <v-btn
                    color="error"
                    class="mr-4"
                    @click="reset"
                >
                    Reset Form
                </v-btn>

                <v-btn
                    class="float-right"
                    color="success"
                    @click="insert"
                >
                    Add Story
                </v-btn>
            </v-container>

            <v-container>
                <v-row  align="center" justify="center">
                    <router-link :to="{name: 'stories'}">Back to Stories</router-link>
                </v-row>
            </v-container>

        </v-form>
        <v-row justify="center">
            <v-dialog v-model="dialog" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Delete this story?</v-card-title>
                    <v-card-text>Are you sure you want to remove the file "{{ fileToRemove }}", along with its associated story?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>
                        <v-btn color="green darken-1" text @click="deleteConfirmed">Yes</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>

    import { store } from '../../store';
    import axios from 'axios';

    axios.defaults.headers.common = {
        'X-CSRF-TOKEN' : document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    };

    export default {
        data() {
            return {
                fileUpload: null,
                dialog: null,
                fileToRemove: "",
                fileToRemoveIndex: 0,
                valid: true,
                pageName: '',
                pageNameRules: [
                    v => !!v || 'Page Name is required',
                    v => (v && v.length >= 3 && v.length <= 20) || 'Page Name must be between 3 and 20 characters',
                ],
                uploadRules: [
                    v => (v && v.size > 0) || 'You must select an image or video'
                ],
                selectedPage: null
            }
        },

        methods: {
            insert() {
                let formData = new FormData();

                let fileName = this.fileUpload.name;

                formData.append("media", this.fileUpload);
                formData.append("file_name", fileName);

                axios.post('/api/story/new', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => {
                   if(response && response.data && response.data.result === true) {
                       store.commit("insertSlide", {
                               story_name: this.pageName,
                               file_name: fileName
                           }
                       );

                       this.$router.push({name: 'stories'});

                   } else {
                       // display error
                   }
                });
            },
            reset() {
                this.$refs.form.reset();
            },
            resetValidation() {
                this.$refs.form.resetValidation();
            },
            confirmDelete(i) {
                this.fileToRemove = this.selectedPage.slides[i].backgroundImage ?
                                        this.selectedPage.slides[i].backgroundImage :
                                        this.selectedPage.slides[i].backgroundVideo;

                this.fileToRemoveIndex = i;
                this.dialog = true;
            },
            deleteConfirmed() {
                this.dialog = false;

                // TODO: call api through axios to remove file/story

                store.commit("removeSlide", {
                                                story_name: this.selectedPage.name,
                                                slide_index: this.fileToRemoveIndex
                                            }
                            );
            }
        },

        watch: {
            pageName: function (name) {
                let page = store.getters.stories.filter((item) => item.name.toLowerCase().trim() == name);

                this.selectedPage = page ? page[0] : null;

            }
        }
    }
</script>
<style scoped>
    .storyForm {
        color: #fff;
    }

    .page-editor {
        padding: 12px;
    }

    .file-chip {
        margin: 0px 5px 5px 0px;
    }
</style>
