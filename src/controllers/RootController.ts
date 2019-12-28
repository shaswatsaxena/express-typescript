import { Request, Response, NextFunction } from "express";
import { get, use, controller } from "./decorators";

@controller("")
class RootController {
  @get("/")
  getHome(req: Request, res: Response): void {
    if (!req.session?.loggedIn) {
      res.send(`
      <div>
        <p>
          You aren't logged in.
        </p>
        <a href="/auth/login">Login</a>
      </div>
    `);
    } else {
      res.send(`
      <div>
        <p>
          You are logged in.
        </p>
        <a href="/auth/logout">Logout</a>
      </div>`);
    }
  }

  @get("/protected")
  @use(requireAuth)
  getProtected(req: Request, res: Response) {
    res.send(`
    <div>
      Protected Route
    </div>
  `);
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.loggedIn) {
    return res.status(403).send("Not Permitted");
  }
  next();
}
