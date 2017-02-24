const config = {
  fields: ['firstname', 'surrname', 'email', 'food'],
  managerMail: 'mailMananager@yandex.ru',
  mailConfig: {
        service: 'yandex',
        auth: {
          "user": "vasilenk@yandex.ru",
          "pass": ""
        }
    }
};

module.exports = config;
