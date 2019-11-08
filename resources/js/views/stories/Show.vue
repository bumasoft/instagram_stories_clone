<template>
    <div id="stories-wrapper">
        <div id="stories" :style="storiesCSS">
            <Story :storyData="story" v-for="(story, index) in stories" :key="index" :index="index" ref="stories" />
        </div>
        <v-btn
            class="add-story-btn"
            color="white"
            light
            small
            absolute
            bottom
            center
            fab
            router :to="{ name: 'create' }"
        >
            <v-icon>mdi-camera</v-icon>
        </v-btn>
    </div>
</template>

<script>
    import debounce from 'lodash/debounce';
    import Story from '../../components/Story';
    import {store} from "../../store"
    import { EventBus } from '../../eventbus';

    export default {
        components: {
            Story
        },
        data() {
            return {
                stories: store.getters.stories,
                viewportWidth: 456,  // this will be calculated on mount
            }
        },
        beforeDestroy() {
            EventBus.$off('NEXT_STORY');
            EventBus.$off('PREVIOUS_STORY');
        },
        mounted () {
            store.commit("setCurrentStoryIndex", 0);

            this.setViewport();
            window.onresize = this.setViewport;

            EventBus.$on('NEXT_STORY', () => {
                if (store.getters.currentStoryIndex < store.getters.stories.length - 1) {
                    this.$refs.stories[store.getters.currentStoryIndex].deactivate();
                    this.$refs.stories[store.getters.currentStoryIndex].timeline.seek(0);
                    this.$refs.stories[store.getters.currentStoryIndex].resetSlide();

                    store.commit("setCurrentStoryIndex", store.getters.currentStoryIndex+1);

                    this.$refs.stories[store.getters.currentStoryIndex].activate();
                }
            });

            EventBus.$on('PREVIOUS_STORY', () => {
                if (store.getters.currentStoryIndex > 0) {
                    this.$refs.stories[store.getters.currentStoryIndex].deactivate();
                    this.$refs.stories[store.getters.currentStoryIndex].resetSlide();

                    store.commit("setCurrentStoryIndex", store.getters.currentStoryIndex-1);

                    this.$refs.stories[store.getters.currentStoryIndex].activate();
                } else {
                    this.$refs.stories[store.getters.currentStoryIndex].resetSlide();
                }
            });

            this.$refs.stories[0].activate();

        },
        computed: {
            storiesCSS() {
                return {
                    'margin-left': (store.getters.currentStoryIndex * this.viewportWidth * -1) + 'px',
                    'width': this.viewportWidth *  store.getters.stories.length + 'px'
                };
            }
        },
        methods: {
            setViewport() {
                this.viewportWidth = document.getElementById("main-content").offsetWidth;
            }
        }
    }
</script>

<style scoped>
    #stories-wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    #stories {
        transition: margin .3s ease-out;
        height: 100%;
        position: relative;
    }

    .add-story-btn {
        background-color: rgba(200, 200, 200, 50) !important;
        z-index: 20000;
        position: absolute;
        left: calc(50% - 24px);
        margin-bottom: 50px;
    }

</style>
