const handleBooking = require('../../lib/booking');

exports.handler = async (event) => {
  if(event.httpMethod !== 'POST'){
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok:false, error:'Method not allowed' }),
    };
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}

  const { status, json } = await handleBooking(body);
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(json),
  };
};
