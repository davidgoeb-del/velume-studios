const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = '403158733d337079b717550d9a8449b3b2a8ab7c857d34687eb23894f4a71a4b';
const VOICE_ID = 'nzFihrBIvB34imQBuxub';

const tasks = [
  { file: 'audio/vocab/story_0_vocab_neighborhood.mp3', text: 'Every neighborhood has its own rhythm.' },
  { file: 'audio/vocab/story_0_vocab_rhythm.mp3', text: 'Every neighborhood has its own rhythm.' },
  { file: 'audio/vocab/story_0_vocab_gather.mp3', text: 'Families gather around the dinner table.' },
  { file: 'audio/vocab/story_0_vocab_connected.mp3', text: 'Feel a little more connected.' },
  { file: 'audio/vocab/story_0_vocab_confident.mp3', text: 'Feel a little more confident.' },
  { file: 'audio/vocab/story_0_vocab_at_home.mp3', text: 'Feel a little more at home in English.' },
  { file: 'audio/moments/story_welcome_moment.mp3', text: "There is no finish line here. Take your time. Read each story more than once. Listen to the audio, notice the expressions, and enjoy the small moments that make everyday life feel real. Learning English isn't about racing from one lesson to the next. It's about gradually becoming familiar with the language, the culture, and the people who speak it. We hope you'll settle in, enjoy the journey, and feel at home here in Lumora." }
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
