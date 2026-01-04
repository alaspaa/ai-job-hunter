import { Router, Request } from "express";
import multer from 'multer'
import { getCVs, getCVById, createCV } from './cvController'

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req: Request, file: any, cb: any) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'))
    }
    cb(null, true)
  }
})

const router = Router()

router.get('/', getCVs)

router.get('/:name', getCVById)

// Accepts a form field named `document` containing the PDF
router.post('/:name', upload.single('document'), createCV)

export default router