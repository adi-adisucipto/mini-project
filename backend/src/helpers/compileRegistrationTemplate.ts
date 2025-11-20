import * as fs from "fs/promises";
import { compile } from "handlebars";
import path from "path";
import { BASE_WEB_API } from "../configs/env.config";

export async function compileRegistrationTemplate(token:string) {
    const targetPath = path.join(__dirname, "../templates", "registration.hbs");
    const templateSrc = await fs.readFile(targetPath, "utf-8");
    const compiledTemplate = compile(templateSrc);

    return compiledTemplate({
        redirect_url: `http://localhost:3000/auth/verify?token=${token}`
    });
}