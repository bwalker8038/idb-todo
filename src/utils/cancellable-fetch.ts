type FetchOptions = RequestInit & {
  timeout?: number; // Optional timeout in milliseconds
};

type CancellableFetchResponse = {
  fetchPromise: Promise<Response>;
  cancel: () => void;
};

// This function is a wrapper around the fetch API that allows you to cancel a request if it takes too long.
export function cancellableFetch(
  url: string,
  options?: FetchOptions
): CancellableFetchResponse {
  const { timeout, ...fetchOptions } = options || {};
  const controller = new AbortController();
  const signal = controller.signal;

  const fetchPromise = new Promise<Response>((resolve, reject) => {
    const timer = timeout
      ? setTimeout(() => {
          controller.abort();
          reject(new Error("Request timed out"));
        }, timeout)
      : null;

    fetch(url, { ...fetchOptions, signal })
      .then((response) => {
        if (timer) clearTimeout(timer);
        resolve(response);
      })
      .catch((error) => {
        if (timer) clearTimeout(timer);
        if (signal.aborted) {
          reject(new Error("Request was cancelled"));
        } else {
          reject(error);
        }
      });
  });

  return {
    fetchPromise,
    cancel: () => controller.abort(),
  };
}
