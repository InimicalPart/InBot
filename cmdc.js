const prompt = require("inquirer").createPromptModule();
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
let categoryFile = "";
let mainDir = "";
let commandDir = path.join(__dirname, "commands/");
let indexFile = path.join(__dirname, "index.js");
let configFile = path.join(__dirname, "config.js");
let adminFile = path.join(__dirname, "public/admin.html");
const categories = {
  fun: "Fun",
  iiisub: "III Submission",
  misc: "Miscellaneous",
  mod: "Moderation",
  music: "Music",
  economy: "Economy",
  developer: "Developer",
};
async function promptOptions() {
  console.clear();
  let { cmdname } = await prompt({
    name: "cmdname",
    type: "input",
    message: "Command Name:",
  });
  let { category } = await prompt({
    type: "list",
    name: "category",
    message: "Which category does the command fit to?",
    pageSize: 10,
    loop: false,
    choices: [...Object.values(categories)],
  });
  console.log(chalk.green.bold("? ") + chalk.white.bold("Working..."));
  return executeAction(
    cmdname,
    Object.keys(categories).find((key) => categories[key] === category)
  );
}
async function executeAction(cmdname, category) {
  const cmdClone = cmdname;
  cmdname = cmdname.toLowerCase();
  console.log(
    chalk.green.bold("? ") + chalk.white.bold("Getting required files...")
  );
  switch (category) {
    case "fun":
      categoryFile = path.join(__dirname, "/commands/fun/index.js");
      mainDir = path.join(__dirname, "/commands/fun/");
      break;
    case "iiisub":
      categoryFile = path.join(__dirname, "/commands/iii-submission/index.js");
      mainDir = path.join(__dirname, "/commands/iii-submission/");
      break;
    case "misc":
      categoryFile = path.join(__dirname, "/commands/misc/index.js");
      mainDir = path.join(__dirname, "/commands/misc/");
      break;
    case "mod":
      categoryFile = path.join(__dirname, "/commands/moderation/index.js");
      mainDir = path.join(__dirname, "/commands/moderation/");
      break;
    case "music":
      categoryFile = path.join(__dirname, "/commands/music/index.js");
      mainDir = path.join(__dirname, "/commands/music/");
      break;
    case "economy":
      categoryFile = path.join(__dirname, "/commands/economy/index.js");
      mainDir = path.join(__dirname, "/commands/economy/");
      break;
  }
  console.log(
    chalk.green.bold("? ") + chalk.white.bold("Editing category file...")
  );
  const data = fs.readFileSync(categoryFile, { encoding: "utf8", flag: "r" });
  const newData = data.replace(
    `module.exports = {`,
    `function ${cmdname}() {\n	return require("./${cmdname}/${cmdname}.js")\n}\n\nmodule.exports = {\n	${cmdname},`
  );
  fs.writeFileSync(categoryFile, newData);
  console.log(
    chalk.green.bold("? ") + chalk.white.bold("Creating directory...")
  );
  if (!fs.existsSync(path.join(mainDir, `/${cmdname}`))) {
    fs.mkdirSync(path.join(mainDir, `/${cmdname}`));
  }
  console.log(
    chalk.green.bold("? ") + chalk.white.bold("Copying TEMPLATE.js...")
  );
  const template = fs.readFileSync(path.join(commandDir, "/TEMPLATE.js"), {
    encoding: "utf8",
    flag: "r",
  });
  const newTemplate = template
    .replace("<command name>", cmdname)
    .replace("command1", cmdname)
    .replace("fun/music/mod/iiisub/misc/economy", category)
    .replace(
      "[UpperCMD]",
      cmdClone.charAt(0).toUpperCase() + cmdClone.slice(1)
    );
  console.log(
    chalk.green.bold("? ") + chalk.white.bold("Writing to command file...")
  );
  fs.writeFile(
    path.join(mainDir, `/${cmdname}/${cmdname}.js`),
    newTemplate,
    function (err) {
      if (err) throw err;
      //console.log('File is created successfully.');
    }
  );
  console.log(chalk.green.bold("? ") + chalk.white.bold("Editing index.js..."));
  const index = fs.readFileSync(indexFile, { encoding: "utf8", flag: "r" });
  const newIndex = index.replace(
    '"Discord": Discord,',
    "	" +
      `"cmd${
        cmdClone.charAt(0).toUpperCase() + cmdClone.slice(1)
      }": ${category}.${cmdname}(),\n	\"Discord\": Discord,`
  );
  fs.writeFile(indexFile, newIndex, function (err) {
    if (err) throw err;
    //console.log('File is created successfully.');
  });

  console.log(
    chalk.green.bold("? ") + chalk.white.bold("Editing config.js...")
  );
  fs.appendFileSync(
    configFile,
    "exports.cmd" +
      cmdClone.charAt(0).toUpperCase() +
      cmdClone.slice(1) +
      " = true\n"
  );
  console.log(chalk.green.bold("? ") + chalk.white.bold("Done"));
}
promptOptions();
