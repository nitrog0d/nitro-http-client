# nitro-http-client
[![npm release](https://img.shields.io/npm/dt/nitro-http-client?style=for-the-badge)](https://www.npmjs.com/package/nitro-http-client)
[![Support me on Patreon](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fwww.patreon.com%2Fapi%2Fcampaigns%2F1177520&query=data.attributes.patron_count&suffix=%20Patrons&color=FF5441&label=Patreon&logo=Patreon&logoColor=FF5441&style=for-the-badge)](https://patreon.com/nitrog0d)

A HTTP client module I made because I can't deal with other modules  
It does not support/handle compression, I'll eventually implement it according to my needs

## Installation

* NPM: `npm install nitro-http-client`  
* Yarn: `yarn add nitro-http-client`

## Usage

### JavaScript
**Create the client**
```js
const nitroHttpClient = require('nitro-http-client');
const httpClient = new nitroHttpClient.NitroHttpClient();
```

### TypeScript
**Create the client**
```ts
import { NitroHttpClient } from 'nitro-http-client';
const httpClient = new NitroHttpClient();
```

### Examples
**Example with default values, no body, GET method, no extra headers**
```js
const response = await httpClient.request('https://example.com');
console.log(response.statusCode);
```

**.then example since it returns a Promise**
```js
httpClient.request('https://example.com').then(response => {
  console.log(response.body);
});

```
**Example with custom values**
```js
const response = await httpClient.request('https://example.com', {
  method: 'POST',
  headers: {
    Authentication: '123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ test: 123 })
});
console.log(response.headers);
```
