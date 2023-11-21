import express from 'express';
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  if (req.query.name === 'error') {
    throw new Error('error');
  }
  res.json('respond with a resource');
});

export default router;
