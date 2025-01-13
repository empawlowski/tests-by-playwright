import * as dotenv from "dotenv";

dotenv.config({ override: true });

export class Configuration {
  public static get mailSlurpApiKey(): string {
    return process.env["MAILSLURP_API_KEY"] ?? "[NOT SET]";
  }
}
