# InBot

InBot was a small project of mine, which was made for my Discord server, But I have decided to redesign it so anyone who wants to use it can. This bot has categories like fun, moderation, and more! This bot has games like:

- Wordle
- Minesweeper
- Sudoku
- UNO
- Chess

## Requirements for running

- [.env file](https://github.com/InimicalPart/InBot#env-file)
- [Config file](https://github.com/InimicalPart/InBot#config-file)
- [Node v16+](https://github.com/InimicalPart/InBot/blob/main/usage.txt)

## Installing

First, make sure you have all the files necessary to start. You can find all guides to files [here](https://github.com/InimicalPart/InBot#requirements-for-running)

Afterwards, you're almost done! Just open up a terminal/command prompt and navigate to the directory with all the files (including the files in this repository).

Then type:

```shell
npm install
node .
```

If everything went well then your bot should come online!

> If you encounter any issues, don't hesitate to open an [issue](https://github.com/InimicalPart/InBot/issues/new?assignees=InimicalPart&labels=help+wanted&template=help-required.md&title=%5BHELPREQ%5D+I+need+help+with+....%21)! I'll check it out as soon as I can.

## .env file

To start the bot you require an env file. This is a file that will contain secret tokens and passwords. It needs to look like this.

```txt
DISCORD_TOKEN=<The token for your Discord bot>
prefix=<Your custom prefix>
DATABASE_URL=<a postgresql database url (postgres://username:password@host:port/database)>
GENIUS_API_KEY=<API key from https://genius.com to get lyrics>
```

You can learn how to set up a PostgreSQL database here:

- [Windows](https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL.htm)
- [Linux](https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL_Linux.htm)
- [MacOS](https://www.sqlshack.com/setting-up-a-postgresql-database-on-mac/)
  <br>
  Create a file in the folder called ".env" and paste the contents above with the modified values in the file

## Config file

The config file is already included in the repository, you just need to make changes to make it work exactly like you want it to.
