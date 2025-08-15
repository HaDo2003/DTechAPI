export function addToRecentlyViewed(productId: number) {
    const cookieName = "recentlyViewed";
    const maxItems = 5;

    let viewed: number[] = [];

    // Get cookie
    const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith(cookieName + "="));

    if (cookie) {
        try {
            viewed = JSON.parse(decodeURIComponent(cookie.split("=")[1])) as number[];
        } catch {
            viewed = [];
        }
    }

    // Remove if already exists
    viewed = viewed.filter(id => id !== productId);

    // Add new one to beginning
    viewed.unshift(productId);

    // Limit to maxItems
    viewed = viewed.slice(0, maxItems);

    // Save cookie for 7 days
    document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(viewed))};path=/;max-age=${60 * 60 * 24 * 7}`;
}
