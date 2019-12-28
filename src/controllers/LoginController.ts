import { Request, Response } from "express";
import { get, controller, validateBody, post } from "./decorators";

@controller("/auth")
class LoginController {
  @get("/login")
  getLogin(req: Request, res: Response): void {
    res.send(`
      <form method="POST">
        <div>
          <label>
            Email: 
            <input name="email" type="email"/>
          </label>
        </div>
        <div>
          <label>
            Password: 
            <input name="password" type="password"/>
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    `);
  }

  @post("/login")
  @validateBody("email", "password")
  postLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email) {
      res.status(422).send("Please provide email!");
    } else if (!password) {
      res.status(422).send("Please provide password!");
    } else if (email !== "test@test.com" || password !== "123456789") {
      res.status(401).send("Wrong credentials!");
    }
    req.session = { loggedIn: true };
    res.redirect("/");
  }

  @get("/logout")
  getLogout(req: Request, res: Response) {
    req.session = undefined;
    res.redirect("/");
  }
}
