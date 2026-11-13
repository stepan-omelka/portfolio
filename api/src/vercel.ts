import { AppModule } from "./app.module.js";
import { createApp } from "./create-app.js";

// Each cold start boots the app, and its startup lines would fill the function's logs.
const app = await createApp(AppModule, { logger: ["error", "warn"] });
// Vercel calls the handler itself instead of connecting to a port, so the app only initializes.
await app.init();

/** The Express app under Nest, which is a `(request, response)` handler. */
export default app.getHttpAdapter().getInstance();
