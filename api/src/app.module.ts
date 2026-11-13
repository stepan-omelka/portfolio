import { HttpStatus, Module, StandardSchemaValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { ApiErrorFilter } from "./api-error.filter.js";
import { ApiError } from "./api-error.js";
import { ContactModule } from "./contact/contact.module.js";
import { PortfolioModule } from "./portfolio/portfolio.module.js";

/** The API: everything under `/api`. */
@Module({
  imports: [
    // Locally the Resend key comes from the git-ignored .env.local; on Vercel from the environment.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env.local" }),
    PortfolioModule,
    ContactModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: ApiErrorFilter },
    {
      // Validates every parameter declared with a schema, e.g. `@Body({ schema })`.
      provide: APP_PIPE,
      useValue: new StandardSchemaValidationPipe({
        exceptionFactory: () => new ApiError("invalid", HttpStatus.BAD_REQUEST),
      }),
    },
  ],
})
export class AppModule {}
