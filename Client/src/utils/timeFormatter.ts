export function timeFormatter(date: string): string {
    return new Date(date).toLocaleDateString("en-GB");
}