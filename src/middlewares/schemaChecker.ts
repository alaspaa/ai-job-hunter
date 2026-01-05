import { Request, Response, NextFunction} from "express";

export const schemaChecker = (req: Request, res: Response, next: NextFunction) => {
    console.log("Schema checker middleware invoked");

    // This middleware will contain logic to validate request schemas.

    next();
}