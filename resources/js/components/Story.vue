<template>
        <div class="story" :style="storyCSS">
            <video preload="yes" autoplay playsinline muted :style="videoCSS" :src="videoSRC">
                <source :src="videoSRC" type="video/mp4" />
            </video>

            <div class="timeline">
                <div class="slice" v-for="(slide, i) in storyData.slides" :key="i">
                    <!-- v-progress-bar would cause Vue to re-render on each value update, we're better off using the DOM directly -->
                    <div class="progress">&nbsp;</div>
                </div>
            </div>
            <div class="slide">
                <p>
                    <v-avatar color="black" :size="32" style="margin-right: 8px;">
                        <img
                            src="https://www.upwork.com/profile-portraits/c1omt9esKVIOHWANuPag7klcM6exnA2ouBIQ--8cs_GvpQ3zi_dNRTGGShy1qwpEYE"
                            alt="John"
                        >
                    </v-avatar>

                    {{ storyData.name }} <small>9h</small>
                </p>

            </div>
        </div>

</template>

<script>
    import debounce from 'lodash/debounce';
    import anime from 'animejs/lib/anime.es.js';
    import Hammer from 'hammerjs';
    import { store } from '../store';
    import { EventBus } from '../eventbus';

    const SLIDE_DURATION = 5000;

    export default {
        name: 'Story',
        props: {
            storyData: Object,
            index: Number
        },
        data() {
            const timeline = anime.timeline({
                autoplay: false,
                duration: SLIDE_DURATION,
                easing: 'linear',
                videoCheckerTimer: null,
                currentVideo: null
            });

            return {
                currentSlideIndex: 0,
                isActive: false,
                timeline: timeline,
                store,
                progress: [],
            }
        },
        computed: {
            storyCSS() {
                return {
                    backgroundColor: this.storyData.slides[this.currentSlideIndex].backgroundColor,
                    backgroundImage: this.storyDataSrc,
                    backgroundSize: 'cover',
                    width: 100/store.getters.stories.length + '%'
                }
            },
            storyDataSrc() {
                const bgImage = this.storyData.slides[this.currentSlideIndex].backgroundImage ?
                    `url(storage/userfiles/${this.storyData.slides[this.currentSlideIndex].backgroundImage})` :
                    '';

                return bgImage;
            },
            videoCSS() {
                if(!this.storyData.slides[this.currentSlideIndex].backgroundVideo || store.getters.currentStoryIndex != this.index) {
                    return { display: 'none' };
                } else {

                    return {
                        display: 'block',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        '-webkit-transform': 'translateX(-50%) translateY(-50%)',
                        transform: 'translateX(-50%) translateY(-50%)',
                        minWidth: this.viewportWidth + 'px',
                        minHeight: '100%'
                    }
                }
            },
            videoSRC() {
                if(store.getters.currentStoryIndex != this.index) return '';

                const bgVideo = this.storyData.slides[this.currentSlideIndex].backgroundVideo ?
                    `storage/userfiles/${this.storyData.slides[this.currentSlideIndex].backgroundVideo}` :
                    '';

                return bgVideo;
            }
        },
        methods: {
            activate: function() { // Start timer
                this.resetSlide();
            },
            deactivate: function() {
                this.timeline.pause();
                if(this.currentVideo) {
                    this.currentVideo.pause();
                }
            },
            resetSlide: function() { // Jump to beginning of the slide
                this.timeline.pause();
                this.timeline.seek(this.currentSlideIndex * SLIDE_DURATION);
                this.timeline.play();
                if(this.currentVideo) {
                    this.currentVideo.currentTime = 0;
                    this.currentVideo.play();
                }
            },
            nextSlide: function() {
                if (this.currentSlideIndex < this.storyData.slides.length - 1) {
                    this.currentSlideIndex++;
                    this.resetSlide();
                } else {
                    this.nextStory();
                }
            },
            previousSlide: function() {
                if (this.currentSlideIndex > 0) {
                    this.currentSlideIndex--;
                    this.resetSlide();
                } else {
                    this.previousStory();
                }
            },
            nextStory: function() {
                EventBus.$emit('NEXT_STORY');
            },
            previousStory: function() {
                EventBus.$emit('PREVIOUS_STORY');
            }
        },
        mounted() {
            let $timeline = this.$el.getElementsByClassName('timeline')[0];

            // Add progress bars to the timeline animation group
            this.storyData.slides.forEach((item, index) => {
                this.timeline.add({
                    targets: $timeline.getElementsByClassName('slice')[index].getElementsByClassName('progress'),
                    width: '100%',
                    duration: item.duration ? item.duration : SLIDE_DURATION,
                    changeBegin: () => {
                        // Update the Vue component state when progress bar begins to play
                        this.currentSlideIndex = index;
                    },
                    complete: () => {
                        // Move to the next story when finished playing all slides
                        if (index === this.storyData.slides.length - 1) {
                            this.nextStory();
                        }
                    }
                });
            });

            this.hammer = new Hammer.Manager(this.$el, {
                recognizers: [
                    [Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }],
                    [Hammer.Tap],
                    [Hammer.Press, { time: 1, threshold: 1000000 }]
                ]
            })

            this.hammer.on("press", () => {
                this.timeline.pause();
                if(this.currentVideo) {
                    this.currentVideo.pause();
                }
            });

            this.hammer.on("pressup tap", () => {
                this.timeline.play();
                if(this.currentVideo) {
                    this.currentVideo.play();
                }
            });

            // Tap on the side to navigate between slides
            this.hammer.on("tap", event => {
                if (event.center.x > window.innerWidth / 2) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            });

            // Handle swipe
            this.hammer.on("pan", event => {
                if (event.isFinal) {
                    if (event.deltaX < 0) {
                        this.nextStory();
                    } else if (event.deltaX > 0) {
                        this.previousStory();
                    }
                }
            });
        },
        watch: {
            currentSlideIndex: function (index) {
                clearInterval(this.videoCheckerTimer);

                if(this.storyData.slides[index].backgroundVideo) {
                    this.timeline.pause();

                    let $vid = this.$el.getElementsByTagName('video')[0];

                    $vid.volume = 1;
                    $vid.muted = false;

                    this.videoCheckerTimer = setInterval( () => {
                        let duration = $vid.duration * 1000;
                        console.log(duration);

                        if(!isNaN(duration)) {
                            clearInterval(this.videoCheckerTimer);
                            this.currentVideo = $vid;
                            this.timeline.play();

                        }
                    }, 10 );

                }
            }
        }
    }
</script>

<style scoped>
    .story {
        float: left;
        position: relative;
        height: 100%;
        z-index: 1;
        display: flex;
        flex-direction: column;
    }

    .timeline {
        z-index: 10000;
        display: flex;
        padding: 10px;
        flex-grow: 0;
        width: 100%;
    }

    .timeline > .slice {
        background: #a0a0a0;
        height: 3px;
        margin: 0px 1px;
        width: 100%;
    }

    .timeline > .slice > .progress {
        background: #f0f0f0;
        height: 3px;
        width: 0%;
    }

    .slide {
        z-index: 9000;
        /* Take the rest of the page */
        flex-grow: 1;
        padding: 0 11px;
    }

    .slide p {
        font-size: 11pt;
        font-weight: 700;
        font-family: 'Lato';
        color: #fff;
    }

    .slide p > small {
        color: #f0f0f0;
        margin-left: 8px;
        font-size: 12pt;
        font-weight: 400;
    }
</style>
