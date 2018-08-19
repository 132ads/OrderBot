const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

const bot = new Discord.Client({
  disableEveryone: true
});
var queue = [];
var start = false;
var simplequeue = [];
var simplecommands = ["order", "queue", "leave"];
var admincommands = ["complete"];
bot.on("ready", () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("Taking DoorDash Orders!")
});

bot.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  var d = new Date();

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (cmd === `${prefix}start`) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
      start = true;
      return message.channel.send("Started.");
    } else {
      return message.channel.send("You do not have the required permissions to start the bot.")
    }
  }
  if (cmd === `${prefix}stop`) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
      start = false;
      return message.channel.send("Stopped.");
    } else {
      return message.channel.send("You do not have the required permissions to stop the bot.")
    }
  }
  if (start === true) {
    if (cmd === `${prefix}order`) {
      if (simplequeue.includes(message.author.username)) {
        message.channel.send("You have already joined the queue.");
      } else {
        queue.push(message.author.username + ", order placed at " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " PST");
        simplequeue.push(message.author.username);
        message.channel.send(`${message.author.username} has been added to the queue!`);
        var joined = queue.join("\n");
        message.channel.send("Current Queue:")
        return message.channel.send(joined);
      }
    }
    if (cmd === `${prefix}queue`) {
      if (queue.length == 0) {
        return message.channel.send("The queue is empty!")
      } else {
        message.channel.send("Current Queue:")
        var joined = queue.join("\n");
        return message.channel.send(joined);
      }
    }
    if (cmd === `${prefix}leave`) {
      var index = simplequeue.indexOf(message.author.username);
      queue.splice(index, 1);
      simplequeue.splice(index, 1);
      message.channel.send("You have removed yourself from the queue.");
    }
    if (cmd === `${prefix}purge`) {
      if (message.member.hasPermission("ADMINISTRATOR")) {
        for (var i = 0; i < queue.length + 1; i++) {
          queue.pop();
          simplequeue.shift();
        }
        message.channel.send("Queue has been cleared!");
      } else {
        message.channel.send("You must be an administrator to clear the queue!");
      }
    }
    if (cmd === `${prefix}complete`) {
      if (message.member.hasPermission("ADMINISTRATOR")) {
        message.channel.send(simplequeue[0].concat(", your order is complete. Enjoy your meal!"));
        queue.shift();
        simplequeue.shift();
      } else {
        message.channel.send("You must be an administrator to complete orders!");
      }
      message.channel.send("Current Queue:")
      if (queue.length == 0) {
        return message.channel.send("The queue is empty!")
      } else {
        var joined = queue.join("\n");
        return message.channel.send(joined);
      }
    }
    if (cmd === `${prefix}remove`) {
      simplequeue.shift();
      queue.shift();
    }
    if (cmd === `${prefix}help`) {
      message.channel.send("`!order to join the queue.` \n");
      message.channel.send("`!queue to view the queue.` \n");
      message.channel.send("`!leave to leave the queue.` \n");
    }
    if (cmd === `${prefix}admin`) {
      if (message.member.hasPermission("ADMINISTRATOR")) {
        message.channel.send("`!complete to complete an order.` \n");
        message.channel.send("`!purge to purge the queue.` \n");
        message.channel.send("`!skip to move the first person in queue to the last place.` \n");
        message.channel.send("`!remove to remove the first person in queue.`");
        message.channel.send("`!start/stop to start/stop the bot.`");
      } else {
        message.channel.send("You must be an administrator to view administrator commands.");
      }
    }
    if (cmd === `${prefix}skip`) {
      if (message.member.hasPermission("ADMINISTRATOR")) {
        queue.push(queue.shift());
        simplequeue.push(simplequeue.shift());
        message.channel.send("First order has been sent to the back.")
      } else {
        message.channel.send("You must be an administrator to skip.");
      }
    }
  } else if (cmd.charAt(0) === "!") {
    for (var i = 0; i < simplecommands.length; i++) {
      var test = `${prefix}` + simplecommands[i];
      if (cmd === test) {
        return message.channel.send("Ordering has not been started.");
      } else {
        return;
      }
    }
  }
});

bot.login(botconfig.token);
