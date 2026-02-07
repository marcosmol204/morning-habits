export class FetchError extends Error {
    info?: any;
    status?: number;
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
        const error = new FetchError("An error occurred while fetching the data.");
        // Attach extra info to the error object.
        try {
            error.info = await res.json();
        } catch (e) {
            // If we can't parse JSON, it might just be a string error or empty
            error.info = { message: res.statusText };
        }
        error.status = res.status;
        throw error;
    }

    return res.json();
};
