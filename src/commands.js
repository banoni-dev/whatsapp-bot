const db = require("./database");

const handleCommand = (msg, client) => {
  const [command, ...args] = msg.body.split(" ");

  switch (command) {
    case "!add_number":
      addNumber(msg, args);
      break;
    case "!add_template":
      addTemplate(msg, args);
      break;
    case "!send_template":
      sendTemplate(msg, client, args);
      break;
    case "!send_message":
      sendCustomMessage(msg, client, args);
      break;
    case "!send_all":
      sendMessageToAll(msg, client, args);
      break;
    case "!get_numbers":
      getNumbers(msg);
      break;
    case "!get_templates":
      getTemplates(msg);
      break;
    case "!delete_number":
      deleteNumber(msg, args);
      break;
    case "!clear_numbers":
      clearNumbers(msg);
      break;
    case "!delete_template":
      deleteTemplate(msg, args);
      break;
    case "!clear_templates":
      clearTemplates(msg);
      break;
    case "!send":
      sendAlertMessage(msg, client, args);
      break;
    default:
      msg.reply("Unknown command.");
      break;
  }
};

const sendAlertMessage = (msg, client, args) => {
  const [templateId, ...rest] = args;

  // Extract the model enclosed in < >
  const modelMatch = rest.join(" ").match(/<([^>]+)>/);
  if (!modelMatch) {
    msg.reply("Please provide a valid model enclosed in < >.");
    return;
  }
  const model = modelMatch[1]; // Extracted model (without the brackets)

  // Remove the model from the arguments to get link and number
  const remainingArgs = rest
    .join(" ")
    .replace(modelMatch[0], "")
    .trim()
    .split(" ");
  const [link, number] = remainingArgs;

  if (!templateId || !model || !link || !number) {
    msg.reply("Usage: !send <template_id> <model> <link> <number>");
    return;
  }

  db.get(
    "SELECT template FROM message_templates WHERE id = ?",
    [templateId],
    (err, row) => {
      if (err || !row) {
        msg.reply("Template not found.");
      } else {
        // Replace placeholders with actual model and link
        let message = row.template
          .replace("<model>", model)
          .replace("<link>", link)
          .replace(/\\n/g, "\n"); // Replace \n with actual newline

        client
          .sendMessage(`${number}@c.us`, message)
          .then(() => msg.reply(`Alert message sent to ${number}`))
          .catch(() => msg.reply("Failed to send message."));
      }
    },
  );
};

// Add a phone number
const addNumber = (msg, args) => {
  const number = args[0];
  if (number) {
    db.run("INSERT INTO numbers (number) VALUES (?)", [number], (err) => {
      if (err) {
        msg.reply("Error adding number.");
      } else {
        msg.reply(`Number ${number} added successfully.`);
      }
    });
  } else {
    msg.reply("Please provide a valid number.");
  }
};

// Add a message template
const addTemplate = (msg, args) => {
  const template = args.join(" ");
  db.run(
    "INSERT INTO message_templates (template) VALUES (?)",
    [template],
    (err) => {
      if (err) {
        msg.reply("Error adding message template.");
      } else {
        msg.reply("Message template added successfully.");
      }
    },
  );
};

// Send a message template to a specific number
const sendTemplate = (msg, client, args) => {
  const [templateId, number] = args;
  if (!templateId || !number) {
    msg.reply("Usage: !send_template <template_id> <number>");
    return;
  }

  db.get(
    "SELECT template FROM message_templates WHERE id = ?",
    [templateId],
    (err, row) => {
      if (err || !row) {
        msg.reply("Template not found.");
      } else {
        client
          .sendMessage(`${number}@c.us`, row.template)
          .then(() => msg.reply(`Message sent to ${number}`))
          .catch(() => msg.reply("Failed to send message."));
      }
    },
  );
};

// Send a custom message to a specific number
const sendCustomMessage = (msg, client, args) => {
  const [number, ...messageParts] = args;
  const message = messageParts.join(" ");
  if (!number || !message) {
    msg.reply("Usage: !send_message <number> <message>");
    return;
  }

  client
    .sendMessage(`${number}@c.us`, message)
    .then(() => msg.reply(`Message sent to ${number}`))
    .catch(() => msg.reply("Failed to send message."));
};

// Send a message to all stored numbers
const sendMessageToAll = (msg, client, args) => {
  const message = args.join(" ");
  if (!message) {
    msg.reply("Usage: !send_all <message>");
    return;
  }

  db.all("SELECT number FROM numbers", (err, rows) => {
    if (err || !rows.length) {
      msg.reply("No numbers found.");
      return;
    }

    rows.forEach(({ number }) => {
      client
        .sendMessage(`${number}@c.us`, message)
        .catch(() => msg.reply(`Failed to send message to ${number}`));
    });
    msg.reply("Messages sent to all numbers.");
  });
};

// Get all stored numbers
const getNumbers = (msg) => {
  db.all("SELECT number FROM numbers", (err, rows) => {
    if (err || !rows.length) {
      msg.reply("No numbers found.");
    } else {
      const numbers = rows.map((row) => row.number).join(", ");
      msg.reply(`Stored numbers: ${numbers}`);
    }
  });
};

// Get all stored templates
const getTemplates = (msg) => {
  db.all("SELECT id, template FROM message_templates", (err, rows) => {
    if (err || !rows.length) {
      msg.reply("No templates found.");
    } else {
      const templates = rows
        .map((row) => `${row.id}: ${row.template}`)
        .join("\n");
      msg.reply(`Stored templates:\n${templates}`);
    }
  });
};

// Delete a specific number
const deleteNumber = (msg, args) => {
  const number = args[0];
  if (!number) {
    msg.reply("Usage: !delete_number <number>");
    return;
  }

  db.run("DELETE FROM numbers WHERE number = ?", [number], (err) => {
    if (err) {
      msg.reply("Error deleting number.");
    } else {
      msg.reply(`Number ${number} deleted.`);
    }
  });
};

// Clear all numbers
const clearNumbers = (msg) => {
  db.run("DELETE FROM numbers", (err) => {
    if (err) {
      msg.reply("Error clearing numbers.");
    } else {
      msg.reply("All numbers cleared.");
    }
  });
};

// Delete a specific template
const deleteTemplate = (msg, args) => {
  const templateId = args[0];
  if (!templateId) {
    msg.reply("Usage: !delete_template <template_id>");
    return;
  }

  db.run("DELETE FROM message_templates WHERE id = ?", [templateId], (err) => {
    if (err) {
      msg.reply("Error deleting template.");
    } else {
      msg.reply(`Template ${templateId} deleted.`);
    }
  });
};

// Clear all templates
const clearTemplates = (msg) => {
  db.run("DELETE FROM message_templates", (err) => {
    if (err) {
      msg.reply("Error clearing templates.");
    } else {
      msg.reply("All templates cleared.");
    }
  });
};

module.exports = handleCommand;
