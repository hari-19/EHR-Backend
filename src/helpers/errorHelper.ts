import { Response } from 'express'


export function sendError(res: Response, status: number, error: string) {
    res.status(400).send({
        error
    })
}