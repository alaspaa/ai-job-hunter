import { Request, Response, NextFunction} from "express";

export const schemaChecker = (req: Request, res: Response, next: NextFunction) => {
    // This middleware will contain logic to validate request schemas.

    if(req.method === 'GET') {
        console.log(`GET ${req.path}`)
        next()
    } else {
        console.log(`Method is ${req.method}, body should be verified here`)
        next()
    }
}