start =
  🤖 Hello, { $name }. Let's get started!

start_language = 🌐 What language u prefer?

info =
  ☘️ We strive to make our product as useful as possible for you!
  If you have any <strong>ideas</strong> or <strong>suggestions</strong> for improvement, please write to us at @bot_support.
  🫶 We would love to hear your feedback!

  ☕️ Want to support us?
  |- TRC20: TDjrQjQrkuxCi1kisbadKSfxxvcJkubx2j
  |- Polygon: 0x049361d4146eaac592e07983c8ee27c8f8447ca6

language =
  .specify-a-locale = Please specify a locale. Example is /language en.
  .invalid-locale = The locale you have provided is invalid. Please use /language en.
  .already-set = English language has already been set.
  .language-set = English language has been successfully set.

profile =
  Here is your profile information:
  |- 🏷️ ID: { $telegram_id }
  |- 👤 Name: { $name }
  |- 🗓 Registration date: { $registration_date }
  |- 📂 The amount of parsed files: { $parsed_files }
  |- 🏦 Balance: { $parses } parses | { $checks } checks
  .additional_actions = |- Additional actions:
  .my_profile = 👤 My profile
  .about_us = 🌟 About us
  .instruction = 📋 Instruction
  .settings = ⚙️ Settings
  .uploaded_files = 📂 Files
  .language = 🌐 Language
  .support = 🆘 Support
  .referal = 🤝 Referral system 🤝
  .top_up_balance = 🏦 Top up balance
  .top_up_10_40_balance = 40 parses = 10$
  .top_up_22_100_balance = 100 parses = 22$
  .top_up_100_500_balance = 500 parses = 100$
  .top_up_190_1000_balance = 1000 parses = 190$
  .top_up_350_2000_balance = 2000 parses = 350$
  .top_up_message =
    You can choose the network that works best for you:
    |- TRC20: TDjrQjQrkuxCi1kisbadKSfxxvcJkubx2j
    |- Polygon: 0x049361d4146eaac592e07983c8ee27c8f8447ca6

    Once you have made your transfer, please send us @bot_support a screenshot of the payment! 📸

    ‼️ The transfer amount should match the one in the package you selected ({ $requestedTopUpAmount } parses = { $requestedTopUpPrice }$)
  .top_up_message_cryptomus =
    You can choose the network that works best for you:
    |- TRC20: TDjrQjQrkuxCi1kisbadKSfxxvcJkubx2j
    |- Polygon: 0x049361d4146eaac592e07983c8ee27c8f8447ca6
    Once you have made your transfer, please send us @bot_support a screenshot of the payment! 📸

    💳 Or you can pay with Cryptomus using this link: { $url } 🔗✨

    ‼️ The transfer amount should match the one in the package you selected ({ $amount } parses = { $price }$)

error = 
  .profile_error = Please start the bot first.
  .download_from_telegram = An error occurred while downloading the file.
  .save_to_db_for_processing = An error occurred while saving the file to the database for further processing.
  .save_to_db = An error occurred while saving the processed file to the database.
  .file_not_found_in_db = 🚫 Oops! I can't find that file.
  .cards_not_found = No card data was found in the file.
  .not_enough_parses = You do not have enough parses.
  .incorrect_msg = 🚫 Oops! I don't understand you.

success =
  .download_from_telegram = 🔥 The file has been successfully uploaded! Continuing processing...

warn =
  .pls_send_file_with_correct_format = Please upload a text file (formats: <i>.html, .txt</i>).

general =
  .precessing = Processing...

uploaded_files = Your uploaded files: { $files }
uploaded_file = 
  ✨ To download your file, just follow these simple steps:
  1. Click on the <code>download_parsed-xxx-xxxx-xx.txt</code> file to copy it
  2. Send me a message
  3. Enjoy using it! 🎉
do_not_have_uploaded_files = Your do not have uploaded files.
choose_packages = Select a top-up package:
can_not_process_btn = 🚫 Oops! Can not process that button.

msg = 
  .file_found_in_db = ✨ Here is your desired file! ✨

admin =
  .buy_package = 
    Користувач { $name } зацікавлений у покупці пакету
    |- USERNAME: { $username }
    |- ID: { $id }  
    |- ПАКЕТ: { $amount } парсингів = { $price }$

instruction =
  🏷 Instructions for card data parsing
  Welcome to @parse_some_data_bot! 🎉 This bot makes it super easy to parse card numbers, expiration dates, and CVV codes! 🏦✨

  You can send your data as a message or upload a file for parsing.

  File Upload:
  You can upload files up to 16MB in either .txt or .html format.

  🏷 Instructions for card checking
  The Card Checker can verify up to 100 cards in a single message! Just make sure to put one card per line. For example, to check 3 cards, send:
  5178059938197446|1225|241
  4147805993819742|1224|658
  5123051838137448|1226|723

  File Upload:
  You can also send data for verification in a file of up to 16MB. Just upload a .txt file, ensuring the data format matches what you’d send in a message.

  Happy parsing or checking! If you have any questions, feel free to ask @bot_support! 💬✨