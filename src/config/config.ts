import {
  COMMIT_HASH,
  COMMIT_TAG,
  CONSUL_SERVICE_GRAPHQL_DEBUG,
  CONSUL_SERVICE_LOG_CMD_LEVEL,
  CONSUL_SERVICE_LOG_FILE_ENABLE,
  CONSUL_SERVICE_LOG_FILE_LEVEL,
  CONSUL_SERVICE_LOG_SENTRY_DSN,
  CONSUL_SERVICE_LOG_SENTRY_ENABLE,
  CONSUL_SERVICE_LOG_SENTRY_LEVEL,
  // CONSUL_SERVICE_MDT_PRODUCT_AUTH_MAP,
  CONSUL_SERVICE_MOCK,
  CONSUL_SERVICE_NAME,
  CONSUL_SERVICE_PORT,
  DEFAULT_COMMIT_VALUE,
  DEFAULT_CONSUL_SERVICE_GRAPHQL_DEBUG,
  DEFAULT_CONSUL_SERVICE_LOG_CMD_LEVEL,
  DEFAULT_CONSUL_SERVICE_LOG_FILE_ENABLE,
  DEFAULT_CONSUL_SERVICE_LOG_FILE_LEVEL,
  DEFAULT_CONSUL_SERVICE_LOG_SENTRY_DSN,
  DEFAULT_CONSUL_SERVICE_LOG_SENTRY_ENABLE,
  DEFAULT_CONSUL_SERVICE_LOG_SENTRY_LEVEL,
  // DEFAULT_CONSUL_SERVICE_MDT_PRODUCT_AUTH_MAP,
  DEFAULT_CONSUL_SERVICE_MOCK,
  DEFAULT_CONSUL_SERVICE_PORT,
  DEFAULT_MDT_CONFIG_SERVER_FORCE,
  DEFAULT_SERVICE_LOG_SENTRY_ENV,
  SERVICE_GRAPHQL_DEBUG,
  SERVICE_LOG_CMD_LEVEL,
  SERVICE_LOG_FILE_ENABLE,
  SERVICE_LOG_FILE_LEVEL,
  SERVICE_LOG_SENTRY_DSN,
  SERVICE_LOG_SENTRY_ENABLE,
  SERVICE_LOG_SENTRY_ENV,
  SERVICE_LOG_SENTRY_LEVEL,
  // SERVICE_MDT_PRODUCT_AUTH_MAP,
  SERVICE_MOCK,
  SERVICE_PORT,
} from './constants';
import { Consul } from './consul';

const defaultConfig = () => {
  return {
    [COMMIT_TAG]: DEFAULT_COMMIT_VALUE,
    [COMMIT_HASH]: DEFAULT_COMMIT_VALUE,
    // 端口
    [SERVICE_PORT]: DEFAULT_CONSUL_SERVICE_PORT,
    // 是否启用Mocks
    [SERVICE_MOCK]: DEFAULT_CONSUL_SERVICE_MOCK,
    // 是否启用调试模式
    [SERVICE_GRAPHQL_DEBUG]: DEFAULT_CONSUL_SERVICE_GRAPHQL_DEBUG,
    // 命令行日志级别
    [SERVICE_LOG_CMD_LEVEL]: DEFAULT_CONSUL_SERVICE_LOG_CMD_LEVEL,
    // 是否启用文件日志
    [SERVICE_LOG_FILE_ENABLE]: DEFAULT_CONSUL_SERVICE_LOG_FILE_ENABLE,
    // 文件日志级别
    [SERVICE_LOG_FILE_LEVEL]: DEFAULT_CONSUL_SERVICE_LOG_FILE_LEVEL,
    // 是否启用Sentry
    [SERVICE_LOG_SENTRY_ENABLE]: DEFAULT_CONSUL_SERVICE_LOG_SENTRY_ENABLE,
    // Sentry日志级别
    [SERVICE_LOG_SENTRY_LEVEL]: DEFAULT_CONSUL_SERVICE_LOG_SENTRY_LEVEL,
    // Sentry的DSN
    [SERVICE_LOG_SENTRY_DSN]: DEFAULT_CONSUL_SERVICE_LOG_SENTRY_DSN,
    // Sentry的环境
    [SERVICE_LOG_SENTRY_ENV]: DEFAULT_SERVICE_LOG_SENTRY_ENV,
    // 产品权限映射
    // [SERVICE_MDT_PRODUCT_AUTH_MAP]: DEFAULT_CONSUL_SERVICE_MDT_PRODUCT_AUTH_MAP,
    // 依赖的api
  };
};

