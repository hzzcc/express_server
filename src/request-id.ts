import express from 'express';
import { v4 as uuid } from 'uuid';

export interface IRequestIdOptions {
  reqHeader?: string;
  resHeader?: string;
  paramName?: string;
  generator?: () => string;
}

const mergeOptions = (options?: IRequestIdOptions) => {
  options = options || {};
  return {
    reqHeader: options.reqHeader || 'request-id',
    resHeader: options.resHeader || 'x-request-id',
    paramName: options.paramName || 'requestId',
    generator: options.generator || uuid,
  };
};

export const requestId = (options?: IRequestIdOptions) => {
  const mergedOptions = mergeOptions(options);

  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const reqId =
      req[mergedOptions.paramName] ||
      req.get(mergedOptions.reqHeader) ||
      req.query[mergedOptions.paramName!] ||
      mergedOptions.generator?.();
    req[mergedOptions.paramName] = reqId;
    res.setHeader(mergedOptions.resHeader, reqId);
    next();
  };
};
