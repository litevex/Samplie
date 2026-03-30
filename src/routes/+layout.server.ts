export async function load({ url }) {
    const searchQuery = url.searchParams.get("q") || "";
    return {
        searchQuery
    };
}