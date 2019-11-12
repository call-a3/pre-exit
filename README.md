# pre-exit

[![NPM](https://img.shields.io/npm/v/pre-exit.svg)](https://www.npmjs.com/package/pre-exit)
[![Travis](https://img.shields.io/travis/call-a3/pre-exit.svg)](https://travis-ci.com/call-a3/pre-exit)
[![Codecov](https://img.shields.io/codecov/c/github/call-a3/pre-exit.svg)](https://codecov.io/gh/call-a3/pre-exit)
[![Greenkeeper badge](https://badges.greenkeeper.io/call-a3/pre-exit.svg)](https://greenkeeper.io/)
[![David](https://img.shields.io/david/call-a3/pre-exit.svg)](https://david-dm.org/call-a3/pre-exit)
[![David Dev](https://img.shields.io/david/dev/call-a3/pre-exit.svg)](https://david-dm.org/call-a3/pre-exit?type=dev)

Clean up before you exit.

## Installing

```bash
# npm
npm install -s pre-exit

# yarn
yarn add pre-exit
```

## Usage

This package will listen on

```js
import preExit from 'pre-exit'

// If there's an HTTP(S) server listening (assume that's `httpServer`)
// then you probably want to close it down gracefully before shutting down the server
cleanup(function closeServer() {
  return new Promise(resolve => {
    httpServer.close(resolve)
  })
})
```
