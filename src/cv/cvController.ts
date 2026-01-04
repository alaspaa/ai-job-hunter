import { NextFunction, Request, Response } from "express"
import fs from 'fs'
import path from 'path'
import { PDFParse } from "pdf-parse";
import { readFile } from "fs/promises";
import { parseArgs } from "util";

const getUploadsFilePath = (): string => {
    return path.join(process.cwd(), 'uploads', 'cvs')
}

const getCVPathByName = (name: string): string => {
    return path.join(getUploadsFilePath(), `cv_${name}.pdf`);
}

export function getCVs(req: Request, res: Response) {
    try {
        const uploadsDir = getUploadsFilePath();
        console.info(uploadsDir.toString())
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
    const name: string = req.params.name;

    const filePath = getCVPathByName(name)
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'CV not found' })
    }

    return res.download(filePath);
}

export async function createCV(req: Request & { file?: Express.Multer.File }, res: Response, next: NextFunction) {
    const name: string = req.params.id;
    const file = req.file;

    if(!name) {
        return res.status(400).json({error: 'No name provided for upload'})
    }
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

        const filePath = path.join(uploadsDir, `cv_${name}.pdf`);

        // Save buffer (we use memory storage in the router)
        fs.writeFileSync(filePath, file.buffer);

        return res.status(201).json({ message: 'CV uploaded', name, path: `/uploads/cvs/cv_${name}.pdf` });
    } catch (err) {
        next(err as Error)
    }
} 

export const getCVAsText = async (name: string): Promise<string> => {
    const pdf_path = getCVPathByName(name)
    if(!pdf_path) {
        throw Error(`Could not find pdf with the name ${name}`)
    }
    try {
    console.info(`path to cv ${pdf_path}`)
    const buffer = await readFile(pdf_path)
    console.info(buffer.length)
    const parser = new PDFParse({
        data: buffer
    })
    
    return (await parser.getText()).text
    } catch(error) {
        console.error("error extracting cv text", error)
        throw error
    }
    //return `This should be the cv text from ${pdf_path}`
}