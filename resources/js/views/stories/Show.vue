<template>
    <div id="stories" :style="storiesCSS">
        <Story :slides="story" v-for="(story, index) in stories" :key="index" ref="stories" />
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
        created() {
            store.commit("setCurrentStoryIndex", 0);
        },
        mounted () {

            this.setViewport();
            window.onresize = this.setViewport;

            EventBus.$on('NEXT_STORY', () => {
                if (store.getters.currentStoryIndex < store.getters.stories.length - 1) {
                    this.$refs.stories[store.getters.currentStoryIndex].deactivate();
                    store.commit("setCurrentStoryIndex", store.getters.currentStoryIndex+1);

                    this.$refs.stories[store.getters.currentStoryIndex].activate();
                }
            });

            EventBus.$on('PREVIOUS_STORY', () => {
                if (store.getters.currentStoryIndex > 0) {
                    this.$refs.stories[store.getters.currentStoryIndex].deactivate();
                    store.commit("setCurrentStoryIndex", store.getters.currentStoryIndex-1);

                    this.$refs.stories[store.getters.currentStoryIndex].activate();
                } else {
                    this.$refs.stories[store.getters.currentStoryIndex].resetSlide();
                }
            });

            // Debounced previous and next
            const debouncedNext = debounce(() => {
                EventBus.$emit('NEXT_STORY');
            }, 100, { leading: true, trailing: false });
            const debouncedPrevious = debounce(() => {
                EventBus.$emit('PREVIOUS_STORY');
            }, 100, { leading: true, trailing: false });

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
    #stories {
        transition: margin .3s ease-out;
        height: 100%;
        position: relative;
    }

</style>
