# Cascade

Cascade is a framework for building agentic workflows. We aim to provide end-to-end tooling for building and running agentic workflows that can be deployed anywhere that can run Node.js, while also providing end-to-end type safety.

## Getting Started

### Installation

You can install Cascade from npm:

```bash
npm install @cascade-ai/core
# Or using pnpm
# pnpm add @cascade-ai/core
# Or using yarn
# yarn add @cascade-ai/core
# Or using bun
# bun add @cascade-ai/core
```

Cascade Core provides all the tools you need to build agentic workflows on your server.

You can then call agents and tools or start workflows by using the Client SDK. The client SDK is a type-safe wrapper around the core SDK that abstracts implementation details of the REST-ish API that the server exposes.

```bash
npm install @cascade-ai/client
# Or using pnpm
# pnpm add @cascade-ai/client
# Or using yarn
# yarn add @cascade-ai/client
# Or using bun
# bun add @cascade-ai/client
```

### Repository Structure

This repository is organized into several packages and apps:

- `packages/core`: The core package that contains the core logic to create agents and workflows, and run them on your server. This is what you'll import from.
- `packages/client`: The client package that contains the type-safe client SDK for Cascade.
- `apps/docs`: A Starlight/Astro project that hosts our documentation. Work in progress!

Moving forward, we plan to host the marketing and documentation website code in this same repository inside of the `apps/` directory. Currently, those are just the standard Turborepo boilerplates.

## Contributing

We welcome contributions to Cascade on an informal basis!
