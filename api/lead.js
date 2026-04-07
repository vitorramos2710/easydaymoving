const nodemailer = require('nodemailer');

function estimateRange(moveType, moveSize, packing, specialItems) {
  var moving = { studio:[350,550], '1-bedroom':[500,800], '2-bedroom':[750,1200], 'small-office':[600,1100] };
  var pack   = { studio:[150,300], '1-bedroom':[250,450], '2-bedroom':[400,650], 'small-office':[300,550] };
  var junk   = { studio:[80,200],  '1-bedroom':[200,400], '2-bedroom':[350,650], 'small-office':[250,500] };
  var small  = { studio:[200,400], '1-bedroom':[250,500], '2-bedroom':[350,600], 'small-office':[250,450] };

  var ranges = moveType === 'packing' ? pack : moveType === 'junk-removal' ? junk : moveType === 'small-move' ? small : moving;
  var sel = ranges[moveSize] || ranges['1-bedroom'] || [400,700];
  var min = sel[0], max = sel[1];

  if (moveType !== 'packing' && moveType !== 'junk-removal') {
    if (packing === 'partial') { min += 150; max += 300; }
    if (packing === 'full') { min += 300; max += 600; }
    if (Array.isArray(specialItems) && specialItems.length) { min += specialItems.length * 50; max += specialItems.length * 120; }
  }
  return '$' + min + '–$' + max;
}

function deriveTier(moveType, moveSize) {
  if (moveType === 'packing') return 'Packing Service';
  if (moveType === 'junk-removal') return moveSize === 'studio' ? 'Light Removal' : moveSize === '1-bedroom' ? 'Standard Removal' : 'Full Truck Cleanout';
  if (moveType === 'small-move') return 'Small Move';
  if (moveType === 'small-office') return 'Office Move';
  if (moveSize === 'studio') return 'Studio Move';
  if (moveSize === '1-bedroom') return 'One-Bedroom Move';
  return 'Two-Bedroom Move';
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  try {
    var b = req.body || {};
    var name = (b.name || '').trim();
    var phone = (b.phone || '').trim();
    var moveType = b.moveType || 'apartment';
    var fromAddress = (b.fromAddress || '').trim();
    var moveDate = b.moveDate || '';

    if (!name || !phone || !fromAddress || !moveDate) {
      return res.status(400).json({ ok: false, message: 'Please fill in name, phone, address, and date.' });
    }

    var moveSize = b.moveSize || 'studio';
    var packing = b.packing || 'none';
    var items = Array.isArray(b.specialItems) ? b.specialItems : [];

    var tier = deriveTier(moveType, moveSize);
    var range = estimateRange(moveType, moveSize, packing, items);

    // Email notification
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.NOTIFY_EMAIL) {
      try {
        var t = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT||587), secure: Number(process.env.SMTP_PORT)===465, auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS} });
        await t.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.NOTIFY_EMAIL,
          subject: '🌴 ' + name + ' — ' + tier + ' — ' + moveType,
          text: ['NEW LEAD','','Service: '+moveType,'Name: '+name,'Phone: '+phone,'Email: '+(b.email||'N/A'),'Size: '+moveSize,'From: '+fromAddress,'To: '+(b.toAddress||'N/A'),'Date: '+moveDate,'Access: '+((b.access||[]).join(', ')||'None'),'Items: '+(items.join(', ')||'None'),'Packing: '+packing,'Tier: '+tier,'Range: '+range].join('\n')
        });
      } catch(e) { console.error('Email error:', e.message); }
    }

    // Webhook
    if (process.env.LEAD_WEBHOOK_URL) {
      try { await fetch(process.env.LEAD_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(b) }); } catch(e) {}
    }

    return res.status(200).json({ ok: true, tier: tier, range: range, name: name, moveType: moveType });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: 'Server error. Please try again.' });
  }
};
