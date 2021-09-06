import Collection from "@discordjs/collection";

declare module "discordjs" {
  export interface Client {
    commands: Collection
  }
}
