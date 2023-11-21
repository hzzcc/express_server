import express from 'express';

import indexRouter from './index';
import sendRouter from './send';
import userRouter from './users';
import verifyqiyeRouter from './verifyqiye';

const useRouter = async (app: express.Application) => {
  app.use('/', indexRouter);
  app.use('/users', userRouter);
  app.use('/send', sendRouter);
  app.use('/verifyqiye', verifyqiyeRouter);
};

export default useRouter;
