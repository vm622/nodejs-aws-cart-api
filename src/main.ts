import { NestFactory } from '@nestjs/core';
import { configure } from '@codegenie/serverless-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

let memoizedServer: any;

async function bootstrap() {
  if (!memoizedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    app.enableCors({
      origin: (req, callback) => callback(null, true),
    });
    app.use(helmet());

    await app.init();
    memoizedServer = configure({ app: expressApp });
  }
  return memoizedServer;
}

export const handler = async (event: any, context: any, callback: any) => {
  const server = await bootstrap();
  const result = await server(event, context, callback);
  return result;
};
