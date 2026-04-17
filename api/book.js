const handleBooking = require('../lib/booking');

module.exports = async (req, res) => {
  if(req.method !== 'POST'){
    res.status(405).json({ok:false, error:'Method not allowed'});
    return;
  }

  let body = req.body;
  if(typeof body === 'string'){ try { body = JSON.parse(body); } catch { body = {}; } }

  const { status, json } = await handleBooking(body || {});
  res.status(status).json(json);
};
