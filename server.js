const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, 'leads.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function estimateRange(moveType, moveSize, packing, specialItems) {
  var moving = { studio:[350,550], '1-bedroom':[500,800], '2-bedroom':[750,1200], 'small-office':[600,1100] };
  var pack   = { studio:[150,300], '1-bedroom':[250,450], '2-bedroom':[400,650], 'small-office':[300,550] };
  var junk   = { studio:[80,200],  '1-bedroom':[200,400], '2-bedroom':[350,650], 'small-office':[250,500] };
  var small  = { studio:[200,400], '1-bedroom':[250,500], '2-bedroom':[350,600], 'small-office':[250,450] };
  var ranges = moveType==='packing'?pack:moveType==='junk-removal'?junk:moveType==='small-move'?small:moving;
  var sel = ranges[moveSize]||ranges['1-bedroom']||[400,700];
  var min=sel[0], max=sel[1];
  if (moveType!=='packing'&&moveType!=='junk-removal') {
    if (packing==='partial'){min+=150;max+=300;}
    if (packing==='full'){min+=300;max+=600;}
    if (Array.isArray(specialItems)&&specialItems.length){min+=specialItems.length*50;max+=specialItems.length*120;}
  }
  return '$'+min+'–$'+max;
}

function deriveTier(moveType, moveSize) {
  if (moveType==='packing') return 'Packing Service';
  if (moveType==='junk-removal') return moveSize==='studio'?'Light Removal':moveSize==='1-bedroom'?'Standard Removal':'Full Truck Cleanout';
  if (moveType==='small-move') return 'Small Move';
  if (moveType==='small-office') return 'Office Move';
  if (moveSize==='studio') return 'Studio Move';
  if (moveSize==='1-bedroom') return 'One-Bedroom Move';
  return 'Two-Bedroom Move';
}

app.post('/api/lead', (req, res) => {
  try {
    var b = req.body || {};
    var name=(b.name||'').trim(), phone=(b.phone||'').trim(), moveType=b.moveType||'apartment', fromAddress=(b.fromAddress||'').trim(), moveDate=b.moveDate||'';
    if (!name||!phone||!fromAddress||!moveDate) return res.status(400).json({ok:false,message:'Please fill in name, phone, address, and date.'});
    var moveSize=b.moveSize||'studio', packing=b.packing||'none', items=Array.isArray(b.specialItems)?b.specialItems:[];
    var tier=deriveTier(moveType,moveSize), range=estimateRange(moveType,moveSize,packing,items);
    var lead = { ...b, tier, range, createdAt: new Date().toISOString() };
    if (!fs.existsSync(DATA)) fs.writeFileSync(DATA,'[]');
    var all = JSON.parse(fs.readFileSync(DATA,'utf8'));
    all.unshift(lead);
    fs.writeFileSync(DATA, JSON.stringify(all,null,2));
    res.json({ ok:true, tier, range, name, moveType });
  } catch(e) { console.error(e); res.status(500).json({ok:false,message:'Server error.'}); }
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT, () => console.log('http://localhost:'+PORT));
