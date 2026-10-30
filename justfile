default:
    @just --list

install:
    npm ci

dev:
    npm run dev

build:
    npm run build

start:
    npm run start

lint:
    npm run lint

format:
    npm run format

format-check:
    npm run format:check

typecheck:
    npx tsc --noEmit

# Everything CI checks before it builds.
check: lint format-check typecheck

fix:
    npm run format
    npm run lint:fix

clean:
    rm -rf .next tsconfig.tsbuildinfo

# Optimize everything under public/ and refresh the image manifest. See docs/media.md.
media:
    npm run media:optimize
