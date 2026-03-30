import type { SamplePackDto } from "./pack";

export type SampleDto = {
    id: number;
    name: string;
    directory: string;
    samplePack: number;
    duration: number;
    waveformJson: string;
}