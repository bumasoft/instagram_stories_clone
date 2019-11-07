import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        currentStoryIndex: 0,
        stories: [
            [
                {
                backgroundImage: 'img1.jpg',
                title: 'codesm'
                },
                {
                    backgroundImage: 'img2.jpg',
                    title: 'codesm'
                },
            ],
            [
                {
                    backgroundImage: 'img3.jpg',
                    title: 'marianbusoi'
                },
                {
                    backgroundImage: 'img4.jpg',
                    title: 'marianbusoi'
                },
                {
                    backgroundVideo: 'vid.mp4',
                    title: 'marianbusoi',
                    duration: 41700
                },
            ]
        ]
    },
    mutations: {
        setStories(state, new_stories) {
            state.stories = new_stories;
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
