# WhatsApp Bot for Managing Contacts and Templates

This WhatsApp bot allows you to manage phone numbers and message templates and send messages to contacts using a set of commands. You can add, delete, and clear both numbers and templates, as well as send messages to all stored contacts.

## Features
- Add and delete phone numbers.
- Add and delete message templates.
- Send messages to individual numbers or all stored numbers.
- Retrieve all stored numbers and templates.
- Clear all numbers or templates.
- Works with the WhatsApp Web API using [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).

## Commands

1. **Add a number**:  

 ```
!add_number <number>
 ```

Adds a phone number to the database.

 ```
!add_template <template>
 ```

Adds a message template to the database.

3. **Send a message template to a number**:  

 ```
!send_template <template_id> <number>
 ```

Sends a specific message template to the provided phone number.

4. **Send a custom message to a number**:  

 ```
!send_message <number> <message>
 ```

Sends a custom message to the provided phone number.

5. **Send a message to all stored numbers**:  

 ```
!send_all <message>
 ```

Sends the provided message to all stored phone numbers.

6. **Get all stored numbers**:  

 ```
!get_numbers
 ```

Retrieves a list of all stored phone numbers.

7. **Get all stored message templates**:  

 ```
!get_templates
 ```

Retrieves a list of all stored message templates with their IDs.

8. **Delete a specific number**:  

 ```
!delete_number <number>
 ```

Deletes the specified phone number from the database.

9. **Clear all numbers**:  

 ```
!clear_numbers
 ```

Deletes all stored phone numbers.

10. **Delete a specific message template**:  
 ```
 !delete_template <template_id>
 ```
 Deletes the specified message template.

11. **Clear all message templates**:  
 ```
 !clear_templates
 ```
 Deletes all stored message templates.

12. **Ping**:  
 ```
 !ping
 ```
 Responds with "pong" to verify if the bot is running.

