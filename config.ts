import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public ENABLE_APM: string;
  public GATEWAY_JWT_TOKEN: string;
  public JWT_TOKEN: string;
  public NODE_ENV: string;
  public SECRET_KEY_ONE: string;
  public SECRET_KEY_TWO: string;
  public CLIENT_URL: string;
  public AUTH_BASE_URL: string;
  public USERS_BASE_URL: string;
  public GIG_BASE_URL: string;
  public MESSAGE_BASE_URL: string;
  public ORDER_BASE_URL: string;
  public REVIEW_BASE_URL: string;
  public REDIS_HOST: string;
  public ELASTIC_SEARCH_URL: string;
  public ELASTIC_APM_SERVER_URL: string;
  public ELASTIC_APM_SECRET_TOKEN: string;

  constructor() {
    this.ENABLE_APM = process.env.ENABLE_APM || '0';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
    this.AUTH_BASE_URL = process.env.AUTH_BASE_URL || 'http://localhost:4002';
    this.USERS_BASE_URL = process.env.USERS_BASE_URL || 'http://localhost:4003';
    this.GIG_BASE_URL = process.env.GIG_BASE_URL || 'http://localhost:4004';
    this.MESSAGE_BASE_URL = process.env.MESSAGE_BASE_URL || 'http://localhost:4005';
    this.ORDER_BASE_URL = process.env.ORDER_BASE_URL || 'http://localhost:4006';
    this.REVIEW_BASE_URL = process.env.REVIEW_BASE_URL || 'http://localhost:4007';
    this.REDIS_HOST = process.env.REDIS_HOST || 'redis://localhost:6379';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || 'http://localhost:9200';
    this.ELASTIC_APM_SERVER_URL = process.env.ELASTIC_APM_SERVER_URL || 'http://localhost:8200';
    this.ELASTIC_APM_SECRET_TOKEN = process.env.ELASTIC_APM_SECRET_TOKEN || '';
  }
}

export const config: Config = new Config();