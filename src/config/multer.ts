import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'application/pdf',
    'application/octet-stream',
    'binary/octet-stream',
    'application/x-pdf',
  ];

  const isAllowed = allowedMimes.includes(file.mimetype) ||
    file.originalname.toLowerCase().endsWith('.pdf');

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;