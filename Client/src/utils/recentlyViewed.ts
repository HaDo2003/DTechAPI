const COOKIE_NAME = "recentlyViewed";
const MAX_ITEMS = 5;

// Save product to cookie
export function addToRecentlyViewed(productId: number) {
    let viewed: number[] = [];

    // Get cookie
    const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(COOKIE_NAME + "="));

    if (cookie) {
        try {
            viewed = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
        } catch {
            viewed = [];
        }
    }

    // Remove if already exists
    viewed = viewed.filter((id) => id !== productId);

    // Add to front
    viewed.unshift(productId);

    // Keep only max items
    if (viewed.length > MAX_ITEMS) {
        viewed = viewed.slice(0, MAX_ITEMS);
    }

    // Save back to cookie (7 days expiry)
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify(viewed)
    )}; path=/; max-age=${7 * 24 * 60 * 60}`;
}

// Get list of recently viewed product IDs
export function getRecentlyViewed(): number[] {
    const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(COOKIE_NAME + "="));

    if (cookie) {
        try {
            return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
        } catch {
            return [];
        }
    }
    return [];
}