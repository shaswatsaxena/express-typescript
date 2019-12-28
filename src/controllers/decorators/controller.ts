import "reflect-metadata";
import { RequestHandler, NextFunction, Response, Request } from "express";
import { AppRouter } from "../../AppRouter";
import { Methods } from "./Methods";
import { MetadataKeys } from "./MetadataKeys";

function bodyValidator(keys: string): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(422).send("Invalid Request");
    }

    for (const key of keys) {
      if (!req.body[key]) {
        res.status(422).send(`Missing ${key} in request.`);
        return;
      }
    }
    next();
  };
}

export function controller(routePrefix: string) {
  return function(target: Function) {
    const router = AppRouter.getInstance();

    for (const key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path: string = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key
      );
      const method: Methods = Reflect.getMetadata(
        MetadataKeys.method,
        target.prototype,
        key
      );
      const middlewares: RequestHandler[] =
        Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) ||
        [];
      const requiredBodyProps =
        Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) ||
        [];
      const validator: RequestHandler = bodyValidator(requiredBodyProps);

      if (path) {
        router[method](
          routePrefix + path,
          ...middlewares,
          validator,
          routeHandler
        );
      }
    }
  };
}
