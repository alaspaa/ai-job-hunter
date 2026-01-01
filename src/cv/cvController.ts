import { NextFunction, Request, Response } from "express"
import fs from 'fs'
import path from 'path'

export function getCVs(req: Request, res: Response) {
    try {
        const uploadsDir = path.join(process.cwd(), 'uploads', 'cvs');
        if (!fs.existsSync(uploadsDir)) {
            return res.json([]);
        }

        const files = fs.readdirSync(uploadsDir);
        const items = files.map(file => {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            const match = file.match(/^cv_(.+)\.pdf$/i);
            const id = match ? match[1] : null;
            const url = id ? `/api/cv/${id}` : `/uploads/cvs/${file}`;
            return {
                id,
                filename: file,
                url,
                size: stats.size,
                modifiedAt: stats.mtime.toISOString()
            }
        });

        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to read uploads', detail: (err as Error).message });
    }
}

export function getCVById(req: Request, res: Response) {
    const id: string = req.params.id;

    const filePath = path.join(process.cwd(), 'uploads', 'cvs', `cv_${id}.pdf`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'CV not found' })
    }

    return res.download(filePath);
}

export async function createCV(req: Request & { file?: Express.Multer.File }, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded. Please attach a PDF using the field `document`.' })
    }

    // Basic MIME type check + filename fallback
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
        return res.status(400).json({ error: 'Only PDF files are accepted.' })
    }

    try {
        const uploadsDir = path.join(process.cwd(), 'uploads', 'cvs');
        fs.mkdirSync(uploadsDir, { recursive: true });

        const filePath = path.join(uploadsDir, `cv_${id}.pdf`);

        // Save buffer (we use memory storage in the router)
        fs.writeFileSync(filePath, file.buffer);

        return res.status(201).json({ message: 'CV uploaded', id, path: `/uploads/cvs/cv_${id}.pdf` });
    } catch (err) {
        next(err as Error)
    }
} 