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
                backgroundColor: "#D53738",
                backgroundImage: 'img1.jpg',
                title: 'bla bla'
                },
                {
                    backgroundColor: "#638867",
                    backgroundImage: 'img2.jpg',
                    title: 'bla bla2'
                },
            ],
            [
                {
                    backgroundColor: "#DAF7A6",
                    backgroundImage: 'img3.jpg',
                    title: 'bla bla3'
                },
                {
                    backgroundColor: "#FFC300",
                    backgroundImage: 'img4.jpg',
                    title: 'bla bla4'
                },
                {
                    backgroundColor: "#FF5733",
                    backgroundVideo: 'vid.mp4',
                    title: 'bla bla5'
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
