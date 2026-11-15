import {
  winstonLogger,
  IErrorResponse,
  CustomError
} from '@wellmax-shaan/jobber-shared';
import 'dotenv/config'
import {
  Application,
  Request,
  Response,
  NextFunction,
  json,
  urlencoded
} from 'express';

import { Logger } from 'winston';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import cookieSession from 'cookie-session';
import { StatusCodes } from 'http-status-codes';
import http from 'http';
import {config} from './config'
import { elasticSearch } from '@gateway/elasticsearch';
import { appRoutes } from '@gateway/routes';

const SERVER_PORT = 4000;

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'apigatewayServer',
  'debug'
);

export class GatewayServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);

    app.use(
      cookieSession({
        name: 'sessions',
        keys: [config.SECRET_KEY_ONE as string, config.SECRET_KEY_ONE as string],
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV !== 'development',
        // sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax'
      })
    );

    app.use(hpp());
    app.use(helmet());

    app.use(
      cors({
        origin: config.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(json());
    app.use(urlencoded({ extended: true }));
  }

  private routesMiddleware(app:Application): void {
    appRoutes(app)
  }

  private startElasticSearch(): void {
    elasticSearch.checkConnection()
  }

  private errorHandler(app: Application): void {
    // 404 handler
    app.use((req: Request, res: Response): void => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

      log.error(`${fullUrl} endpoint does not exist.`);

      res.status(StatusCodes.NOT_FOUND).json({
        message: 'The endpoint called does not exist.'
      });
    });

    // Global error handler
    app.use(
      (
        error: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction
      ): void => {
        if (error instanceof CustomError) {
          log.error(`GatewayService ${error.comingFrom}:`, error);

          res.status(error.statusCode).json(error.serializeErrors());
          return;
        }

        next(error);
      }
    );
  }

  private startServer(app: Application): void {
    try {
      const httpServer: http.Server = new http.Server(app);

      this.startHttpServer(httpServer);

      log.info(
        `Gateway server has started with process id ${process.pid}`
      );
    } catch (error) {
      log.error('GatewayService startServer() error method:', error);
    }
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Gateway server running on port ${SERVER_PORT}`);
    });

    httpServer.on('error', (error: Error) => {
      log.error('GatewayService HTTP server error:', error);
    });
  }
}
