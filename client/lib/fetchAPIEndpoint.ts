export interface FetchAPIEndpointOptions {
  path: string;
  method?: string;
  headers?: { [key: string]: string };
  query?: { [key: string]: string };
  data?: any;
}

export const fetchAPIEndpoint = ({
  path,
  method = 'GET',
  headers = {},
  query,
  data,
}: FetchAPIEndpointOptions): Promise<Response> => {
  const pathWithQuery = query
    ? `${path}?${new URLSearchParams(query).toString()}`
    : path;

  return fetch(pathWithQuery, {
    method,
    headers: {
      'X-CSRF-Token': document.querySelector("[name='csrf-token']")!.getAttribute('content')!,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then((response) => {
    if (String(response.status).match(/2\d{2}/)) {
      return response;
    }

    return Promise.reject({
      notOkayStatus: true,
      response,
    });
  });
};
