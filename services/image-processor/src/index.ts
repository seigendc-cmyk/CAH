import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());

// Ensure directories exist
const uploadDir = path.resolve(process.cwd(), '../../.data/assets/originals');
const processedDir = path.resolve(process.cwd(), '../../.data/assets/processed');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });

// Static serving for development
app.use('/assets/originals', express.static(uploadDir));
app.use('/assets/processed', express.static(processedDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or unsupported type' });
  }

  const originalPath = req.file.path;
  const filename = path.parse(req.file.filename).name;

  try {
    const metadata = await sharp(originalPath).metadata();
    
    const thumbnailPath = path.join(processedDir, `${filename}-thumb.webp`);
    const mobilePath = path.join(processedDir, `${filename}-mobile.webp`);
    const readerPath = path.join(processedDir, `${filename}-reader.webp`);

    // Create thumbnail
    await sharp(originalPath)
      .resize(150, 150, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(thumbnailPath);

    // Create mobile
    await sharp(originalPath)
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(mobilePath);

    // Create reader
    await sharp(originalPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(readerPath);

    res.json({
      success: true,
      originalUrl: `http://localhost:4000/assets/originals/${req.file.filename}`,
      thumbnailUrl: `http://localhost:4000/assets/processed/${filename}-thumb.webp`,
      mobileWebpUrl: `http://localhost:4000/assets/processed/${filename}-mobile.webp`,
      readerWebpUrl: `http://localhost:4000/assets/processed/${filename}-reader.webp`,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('Image processing failed:', error);
    res.status(500).json({ error: 'Image processing failed' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Image Processor service running on http://localhost:${PORT}`);
});
