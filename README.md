# @onne/ui

React component library for Onne.

## Install

```bash
# .npmrc
@onne:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=<your-github-token>
```

```bash
npm install @onne/ui
```

The token needs the `read:packages` scope.

## Publish

```bash
npm run release
```

Requires a GitHub token with `write:packages` scope.

## Development

```bash
bun install
bun run dev     # storybook
bun run build   # build library
bun run test    # run tests
```
