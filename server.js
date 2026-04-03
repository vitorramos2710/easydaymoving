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
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
}

function saveLead(lead) {
  ensureDataFile();
  const current = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  current.unshift(lead);
  fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf8');
}

function buildMailer() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function notifyEmail(lead) {
  const transporter = buildMailer();
  if (!transporter || !process.env.NOTIFY_EMAIL) return;

  const lines = [
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || 'N/A'}`,
    `Move Type: ${lead.moveType}`,
    `Move Size: ${lead.moveSize}`,
    `From: ${lead.fromAddress}`,
    `To: ${lead.toAddress}`,
    `Move Date: ${lead.moveDate}`,
    `Access: ${lead.access.join(', ') || 'None'}`,
    `Special Items: ${lead.specialItems.join(', ') || 'None'}`,
    `Packing: ${lead.packing}`,
    `Preferred Contact: ${lead.contactPreference}`,
    `Tier: ${lead.tier}`,
    `Estimated Range: ${lead.range}`,
    `UTM Source: ${lead.utmSource || ''}`,
    `UTM Campaign: ${lead.utmCampaign || ''}`,
    `UTM Medium: ${lead.utmMedium || ''}`,
    `UTM Content: ${lead.utmContent || ''}`,
    `UTM Term: ${lead.utmTerm || ''}`,
    `GCLID: ${lead.gclid || ''}`,
    `Referrer: ${lead.referrer || ''}`,
    `Landing Page: ${lead.landingPage || ''}`,
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
  } catch (error) {
    console.error('Webhook error:', error.message);
  }
}

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

  if (packing === 'partial') {
    min += 150;
    max += 300;
  }

  if (packing === 'full') {
    min += 300;
    max += 800;
  }

  if (Array.isArray(specialItems) && specialItems.length > 0) {
    min += 100;
    max += 400;
  }

  return `$${min}–$${max}`;
}

function deriveTier(moveSize) {
  if (moveSize === 'studio' || moveSize === '1-bedroom') return 'Small Move';
  if (moveSize === '2-bedroom' || moveSize === 'small-office') return 'Standard Move';
  return 'Large Move';
}

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/lead', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      moveType,
      moveSize,
      fromAddress,
      toAddress,
      moveDate,
      access,
      specialItems,
      packing,
      contactPreference,
      utmSource,
      utmCampaign,
      utmMedium,
      utmContent,
      utmTerm,
      gclid,
      referrer,
      landingPage
    } = req.body;

    if (!name || !phone || !moveType || !moveSize || !fromAddress || !toAddress || !moveDate) {
      return res.status(400).json({ ok: false, message: 'Missing required fields.' });
    }

    const lead = {
      name,
      phone,
      email,
      moveType,
      moveSize,
      fromAddress,
      toAddress,
      moveDate,
      access: Array.isArray(access) ? access : [],
      specialItems: Array.isArray(specialItems) ? specialItems : [],
      packing,
      contactPreference,
      tier: deriveTier(moveSize),
      range: estimateRange(moveSize, packing, specialItems),
      utmSource,
      utmCampaign,
      utmMedium,
      utmContent,
      utmTerm,
      gclid,
      referrer,
      landingPage,
      createdAt: new Date().toISOString()
    };

    saveLead(lead);
    await notifyEmail(lead);
    await notifyWebhook(lead);

    return res.json({
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
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Easy Day Moving running on http://localhost:${PORT}`);
});
