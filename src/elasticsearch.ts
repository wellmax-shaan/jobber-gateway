import { winstonLogger } from "@wellmax-shaan/jobber-shared";
import {config} from '../config'
import {Client} from '@elastic/elasticsearch'
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'apiGatewayLatest','debug')


class ElasticSearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_SEARCH_URL}`
    });
  }

  

  public async checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    log.info('GatewayService Connecting to ElasticSearch');
    try {
      const health: ClusterHealthResponse = await this.elasticSearchClient.cluster.health({});
      log.info(`GatewayService ElasticSearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to ElasticSearch failed, Retrying...');
      log.log('error', 'GatewayService checkCOnnection() method error:', error);
      await new Promise((resolve) => setTimeout(resolve, 10_000));
    }
  }
}
}

export const elasticSearch: ElasticSearch = new ElasticSearch();