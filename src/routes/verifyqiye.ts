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

  const accessToken = accessTokenRes.data.access_token;
  console.log('accessToken', accessToken);
  const echostr = req.query.echostr;

  console.log('echostr', req.body, req.query, req.params);

  res.json(echostr);
});

export default router;
