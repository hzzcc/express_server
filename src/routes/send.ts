import express from 'express';

import { corpid, corpsecret } from '../config/constants';
import request from '../util/request';
const router = express.Router();

/* send message */
router.get('/', async function (req, res) {
  const accessTokenRes = await request.get('/gettoken', {
    params: {
      corpid: corpid,
      corpsecret: corpsecret,
    },
  });
  console.log(accessTokenRes.data);
  const accessToken = accessTokenRes.data.access_token;
  const userListRes = await request.get('/user/list_id', {
    params: {
      access_token: accessToken,
    },
  });
  console.log(userListRes.data);

  res.json(userListRes.data);
});

export default router;
