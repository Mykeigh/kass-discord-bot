import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectMenuOptions,
  SelectMenuInteraction,
} from "discord.js";
import {
  GetSomeBitches,
  NGPostData,
} from "../utils/fetch-random-ng-post-by-username";

export = {
  data: { customId: "ng-post-select" } as MessageSelectMenuOptions,
  async execute(interaction: SelectMenuInteraction) {
    // parse user submitted data
    const nger = interaction.values[0]; // Should only be one select item being sent

    if (!nger)
      return await interaction.reply({ content: "Enter a username 😩" });
    if (nger.length > 60)
      return await interaction.reply({
        content: "That input might be too long 🤔",
      });
    await interaction.deferReply();

    // get random post from provided input
    // let ngerPost: string;
    let ngPostData: NGPostData | null;
    try {
      ngPostData = await GetSomeBitches(nger);
    } catch (error: any) {
      let e: Error = error;
      console.log("what");

      await interaction.deleteReply();
      return await interaction.followUp({
        content: e.message,
        ephemeral: true,
      });
    }
    console.log(ngPostData?.postContent);

    // There should be a path to an image that was saved of a random post
    // Use that for the message file attatchement

    const postContentImgFile = new MessageAttachment(ngPostData?.imgPath!);

    const ngPostEmbed = new MessageEmbed()
      .setColor("#da9e12")
      .setTitle(`${nger}'s reply to: ${ngPostData?.threadName}`)
      .setURL(ngPostData?.postLink!)
      .setAuthor(nger, `https://${nger}.newgrounds.com/`)
      .setDescription("")
      .setImage("attachment://pod-body.png")
      .setTimestamp()
      .setFooter(
        "Experimental functionality.  Expect bugs or something.",
        "https://cdn.discordapp.com/attachments/282213665854193665/883771690587402310/unknown.png"
      );

    await interaction.editReply({
      embeds: [ngPostEmbed],
      files: [postContentImgFile],
    });
  },
};
