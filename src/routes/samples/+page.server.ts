import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({url}) => {
    const searchQuery = url.searchParams.get("q") || "";
    const samples = await fetch(`http://localhost:3000/samples?q=${encodeURIComponent(searchQuery)}`)
    const samplesData = await samples.json();
    return {
        samples: samplesData.samples,
        samplePacks: samplesData.samplePacks,
        searchQuery: searchQuery
    };
}