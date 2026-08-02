const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = '403158733d337079b717550d9a8449b3b2a8ab7c857d34687eb23894f4a71a4b';
const VOICE_ID = 'nzFihrBIvB34imQBuxub';

const tasks = [
  { file: 'audio/expressions/story_welcome_expression_has_its_own_rhythm.m4a', text: 'has its own rhythm' },
  { file: 'audio/expressions/story_welcome_expression_anguage_lives_in_these_moments.m4a', text: 'Language lives in these moments.' },
  { file: 'audio/expressions/story_welcome_expression_slow_down.m4a', text: 'slow down' },
  { file: 'audio/expressions/story_welcome_expression_take_your_time.m4a', text: 'take your time' },
  { file: 'audio/expressions/story_welcome_expression_elcome_to_the_neighborhood.m4a', text: 'Welcome to the neighborhood.' },
  { file: 'audio/expressions/story_welcome_expression_feel_at_home.m4a', text: 'feel at home' }
];

async function generateAudio() {
  for (const task of tasks) {
    const filePath = path.join(__dirname, 'www/american-life-moments', task.file);
    const destDir = path.dirname(filePath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    console.log(`Generating ${task.file}...`);
    
    const payload = JSON.stringify({
      text: task.text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    let success = false;
    await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
            console.log(`Failed with status ${res.statusCode}`);
            res.on('data', d => console.log(d.toString()));
            return resolve();
        }
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          success = true;
          resolve();
        });
      });
      req.on('error', (e) => reject(e));
      req.write(payload);
      req.end();
    });
    
    if (success) {
      // Also copy to american-life-moments
      const srcPath = path.join(__dirname, 'american-life-moments', task.file);
      const srcDir = path.dirname(srcPath);
      if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
      fs.copyFileSync(filePath, srcPath);
    }
  }
  console.log("All audio generated.");
}

generateAudio();
