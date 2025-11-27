import { Request, Response, NextFunction } from "express";
import { listEOTransactions, updateEOTransactionStatus } from "../services/eoTransaction.service";
import { StatusPay } from "@prisma/client";

type Authed = Request & { user?: { user_id?: string; id?: string } };

export async function getEOTransactions(req: Authed, res: Response, next: NextFunction) {
  try {
    const organizerId = req.user?.user_id || req.user?.id;
    const status = req.query.status as StatusPay | undefined;
    const items = await listEOTransactions(organizerId!, status);
    res.json(items);
  } catch (err) { next(err); }
}

export async function acceptEOTransaction(req: Authed, res: Response, next: NextFunction) {
  try {
    const organizerId = req.user?.user_id || req.user?.id;
    const updated = await updateEOTransactionStatus(req.params.id, organizerId!, StatusPay.Done);
    res.json(updated);
  } catch (err) { next(err); }
}

export async function rejectEOTransaction(req: Authed, res: Response, next: NextFunction) {
  try {
    const organizerId = req.user?.user_id || req.user?.id;
    const updated = await updateEOTransactionStatus(req.params.id, organizerId!, StatusPay.Rejected);
    res.json(updated);
  } catch (err) { next(err); }
}
