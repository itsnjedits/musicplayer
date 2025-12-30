const fs = require("fs");
const path = require("path");

const audioDir = path.join(__dirname, "audio");
const imageDir = path.join(__dirname, "images");

// get all images
const images = fs.readdirSync(imageDir);

images.forEach(imageName => {
  if (!imageName.includes("_thumbnail")) return;

  // base name without _thumbnail
  const baseName = imageName
    .replace("_thumbnail", "")
    .replace(path.extname(imageName), "");

  // find matching audio (any mp3)
  const audioFiles = fs.readdirSync(audioDir);

  const audioFile = audioFiles.find(file =>
    file.toLowerCase().includes(baseName.toLowerCase())
  );

  if (!audioFile) {
    console.log("❌ Audio not found for:", imageName);
    return;
  }

  const oldAudioPath = path.join(audioDir, audioFile);
  const newAudioPath = path.join(audioDir, `${baseName}.mp3`);

  fs.renameSync(oldAudioPath, newAudioPath);
  console.log("✅ Renamed:", audioFile, "→", `${baseName}.mp3`);
});

console.log("🎵 Audio rename process complete!");
