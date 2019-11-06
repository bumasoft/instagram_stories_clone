import VueRouter from 'vue-router'
import Stories from './views/stories/Show'
import CreateStory from './views/stories/Create'

/**
 * Create and export Router
 *
 */

export const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'stories',
            component: Stories
        },
        {
            path: '/create',
            name: 'create',
            component: CreateStory,
        },
    ],
});
