import cookieParser from 'cookie-parser';
import express from 'express';
import promBundle from 'express-prom-bundle';
import { HttpError } from 'http-errors';
import responseTime from 'response-time';

import useRouter from './routes/router';
import loadConfig from './config';
// import { logger } from './logger';
import { requestId } from './request-id';

export async function createApp() {
  const config = await loadConfig();

  const app: express.Express = express();

  app.set('config', config);

  const metricsMiddleware = promBundle({
    includeMethod: true,
    customLabels: {
      app: 'datapp_bff',
      version: '1.0.0',
    },
    includePath: true,
    promClient: {
      collectDefaultMetrics: {},
    },
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });

  // express middleware
  app.use(metricsMiddleware);
  // app.use(logger());
  app.use(requestId());
  app.use(responseTime());

  // Routes
  useRouter(app);

  // catch 404 and forward to error handler
  app.use(function (req, res) {
    // req.log.info('404');
    res.status(404).send('Not Found');
  });

  // error handler
  app.use(function (err: HttpError, req: express.Request, res: express.Response) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.status(500).json('error');
  });

  return app;
}
