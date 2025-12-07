# Contributing

This projet is open to everyone. Feel free to test the library, share it, improve it, and create merge requests.

### Getting started

The library requires [Node.js](https://nodejs.org/en) `22+` and [yarn](https://yarnpkg.com/).

First, we have to use the correct version of node:

```shell
nvm use
```

If you don't have [nvm](https://github.com/nvm-sh/nvm), you may manually install and use Node.js 22+.

Then, we have to use the proper package manager (here `yarn`):

```shell
corepack enable
```

Start a local verdaccio:

```shell
npx fabrique verdaccio
```

And install the dependencies:

```shell
yarn install
```

### Code

- The source code is located in the `src` directory.
- The projet uses [prettier](https://prettier.io/) to format the code. You'll want to enable and configure it in your IDE.
- The tests run with [vitest](https://vitest.dev)

### Commands

- `fb:build`: builds the library.
  - converts the typescript files into javascript files, copies the scss files, and assembles all the assets to create a package ready to be published.
  - some files are handled differently:
    - `*.protected.{ts,scss}` or `**/*.protected/**`: these files are exported under `package-name/protected`
      - this is indented to expose parts of the code that should be restricted to advanced users only, or shared to other libraries requiring _internal_ control.
    - `*.private.{ts,scss}` or `/*.private/**`: these files are **not** exported.
      - this is indented to consume parts of the code internally, and not expose them publicly.
- `fb:format`: formats the code using `prettier`.
- `fb:test`: runs the tests using `vitest`.
- `fb:test:coverage`: runs the tests with coverage.
  - by default, 100% code coverage is required, to enforce good quality.
- `fb:bench`: runs the bench tests.
- `fb:typedoc`: generates the documentation.
  - if the library exposes publicly only a few and/or simple parts, the documentation may be defined in the `README.md` instead.
- `fb:prod`: builds the lib in `prod` mode.
  - builds and publishes the lib on npm as a _prod_ version.
- `fb:dev`: builds the lib in `dev` mode.
  - builds and publishes the lib on a local `verdaccio` with a `dev` tag.
  - a local `verdaccio` is used to debug/test your library in another project:
    - it is better than `npm link`, as it enforce a specific version, and allows some dependencies to be `dev` too.
- `fb:rc`: builds the lib in `rc` mode.
  - builds and publishes the lib on npm with a `rc` tag.
  - to test before production and final release

### To create an MR

1. fork the repository
1. add the feature/fix by modifying the code in the `src/` directory
1. add/write some tests until 100% code coverage is reached (run the tests with `yarn fb:test:coverage`)
1. format the code, using the command `yarn fb:format`
1. commit and push your work following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention
1. create an MR from your repository to the upstream repository, explaining clearly what was added/fixed.

