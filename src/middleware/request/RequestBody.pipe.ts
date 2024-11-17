import { Request, Response } from "express";

function RequestBodyMiddleware(req: Request, res: Response, next: Function) {
  // bot user key
  const botUserKey = req.body?.userRequest?.user?.id;
  req.body = { ...req.body, botUserKey: botUserKey };

  // action params
  const actionParams = req.body?.action?.params;
  req.body = { ...req.body, params: actionParams };

  // action extra params
  const actionExtraParams = req.body?.action?.clientExtra;
  req.body = { ...req.body, extraParams: actionExtraParams };

  return next();
}

export default RequestBodyMiddleware;
