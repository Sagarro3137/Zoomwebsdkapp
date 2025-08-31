const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// তোমার Zoom SDK Key & Secret
const SDK_KEY = "RkocqUjSRhGLyDTbxwu0bQ";      // Client ID
const SDK_SECRET = "NcvS26RMrm4CGF6xxvUpX2SPSDcVBzhS";  // Client Secret

function generateSignature(sdkKey, sdkSecret, meetingNumber, role) {
  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(sdkKey + meetingNumber + timestamp + role).toString('base64');
  const hash = crypto.createHmac('sha256', sdkSecret).update(msg).digest('base64');
  const signature = Buffer.from(`${sdkKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
  return signature;
}

app.post('/signature', (req, res) => {
  const meetingNumber = req.body.meetingNumber;
  const role = req.body.role;

  if (!meetingNumber || role === undefined) {
    return res.status(400).json({ error: "meetingNumber & role required" });
  }

  const signature = generateSignature(SDK_KEY, SDK_SECRET, meetingNumber, role);
  res.json({ signature });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Signature server running on http://localhost:${PORT}`));
