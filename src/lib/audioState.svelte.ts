import { browser } from '$app/environment';
import type { SampleDto } from './sample';

interface GlobalAudioState {
    playing: boolean,
    sample?: SampleDto,
    audio?: HTMLAudioElement,
    duration: number,
    currentTime: number,
    paused: boolean,
    seeking: boolean,
    playSample: (sample: SampleDto) => void,
    togglePlayback: () => void
}

export const globalAudioUpdate = () => {
    // don't update while seeking because it would mess up the users input
    if (globalAudioState.seeking) return;
    globalAudioState.duration = globalAudioState.audio?.duration || 0;
    globalAudioState.currentTime = globalAudioState.audio?.currentTime || 0;
    globalAudioState.paused = globalAudioState.audio?.paused || false;
};

let audioUpdateIntervalSet = false;

const playSample = (sample: SampleDto) => {
    if (!browser) return;
    if (!globalAudioState.audio) {
        globalAudioState.audio = new Audio();
    }
    globalAudioState.playing = true;
    globalAudioState.sample = sample;
    globalAudioState.currentTime = 0;
    globalAudioState.audio.src = "http://localhost:3000/audio/" + sample.id;
    globalAudioState.audio.play();
    if (!audioUpdateIntervalSet) {
        setInterval(globalAudioUpdate, 25);
        audioUpdateIntervalSet = true;
    }
}

const togglePlayback = () => {
    if (!globalAudioState.audio) return;
    if (globalAudioState.audio.paused) {
        globalAudioState.audio.play();
        globalAudioState.paused = false;
    } else {
        globalAudioState.audio.pause();
        globalAudioState.paused = true;
    }
}

export const globalAudioState: GlobalAudioState = $state({
    playing: false,
    sample: undefined,
    audio: undefined,
    duration: 0,
    currentTime: 0,
    paused: true,
    seeking: false,
    playSample: playSample,
    togglePlayback: togglePlayback,
});
