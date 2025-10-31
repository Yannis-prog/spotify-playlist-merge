import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation: Required environment variables
  const requiredEnvVars = ['FRONTEND_URL', 'SESSION_SECRET', 'PORT'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  // Configuration CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  // Configuration des sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true, // Always HTTPS in production
        sameSite: 'lax',
      },
    }),
  );

  const port = parseInt(process.env.PORT as string, 10);
  await app.listen(port);
  console.log(`🚀 Backend running on port ${port}`);
  console.log(`✅ CORS enabled for: ${process.env.FRONTEND_URL}`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});
