const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'leads.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function saveLead(lead) {
  ensureDataFile();
  const current = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  current.unshift(lead);
  fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf8');
}

function buildMailer() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

function estimateRange(moveType, moveSize, packing, specialItems) {
  const movingRanges = {
    studio: [450, 650], '1-bedroom': [600, 900], '2-bedroom': [900, 1350],
    '3-bedroom': [1300, 2000], '4-bedroom+': [1800, 3200], 'small-office': [800, 1800]
  };
  const packingRanges = {
    studio: [200, 350], '1-bedroom': [300, 500], '2-bedroom': [450, 750],
    '3-bedroom': [650, 1000], '4-bedroom+': [900, 1500], 'small-office': [400, 800]
  };
  const junkRanges = {
    studio: [100, 250], '1-bedroom': [250, 450], '2-bedroom': [400, 700],
    '3-bedroom': [650, 1200], '4-bedroom+': [650, 1200], 'small-office': [300, 600]
  };
  const smallMoveRanges = {
    studio: [250, 450], '1-bedroom': [300, 550], '2-bedroom': [400, 650],
    '3-bedroom': [400, 650], '4-bedroom+': [400, 650], 'small-office': [300, 500]
  };

  let ranges;
  if (moveType === 'packing') ranges = packingRanges;
  else if (moveType === 'junk-removal') ranges = junkRanges;
  else if (moveType === 'small-move') ranges = smallMoveRanges;
  else ranges = movingRanges;

  const selected = ranges[moveSize] || ranges['1-bedroom'] || [500, 900];
  let [min, max] = selected;

  if (moveType !== 'packing' && moveType !== 'junk-removal') {
    if (packing === 'partial') { min += 200; max += 400; }
    if (packing === 'full') { min += 400; max += 900; }
  }
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
  if (moveSize === 'studio' || moveSize === '1-bedroom') return 'Small Move';
  if (moveSize === '2-bedroom' || moveSize === 'small-office') return 'Standard Move';
  return 'Large Move';
}

async function notifyEmail(lead) {
  const transporter = buildMailer();
  if (!transporter || !process.env.NOTIFY_EMAIL) return;

  const lines = [
    `🌴 NEW EASY DAY MOVING LEAD`,
    ``, `Service: ${lead.moveType}`, `Name: ${lead.name}`, `Phone: ${lead.phone}`,
    `Email: ${lead.email || 'N/A'}`, `Size: ${lead.moveSize}`,
    `From: ${lead.fromAddress}`, `To: ${lead.toAddress || 'N/A'}`,
    `Date: ${lead.moveDate}`, `Access: ${lead.access.join(', ') || 'None'}`,
    `Special Items: ${lead.specialItems.join(', ') || 'None'}`,
    `Packing: ${lead.packing}`, `Contact: ${lead.contactPreference}`,
    ``, `Tier: ${lead.tier}`, `Range: ${lead.range}`, `Created: ${lead.createdAt}`
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
  } catch (e) { console.error('Webhook error:', e.message); }
}

app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/lead', async (req, res) => {
  try {
    const { name, phone, email, moveType, moveSize, fromAddress, toAddress,
      moveDate, access, specialItems, packing, contactPreference,
      utmSource, utmCampaign, utmMedium, utmContent, utmTerm,
      gclid, referrer, landingPage } = req.body;

    if (!name || !phone || !moveType || !fromAddress || !moveDate) {
      return res.status(400).json({ ok: false, message: 'Missing required fields.' });
    }

    const size = moveSize || 'studio';
    const lead = {
      name, phone, email, moveType, moveSize: size, fromAddress,
      toAddress: toAddress || 'N/A', moveDate,
      access: Array.isArray(access) ? access : [],
      specialItems: Array.isArray(specialItems) ? specialItems : [],
      packing: packing || 'none', contactPreference,
      tier: deriveTier(moveType, size),
      range: estimateRange(moveType, size, packing, specialItems),
      utmSource, utmCampaign, utmMedium, utmContent, utmTerm,
      gclid, referrer, landingPage,
      createdAt: new Date().toISOString()
    };

    saveLead(lead);
    await notifyEmail(lead);
    await notifyWebhook(lead);

    return res.json({
      ok: true, tier: lead.tier, range: lead.range,
      name: lead.name, moveType: lead.moveType, message: 'Lead received.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: 'Server error.' });
  }
});

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`Easy Day Moving running on http://localhost:${PORT}`));
