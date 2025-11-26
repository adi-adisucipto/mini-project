import * as fs from "fs/promises";
import { compile } from "handlebars";
import path from "path";
import { BASE_WEB_API } from "../configs/env.config";

export async function compileRegistrationTemplate(token:string) {
    const targetPath = path.join(__dirname, "../templates", "registration.hbs");
    const templateSrc = await fs.readFile(targetPath, "utf-8");
    const compiledTemplate = compile(templateSrc);

    return compiledTemplate({
        redirect_url: `${BASE_WEB_API}/auth/verify?token=${token}`
    });
}

export async function compileDetailPay(username:string, event_name:string, ticket:number, subtotal:number, total:number) {
    const targetPath = path.join(__dirname, "../templates", "detailPayment.hbs");
    const templateSrc = await fs.readFile(targetPath, "utf-8");
    const compiledTemplate = compile(templateSrc);

    return compiledTemplate({
        username: username,
        event_name: event_name,
        ticket: ticket,
        subtotal: subtotal,
        total
    });
}