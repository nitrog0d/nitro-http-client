import http from 'http';
import https from 'https';

export interface HttpResponse {
  body?: string | Buffer;
  headers?: http.OutgoingHttpHeaders;
  statusCode?: number;
  statusMessage?: string;
}

export interface HttpRequestOptions {
  body?: string | Buffer;
  setContentLengthAutomatically?: boolean;
  responseBodyAsString?: boolean;
}

export interface ClientSettings {}

export function headersFromRawHeaders(rawHeaders: string[]) {
  if (rawHeaders.length === 0) return {};
  const convertedHeaders: http.OutgoingHttpHeaders = {};
  const length = rawHeaders.length / 2;
  for (let i = 0; i < length; i++) convertedHeaders[rawHeaders.shift()] = rawHeaders.shift();
  return convertedHeaders;
}

export function mapToDict(map: Map<string, string>) {
  const dict: http.OutgoingHttpHeaders = {};
  map.forEach((value, key) => dict[key] = value);
  return dict;
}

export function dictToMap(dict: http.OutgoingHttpHeaders) {
  const map = new Map<string, string>();
  Object.entries(dict).map(value => map.set(value[0], value[1] as string));
  return map;
}

export class NitroHttpClient {

  public clientSettings: ClientSettings = {};

  constructor(clientSettings?: ClientSettings) {
    if (clientSettings) {}
  }

  public async request(url: string, options?: HttpRequestOptions & https.RequestOptions): Promise<HttpResponse> {
    return await new Promise((resolve, reject) => {
      try {
        const parsedUrl = new URL(url);
        const isHttps = parsedUrl.protocol === 'https:';
        if (!options) options = {};

        if (options.setContentLengthAutomatically === undefined) options.setContentLengthAutomatically = true;
        if (options.responseBodyAsString === undefined) options.responseBodyAsString = true;

        const newHeaders: http.OutgoingHttpHeaders = {
          Host: parsedUrl.hostname
        }

        if (options.headers) Object.entries(options.headers).map(value => newHeaders[value[0]] = value[1]);
        options.headers = newHeaders;

        options.host = parsedUrl.hostname;
        if (options.port === undefined) options.port = parsedUrl.port.length !== 0 ? parsedUrl.port : isHttps ? 443 : 80;
        options.path = parsedUrl.pathname + parsedUrl.search;

        if (options.setContentLengthAutomatically && !options.headers['Content-Length'] && options.body) options.headers['Content-Length'] = options.body.length;

        const callback = (res: http.IncomingMessage) => {
          const chunks: Buffer[] = [];

          res.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            const finalBuffer = Buffer.concat(chunks);

            resolve({
              body: finalBuffer.length !== 0 ? (options.responseBodyAsString ? finalBuffer.toString('utf8') : finalBuffer) : undefined,
              headers: res.rawHeaders.length !== 0 ? headersFromRawHeaders([ ...res.rawHeaders ]) : undefined,
              statusCode: res.statusCode,
              statusMessage: res.statusMessage
            });
          });

          res.on('error', (error) => {
            reject(error);
          });
        }

        const request = isHttps ? https.request(options, callback) : http.request(options, callback);

        if (options.body) request.write(options.body);
        request.end();
      } catch (e) {
        reject(e);
      }
    });
  }
}
