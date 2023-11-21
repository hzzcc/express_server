import NodeConsul from 'consul';

import { LogApp } from '../log';

export class Consul {
  private config: Record<string, any> = {};
  private consul: NodeConsul.Consul;

  constructor(opt: NodeConsul.ConsulOptions) {
    const consul = new NodeConsul(opt);
    this.consul = consul;
  }

  public async loadConfig(key: string) {
    const consul = this.consul;
    const kvVals =
      (await consul.kv.get<{ Value: string; Key: string }[]>({ recurse: true, key })) || [];

    const config: Record<string, any> = {};
    kvVals.forEach(({ Value, Key }) => {
      const varKey = Key.split('/').pop();
      try {
        config[varKey] = JSON.parse(Value);
      } catch (e) {
        LogApp.error(`[Consul] ${varKey} 配置解析失败，解析值 ${Value}`);
      }
    });
    this.config = config;
  }

  public getValueByKey<T>(key: string, defaultValue: T) {
    const config = this.config || {};
    const val = config[key];
    if (val === undefined) {
      LogApp.warn(`[Consul] ${key} 未设置值，将使用默认值 ${defaultValue}`);
      return defaultValue;
    }
    return val as T;
  }
}
