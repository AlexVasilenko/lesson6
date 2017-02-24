const express = require('express');

const exphbs  = require('express-handlebars');
const app = express();
const validator = require('validator');
const sendMail = require('./mailService');
const bodyParser = require('body-parser');
const fs = require('fs');
const hbs = exphbs.create();
const config = require('./config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/order', (req, res) => {
  if (isRequired(req.body).invalid
     || !validator.isEmail(req.body.email)
     || !validator.isNumeric(req.body.phone)) {
    res.render('home', {
      data: req.body,
      required: isRequired(req.body),
      isEmail: !validator.isEmail(req.body.email),
      isTel: !validator.isNumeric(req.body.phone)
    });
    return;
  }

  function isRequired(data) {
    const errors = {};
    const res = config.fields.map((item) => {
      if (!data[item]) {
        errors[item] = true;
        errors['invalid'] = true;
      }
    });
    return errors;
  }

  const id = generateId();

    const mailOptions = {
        from: ' <order@alex.vasylenko>', // sender address
        subject: `Order ${id}. ${req.body.firstname }${req.body.surrname}`, // Subject line
        data: {
          id,
          name: req.body.firstname,
          surrname: req.body.surrname,
          email: req.body.email,
          product: req.body.product,
        }
      };

        hbs.renderView('./views/mail-to-manager.handlebars', mailOptions.data, (data, template) => {
          mailOptions.html = template;
          sendMail(config.managerMail, mailOptions);
        });

   const time = new Date();

   var mailOrderOptions = {
       from: ' <order@alex.vasylenko>', // sender address
       subject: `Order ${id} is made in Larek`, // Subject line
       data: {
         id,
         time,
         product: req.body.product
       }
  };

  hbs.renderView('./views/mail-to-user.handlebars', mailOrderOptions.data, (data, template) => {
    mailOptions.html = template;
    sendMail(req.body.email, mailOrderOptions);
  });

  res.render('success', {id});
});

function generateId() {
  const min = 0;
  const max = 9999;
  const rand = min - 0.5 + Math.random() * (max - min + 1)
  return Math.round(rand);
}

app.listen(5000, function () {
    console.log('listening on http://localhost:5000');
});
