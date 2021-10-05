import {Request, Response } from "express";
export const helloWorldController = (req: Request, res: Response, next: any) => {
    res.json({ data: "Hello World" });
}
