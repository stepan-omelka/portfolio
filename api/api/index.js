// The Vercel Function: Vercel turns each file in api/ into one, and vercel.json rewrites every
// /api/* request to this one. `npm run build:site` compiles the Nest app into dist/ first.
export { default } from "../dist/vercel.js";
