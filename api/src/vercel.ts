import { AppModule } from "./app.module.js";
import { createApp } from "./create-app.js";

const app = await createApp(AppModule);
// Vercel calls the handler itself instead of connecting to a port, so the app only initializes.
await app.init();

/** The Express app under Nest, which is a `(request, response)` handler. */
export default app.getHttpAdapter().getInstance();
