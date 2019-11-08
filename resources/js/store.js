import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        currentStoryIndex: 0,
        stories: [
            {
                name: 'codesm',
                slides: [
                    {
                        backgroundImage: 'img1.jpg',
                    },
                    {
                        backgroundImage: 'img2.jpg',
                    }
                ],
            },
            {
                name: 'victor.marian.busoi',
                slides:
                    [
                        {
                            backgroundImage: 'img3.jpg',
                        },
                        {
                            backgroundImage: 'img4.jpg',
                        },
                        {
                            backgroundVideo: 'vid.mp4',
                            duration: 41700
                        }
                    ],
            }
        ]
    },
    mutations: {
        setStories(state, new_stories) {
            state.stories = new_stories;
        },
        removeSlide(state, {story_name, slide_index}) {
            let page = state.stories.filter((item) => item.name.toLowerCase().trim() == story_name);

            if(!page || !page[0]) return;

            page = page[0];

            if(!page.slides[slide_index]) return;

            page.slides = page.slides.filter( (slide, i) => i != slide_index );

            if(page.slides.length == 0) {
                // if the page ends up being empty, remove it altogether
                state.stories = state.stories.filter((item) => item.name.toLowerCase().trim() != story_name);
            }
        },
        insertSlide(state, {story_name, file_name}) {
            let page = state.stories.filter((item) => item.name.toLowerCase().trim() == story_name);

            if(!page || !page[0]) {
                // create new page

                page = {
                    name: story_name,
                    slides: []
                };

                state.stories = [
                    ...state.stories,
                    page
                ];
            } else {
                page = page[0];
            }

            let new_slide = {};

            if( file_name.indexOf('.mp4') != -1 || file_name.indexOf('.webm') != -1 ) {
                new_slide.backgroundVideo = file_name;

                // todo: save video duration
            } else {
                new_slide.backgroundImage = file_name;
            }

            page.slides.push( new_slide );

        },
        setCurrentStoryIndex(state, new_index) {
            state.currentStoryIndex = new_index;
        }
    },
    getters: {
        stories(state) {
            return state.stories
        },
        currentStoryIndex(state) {
            return state.currentStoryIndex;
        }
    },
    plugins: [createPersistedState()]
})
