const nodemailer = require('nodemailer');

function estimateRange(moveSize, packing, specialItems) {
  const baseRanges = {
    studio: [449, 599],
    '1-bedroom': [599, 849],
    '2-bedroom': [899, 1250],
    '3-bedroom': [1300, 1900],
    '4-bedroom+': [1800, 2800],
    'small-office': [700, 1600]
  };

  const selected = baseRanges[moveSize] || [599, 999];
  let [min, max] = selected;

  if (packing === 'partial') { min += 150; max += 300; }
  if (packing === 'full') { min += 300; max += 800; }
  if (Array.isArray(specialItems) && specialItems.length > 0) { min += 100; max += 400; }

  return `$${min}–$${max}`;
}

function deriveTier(moveSize) {
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
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || 'N/A'}`,
    `Move Type: ${lead.moveType}`,
    `Move Size: ${lead.moveSize}`,
    `From: ${lead.fromAddress}`,
    `To: ${lead.toAddress}`,
    `Move Date: ${lead.moveDate}`,
    `Access: ${(lead.access || []).join(', ') || 'None'}`,
    `Special Items: ${(lead.specialItems || []).join(', ') || 'None'}`,
    `Packing: ${lead.packing}`,
    `Preferred Contact: ${lead.contactPreference}`,
    `Tier: ${lead.tier}`,
    `Estimated Range: ${lead.range}`,
    `UTM Source: ${lead.utmSource || ''}`,
    `UTM Campaign: ${lead.utmCampaign || ''}`,
    `UTM Medium: ${lead.utmMedium || ''}`,
    `Created At: ${lead.createdAt}`
  ];

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL,
    subject: `New Easy Day Moving Lead — ${lead.name} (${lead.tier})`,
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
  // CORS
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

    if (!name || !phone || !moveType || !moveSize || !fromAddress || !toAddress || !moveDate) {
      return res.status(400).json({ ok: false, message: 'Missing required fields.' });
    }

    const lead = {
      name, phone, email, moveType, moveSize, fromAddress, toAddress, moveDate,
      access: Array.isArray(access) ? access : [],
      specialItems: Array.isArray(specialItems) ? specialItems : [],
      packing, contactPreference,
      tier: deriveTier(moveSize),
      range: estimateRange(moveSize, packing, specialItems),
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
      message: 'Lead received successfully.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: 'Server error.' });
  }
};
