
# Basic setup


+ Set up Electron React `Boilerplate using https://electron-react-boilerplate.js.org`
+ Set up Tailwind as per `https://electron-react-boilerplate.js.org/docs/styling`
+ Added shadcn-ui 
  + with `npx shadcn-ui add alert-dialog checkbox dialog label menubar radio-group select switch tooltip` 
  + to `app/src/renderer/components/ui...`


Having a strange typescript issue, or maybe its an eslint issue. no idea
I get a warning on every file that it cannot compile the typescript
but it does

https://stackoverflow.com/questions/59756485/react-typescript-vscode-an-import-path-cannot-end-with-a-tsx-extension

Resolve error: TSError: ⨯ Unable to compile TypeScript:
app/.erb/configs/webpack.config.renderer.dev.ts(12,26): error TS7016: Could not find a declaration file for module '../scripts/check-node-env'. '/Users/theron/Developer/CodeWorks/Rulie/app/.erb/scripts/check-node-env.js' implicitly has an 'any' type.

Added to issue here
https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/3423

