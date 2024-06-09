# Untitled Note App

An open-source app for taking notes that feels awesome to use

![Demo video](app/assets/videos/demo.mp4)

## Self-hosting guide

Follow these instructions to run your own instance using Docker.

**[Self-hosting guide](https://untitlednote.xyz/docs/self-hosting)**

## Development

To run the app:

1. Install Docker
2. Copy `.env.example` to `.env` and configure the environment variables
3. `yarn install`
4. `docker compose up` (`--build` may be required if dependencies have been modified)
5. `docker compose exec web yarn build`
6. Go to http://localhost:3000/
7. Create an account with email address `user@example.com`
8. (If SMTP is disabled) Confirm your email address at http://localhost:3000/email_previews?to=user%40example.com

To run the tests:

```bash
# Backend tests
docker compose web rails test

# Frontend tests
yarn test

# Fix linter errors
yarn lint --fix

# Watch for TypeScript errors
yarn typecheck:watch

# Run Playwright tests
yarn playwright install # First time only
yarn e2e

# Debug a Playwright test
yarn e2e client/e2e/some-test.spec.ts:LINE_NUMBER --debug
yarn e2e client/e2e/some-test.spec.ts:LINE_NUMBER --debug --project chromium
```

## Contributing

Please open a discussion before starting work on a feature you intend to contribute back to this repo. Keep the following guidelines in mind:

- We try to keep the app very minimal, so not all features will be a good fit for inclusion.  
- All features must be usable with the keyboard, using a screen reader, and on a mobile device.
- Features involving generative machine learning models will not be considered.

Bug-fixing PRs are always welcome.

## Security

If you discover a security issue with the app, please contact me directly. All security research should be performed on a private instance.

## Enterprise support

Want help customising Untitled Note App for use in your organisation? Contact me to discuss a consultancy agreement.
