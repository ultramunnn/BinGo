// Node.js 18+ has fetch, FormData, Blob built-in but TypeScript
// doesn't include them without "dom" lib. Declare them here.
declare function fetch(input: string | URL | Request, init?: RequestInit): Promise<Response>;

declare class Blob {
  constructor(parts?: BlobPart[], options?: BlobPropertyBag);
  readonly size: number;
  readonly type: string;
}

declare class FormData {
  append(name: string, value: string | Blob, fileName?: string): void;
}

interface RequestInit {
  method?: string;
  headers?: Record<string, string> | Headers;
  body?: string | Blob | FormData;
}

interface Request {
  url: string;
  method: string;
}

interface Response {
  ok: boolean;
  status: number;
  statusText: string;
  json(): Promise<any>;
}

interface Headers {
  append(name: string, value: string): void;
}

interface BlobPropertyBag {
  type?: string;
}

type BlobPart = string | Blob | ArrayBuffer;