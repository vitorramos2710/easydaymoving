const nodemailer = require('nodemailer');

/* ═══ PRICING BY SERVICE TYPE ═══ */

function estimateRange(moveType, moveSize, packing, specialItems) {
  // ── Moving (apartment / house) ──
  const movingRanges = {
    studio:      [450, 650],
    '1-bedroom': [600, 900],
    '2-bedroom': [900, 1350],
    '3-bedroom': [1300, 2000],
    '4-bedroom+': [1800, 3200],
    'small-office': [800, 1800]
  };

  // ── Packing only ──
  const packingRanges = {
    studio:      [200, 350],
    '1-bedroom': [300, 500],
    '2-bedroom': [450, 750],
    '3-bedroom': [650, 1000],
    '4-bedroom+': [900, 1500],
    'small-office': [400, 800]
  };

  // ── Junk removal (size maps to amount) ──
  const junkRanges = {
    studio:      [100, 250],    // 1-2 items
    '1-bedroom': [250, 450],    // pickup truck load
    '2-bedroom': [400, 700],    // full truck load
    '3-bedroom': [650, 1200],   // multiple loads
    '4-bedroom+': [650, 1200],
    'small-office': [300, 600]
  };

  // ── Small move ──
  const smallMoveRanges = {
    studio:      [250, 450],
    '1-bedroom': [300, 550],
    '2-bedroom': [400, 650],
    '3-bedroom': [400, 650],
    '4-bedroom+': [400, 650],
    'small-office': [300, 500]
  };

  // Pick the right pricing table
  let ranges;
  if (moveType === 'packing') {
    ranges = packingRanges;
  } else if (moveType === 'junk-removal') {
    ranges = junkRanges;
  } else if (moveType === 'small-move') {
    ranges = smallMoveRanges;
  } else {
    ranges = movingRanges;
  }

  const selected = ranges[moveSize] || ranges['1-bedroom'] || [500, 900];
  let [min, max] = selected;

  // Packing add-on (only for move types, not packing-only)
  if (moveType !== 'packing' && moveType !== 'junk-removal') {
    if (packing === 'partial') { min += 200; max += 400; }
    if (packing === 'full') { min += 400; max += 900; }
  }

  // Special items surcharge (moves only)
  if (moveType !== 'packing' && moveType !== 'junk-removal') {
    if (Array.isArray(specialItems) && specialItems.length > 0) {
      min += specialItems.length * 75;
      max += specialItems.length * 150;
    }
  }

  return `$${min.toLocaleString()}–$${max.toLocaleString()}`;
}

function deriveTier(moveType, moveSize) {
  if (moveType === 'packing') return 'Packing Service';
  if (moveType === 'junk-removal') {
    if (moveSize === 'studio') return 'Light Removal';
    if (moveSize === '1-bedroom') return 'Standard Removal';
    return 'Full Cleanout';
  }
  if (moveType === 'small-move') return 'Small Move';
  if (moveType === 'small-office') return 'Office Move';

  // Regular moves
  if (moveSize === 'studio' || moveSize === '1-bedroom') return 'Small Move';
  if (moveSize === '2-bedroom' || moveSize === 'small-office') return 'Standard Move';
  return 'Large Move';
}

async function notifyEmail(lead) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.NOTIFY_EMAIL) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  const lines = [
    `🌴 NEW EASY DAY MOVING LEAD`,
    ``,
    `Service: ${lead.moveType}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || 'N/A'}`,
    `Move Size: ${lead.moveSize}`,
    `From: ${lead.fromAddress}`,
    `To: ${lead.toAddress || 'N/A'}`,
    `Date: ${lead.moveDate}`,
    `Access: ${(lead.access || []).join(', ') || 'None'}`,
    `Special Items: ${(lead.specialItems || []).join(', ') || 'None'}`,
    `Packing: ${lead.packing}`,
    `Contact Pref: ${lead.contactPreference}`,
    ``,
    `Tier: ${lead.tier}`,
    `Estimated Range: ${lead.range}`,
    ``,
    `UTM Source: ${lead.utmSource || ''}`,
    `UTM Campaign: ${lead.utmCampaign || ''}`,
    `UTM Medium: ${lead.utmMedium || ''}`,
    `Created: ${lead.createdAt}`
  ];

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL,
    subject: `🌴 New Lead — ${lead.name} (${lead.tier}) — ${lead.moveType}`,
    text: lines.join('\n')
  });
}

async function notifyWebhook(lead) {
  if (!process.env.LEAD_WEBHOOK_URL) return;
  try {
    await fetch(process.env.LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
  } catch (e) {
    console.error('Webhook error:', e.message);
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  try {
    const {
      name, phone, email, moveType, moveSize, fromAddress, toAddress,
      moveDate, access, specialItems, packing, contactPreference,
      utmSource, utmCampaign, utmMedium, utmContent, utmTerm,
      gclid, referrer, landingPage
    } = req.body;

    if (!name || !phone || !moveType || !fromAddress || !moveDate) {
      return res.status(400).json({ ok: false, message: 'Missing required fields.' });
    }

    const lead = {
      name, phone, email,
      moveType,
      moveSize: moveSize || 'studio',
      fromAddress,
      toAddress: toAddress || 'N/A',
      moveDate,
      access: Array.isArray(access) ? access : [],
      specialItems: Array.isArray(specialItems) ? specialItems : [],
      packing: packing || 'none',
      contactPreference,
      tier: deriveTier(moveType, moveSize || 'studio'),
      range: estimateRange(moveType, moveSize || 'studio', packing, specialItems),
      utmSource, utmCampaign, utmMedium, utmContent, utmTerm,
      gclid, referrer, landingPage,
      createdAt: new Date().toISOString()
    };

    await Promise.all([
      notifyEmail(lead),
      notifyWebhook(lead)
    ]);

    return res.status(200).json({
      ok: true,
      tier: lead.tier,
      range: lead.range,
      name: lead.name,
      moveType: lead.moveType,
      message: 'Lead received.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: 'Server error.' });
  }
};
