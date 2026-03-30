<script lang="ts">
    import WaveSurfer from 'wavesurfer.js'
    
    import type { SamplePackDto } from "$lib/pack";
    import type { SampleDto } from "$lib/sample";
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { globalAudioState } from '$lib/audioState.svelte';

    export type SampleProps = {
        sample: SampleDto;
        samplePack: SamplePackDto;
    };
    let props: SampleProps = $props();

    const uid = $props.id();

    let isPlaying = $derived(globalAudioState.playing && globalAudioState?.sample?.id == props.sample.id);
    let isPaused = $derived(globalAudioState.paused);
    
    let downloading = $state(false);

    let wavesurfer: WaveSurfer | null = null;
    let wavesurferElem: HTMLDivElement | null = $state(null);
    onMount(() => {
        if (!browser) return;

        // Parse waveform JSON
        let waveformData = JSON.parse(props.sample.waveformJson).data;

        wavesurfer = WaveSurfer.create({
            container: wavesurferElem!,
            waveColor: '#424242',
            progressColor: '#db76b0',
            dragToSeek: true,
            barWidth: 2,
            height: 24,
            width: 160,
            normalize: true,
            barRadius: 4,
            cursorColor: 'transparent',
            // url: getAssetUrl(song.audioAssetId),
            peaks: waveformData,
            duration: props.sample.duration,
        });

        // Register events
        wavesurfer.on("dragstart", (_) => {
            globalAudioState.seeking = true;
            globalAudioState.audio?.pause();
            globalAudioState.paused = true;
        });

        wavesurfer.on("dragend", (_) => {
            globalAudioState.seeking = false;
            globalAudioState.audio?.play();
            globalAudioState.paused = false;
        });

        wavesurfer.on('interaction', (currentTime) => {
            if (!isPlaying) {
                globalAudioState.playSample(props.sample);
                return
            }
            if (globalAudioState.audio) {
                globalAudioState.audio.currentTime = currentTime;
                globalAudioState.currentTime = currentTime;
            }
        });

        wavesurferElem!.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    });


    $effect(() => {
        if (!wavesurfer) return;
        if (!isPlaying) {
            wavesurfer?.setTime(0);
            return;
        };
        wavesurfer.setTime(globalAudioState.currentTime);
    })
    
    function sampleClick() {
        if (globalAudioState.playing && globalAudioState.sample?.id === props.sample.id) {
            if (globalAudioState.paused) {
                globalAudioState.playSample(props.sample);
            } else {
                globalAudioState.audio?.pause();
                globalAudioState.paused = true;
            }
            return;
        }
        globalAudioState.playSample(props.sample);
    }

    function keyDown(event: KeyboardEvent) {
        if (event.key === "Enter")
            sampleClick();
    }
    
    async function sampleDrag(event: DragEvent) {
        event.preventDefault()
        downloading = true;
        await window.electronAPI.downloadSample(props.sample.id, props.sample.name);
        downloading = false;
        window.electronAPI.startDrag(props.sample.name);
    }
</script>

<div
    class={`sample${isPlaying ? " playing" : ""}`}
    onclick={sampleClick}
    onkeydown={keyDown}
    ondragstart={sampleDrag}
    draggable="true"
>
    <img src={`http://localhost:3000/cover/${props.samplePack?.id}`} alt="Sample Pack Cover" width="36" height="36"/>
    <div class="info">
        <span class="name">{props.sample.name}</span>
        <span class="pack">{props.samplePack?.name}</span>
    </div>
    <div class="wavesurfer wavesurfer-{uid}" bind:this={wavesurferElem} style="min-height: 36px"></div>
    <span class="duration">{props.sample.duration.toFixed(2)}s</span>
</div>

<style>
    .sample {
        display: flex;
        align-items: center;
        padding: 9px 16px;
        border-bottom: 1px solid var(--border);
        gap: 16px;
    }

    .sample.playing {
        box-shadow: inset 3px 0 0 0px var(--accent);
        background: rgba(255, 255, 255, 0.04);
    }
    .sample:hover {
        background: rgba(255, 255, 255, 0.02);
    }
    .sample:hover.playing {
        background: rgba(255, 255, 255, 0.06);
    }
    .sample img {
        border-radius: 2px;
    }

    .sample .info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-right: 24px;
        max-width: 280px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex: 1;
    }

    .sample .info .pack {
        color: var(--text-info);
    }

    .sample .duration {
        color: var(--text-info);
    }

    .sample .wavesurfer {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>