const initConsul = async (customVal: string) => {
  const [, csHost, csPort, csPrefix] =
    new RegExp('([^\\/]*)\\:(\\d+)\\/?(.*)', 'i').exec(customVal) || [];
  const [, dfHost, dfPort, dfPrefix] =
    new RegExp('([^\\/]*)\\:(\\d+)\\/?(.*)', 'i').exec(DEFAULT_MDT_CONFIG_SERVER_FORCE) || [];
  const consul = new Consul({ host: csHost || dfHost, port: csPort || dfPort, promisify: true });
  await consul.loadConfig(`${csPrefix || dfPrefix}/${CONSUL_SERVICE_NAME}`);
  return consul;
};

export default async () => {
  if (global.__JEST__) {
    return defaultConfig();
  }

  const consul = await initConsul(process.env.MDT_CONFIG_SERVER_FORCE || '');

  const commitTag = process.env.COMMIT_TAG || DEFAULT_COMMIT_VALUE;
  const commitHash = process.env.COMMIT_HASH || DEFAULT_COMMIT_VALUE;
  const serviceLogSentryEnv = process.env.SENTRY_ENVIRONMENT || DEFAULT_SERVICE_LOG_SENTRY_ENV;

  // 获取本服务的端口
  const servicePort = consul.getValueByKey<number>(
    CONSUL_SERVICE_PORT,
    DEFAULT_CONSUL_SERVICE_PORT,
  );

  const serviceMock = consul.getValueByKey<boolean>(
    CONSUL_SERVICE_MOCK,
    DEFAULT_CONSUL_SERVICE_MOCK,
  );

  const serviceGraphqlDebug = consul.getValueByKey<boolean>(
    CONSUL_SERVICE_GRAPHQL_DEBUG,
    DEFAULT_CONSUL_SERVICE_GRAPHQL_DEBUG,
  );

  const serviceLogCmdLevel = consul.getValueByKey<string>(
    CONSUL_SERVICE_LOG_CMD_LEVEL,
    DEFAULT_CONSUL_SERVICE_LOG_CMD_LEVEL,
  );

  const serviceLogFileEnable = consul.getValueByKey<boolean>(
    CONSUL_SERVICE_LOG_FILE_ENABLE,
    DEFAULT_CONSUL_SERVICE_LOG_FILE_ENABLE,
  );

  const serviceLogFileLevel = consul.getValueByKey<string>(
    CONSUL_SERVICE_LOG_FILE_LEVEL,
    DEFAULT_CONSUL_SERVICE_LOG_FILE_LEVEL,
  );

  const serviceLogSentryEnable = consul.getValueByKey<boolean>(
    CONSUL_SERVICE_LOG_SENTRY_ENABLE,
    DEFAULT_CONSUL_SERVICE_LOG_SENTRY_ENABLE,
  );

  const serviceLogSentryLevel = consul.getValueByKey<string>(
    CONSUL_SERVICE_LOG_SENTRY_LEVEL,
    DEFAULT_CONSUL_SERVICE_LOG_SENTRY_LEVEL,
  );

  const serviceLogSentryDsn = consul.getValueByKey<string>(
    CONSUL_SERVICE_LOG_SENTRY_DSN,
    DEFAULT_CONSUL_SERVICE_LOG_SENTRY_DSN,
  );

  // 获取产品权限映射
  // const mdtProductAuthMap = consul.getValueByKey<string>(
  //   CONSUL_SERVICE_MDT_PRODUCT_AUTH_MAP,
  //   DEFAULT_CONSUL_SERVICE_MDT_PRODUCT_AUTH_MAP,
  // );

  // 获取auth的url
  // const authUrl = consul.getValueByKey<string>(CONSUL_API_AUTH_URL, DEFAULT_CONSUL_API_AUTH_URL);

  return {
    [COMMIT_TAG]: commitTag,
    [COMMIT_HASH]: commitHash,
    // 端口
    [SERVICE_PORT]: servicePort,
    // 是否启用Mocks
    [SERVICE_MOCK]: serviceMock,
    // 是否启用调试模式
    [SERVICE_GRAPHQL_DEBUG]: serviceGraphqlDebug,
    // 命令行日志级别
    [SERVICE_LOG_CMD_LEVEL]: serviceLogCmdLevel,
    // 是否启用文件日志
    [SERVICE_LOG_FILE_ENABLE]: serviceLogFileEnable,
    // 文件日志级别
    [SERVICE_LOG_FILE_LEVEL]: serviceLogFileLevel,
    // 是否启用Sentry
    [SERVICE_LOG_SENTRY_ENABLE]: serviceLogSentryEnable,
    // Sentry日志级别
    [SERVICE_LOG_SENTRY_LEVEL]: serviceLogSentryLevel,
    // Sentry的DSN
    [SERVICE_LOG_SENTRY_DSN]: serviceLogSentryDsn,
    // Sentry的环境
    [SERVICE_LOG_SENTRY_ENV]: serviceLogSentryEnv,
    // 产品权限映射
    // [SERVICE_MDT_PRODUCT_AUTH_MAP]: mdtProductAuthMap,
    // 依赖的api
  };
};
