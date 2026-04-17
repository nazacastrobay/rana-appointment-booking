const AIRTABLE_BASE_ID = 'appHczu5h0qvrLoEX';
const AIRTABLE_TABLE_ID = 'tblNxlk5DM8tYFHZn';

const CATEGORY_LABEL = {
  living: 'Living Room',
  bedroom: 'Bedroom',
  dining: 'Dining',
  kitchen: 'Kitchen',
  mattress: 'Mattress',
  help: 'Help',
};
const OCCASION_LABEL = {
  redecor: 'Redecorating',
  moving: 'Moving',
  office: 'Office',
  unsure: 'Exploring',
};
const SLOT_LABEL = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};
const STORE_LABEL = {
  hialeah: 'Hialeah',
  palmetto: 'Palmetto',
  pembroke: 'Pembroke Lakes',
  calle8: 'Calle 8',
  kendall: 'Kendall',
  homestead: 'Homestead',
};

const isEmail = v => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test((v||'').trim());
const digits = v => (v||'').replace(/\D/g,'');
const isPhone = v => { const d = digits(v); return d.length === 10 || (d.length === 11 && d.startsWith('1')); };

module.exports = async (req, res) => {
  if(req.method !== 'POST'){
    res.status(405).json({ok:false, error:'Method not allowed'});
    return;
  }

  const token = process.env.AIRTABLE_TOKEN;
  if(!token){
    res.status(500).json({ok:false, error:'Server missing AIRTABLE_TOKEN'});
    return;
  }

  let body = req.body;
  if(typeof body === 'string'){ try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const firstName = (body.firstName || '').trim();
  const lastName  = (body.lastName  || '').trim();
  const phone     = (body.phone     || '').trim();
  const email     = (body.email     || '').trim();
  const storeId   = body.storeId;
  const date      = body.date;
  const slot      = body.slot;
  const category  = body.category;
  const occasion  = body.occasion;
  const zip       = (body.zip       || '').trim();
  const note      = (body.note      || '').trim();

  if(firstName.length < 2 || lastName.length < 2){
    res.status(400).json({ok:false, error:'Missing first or last name'});
    return;
  }
  if(!isPhone(phone)){ res.status(400).json({ok:false, error:'Invalid phone'}); return; }
  if(!isEmail(email)){ res.status(400).json({ok:false, error:'Invalid email'}); return; }
  if(!STORE_LABEL[storeId]){ res.status(400).json({ok:false, error:'Invalid store'}); return; }
  if(!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)){ res.status(400).json({ok:false, error:'Invalid date'}); return; }
  if(!SLOT_LABEL[slot]){ res.status(400).json({ok:false, error:'Invalid time slot'}); return; }

  const fields = {
    'First Name': firstName,
    'Last Name':  lastName,
    'Phone':      phone,
    'Email':      email,
    'Store':      STORE_LABEL[storeId],
    'Date':       date,
    'Time of Day':SLOT_LABEL[slot],
    'Looking For':CATEGORY_LABEL[category] || null,
    'Occasion':   OCCASION_LABEL[occasion] || null,
    'Zip Code':   zip || null,
    'Note':       note || null,
    'Status':     'New',
    'Submitted At': new Date().toISOString(),
  };
  Object.keys(fields).forEach(k => { if(fields[k] == null) delete fields[k]; });

  try {
    const r = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({ typecast: true, records: [{ fields }] }),
    });
    const data = await r.json();
    if(!r.ok){
      console.error('Airtable error:', data);
      res.status(502).json({ok:false, error:'Could not save booking', detail: data?.error || null});
      return;
    }
    res.status(200).json({ok:true, id: data.records?.[0]?.id});
  } catch (err) {
    console.error('Submit failed:', err);
    res.status(500).json({ok:false, error:'Server error'});
  }
};
