const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 👉 তোমার Zoom SDK Key & Secret
const SDK_KEY = "RkocqUjSRhGLyDTbxwu0bQ";
const SDK_SECRET = "NcvS26RMrm4CGF6xxVUpX2SPSDcVBzhS";

app.post('/signature', (req, res) => {
  const meetingNumber = req.body.meetingNumber;
  const role = req.body.role;

  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(SDK_KEY + meetingNumber + timestamp + role).toString('base64');
  const hash = crypto.createHmac('sha256', SDK_SECRET).update(msg).digest('base64');
  const signature = Buffer.from(`${SDK_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');

  res.json({ signature: signature });
});

app.listen(4000, () => console.log('✅ Signature server running on http://localhost:4000'));
