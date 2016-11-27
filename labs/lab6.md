# Лабораторна робота №6

## Тема
Використання Cookies. Авторизація користувачів та сесії

## Мета
Вивчити можливості Cookies. Реалізувати персоналізацію вмісту сайту за допомогою користувачів і авторизації із використанням сесій.

## Завдання

1. Додати у БД можливість зберігати інформацію про користувачів сайту двох типів:

  * Простий користувач
  * Адміністратор

1. За допомогою клієнтських сесій і куків реалізувати реєстрацію і авторизацію користувачів на сайті. У шапці всіх сторінок відображати ім’я авторизованого користувача.
1. Заборонити гостям переглядати будь-які сторінки окрім головної сторінки, сторінки реєстрації, входу та допоміжних сторінок.
1. Для адміністратора додати сторінку перегляду списку зареєстрованих користувачів та відповідне посилання для переходу на цю сторінку.

## Приклад 

Аутентифікація на сайті за допомогою PassportJS:

~~~~ javascript
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('promised-mongo');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const url = 'mongodb://localhost:27017/database';
const db = mongodb(url);

let sessionSecret = "Some_secret^string";

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboyBodyParser({ limit: '5mb' }));
app.use(cookieParser());
app.use(session({
	secret: sessionSecret,
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// визначає, яку інформацію зберігати у Cookie сесії (id)
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

// отримує інформацію (id) із Cookie сесії і шукає користувача, що їй відповідає
passport.deserializeUser(function(id, done) {
	db.users.findOne({ _id: mongodb.ObjectId(id) })
		.then(user => {
			if(user) {
				done(null, user);
			} else {
				done("No user", null);
			}
		})
		.catch(err => done(err, null));
});

// налаштування стратегії для визначення користувача, що виконує логін
// на основі його username та password
passport.use(new LocalStrategy((username, password, done) => {
	  db.users.findOne({
		  username: username,
		  passwordHash: hash(password)
	  })
		.then(user => {
			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		})
		.catch(err => done(err, null));
}));

// для хешування паролю користувача
function hash(pass) {
    const salt = 'Some_salt%%string';
	return crypto.createHash('md5').update(pass + salt).digest("hex");
}

app.get('/',
	(req, res) => res.render('users_index', { user: req.user }));

app.get('/login', (req, res) => res.render("users_login"));

// вихід із сесії
app.get('/logout', (req, res) => {
	req.logout();  
	res.redirect('/');
});

// аутентифікація через PassportJS
// викликає функцію-обробника із обраної стратегії ('local' - LocalStrategy)
app.post('/login',
	passport.authenticate('local', { failureRedirect: '/' }),  
	(req, res) => res.redirect('/'));

app.listen(3000, () => console.log('App on 3000'));
~~~~

## Демонстрація

* Продемонструвати можливість реєстрації нового користувача.
* Продемонструвати авторизацію, відмінність вигляду сайту в залежності від ролі авторизованого користувача і захищеність певного типу інформації на сайті від перегляду неавторизованими користувачами.

## Вимоги до документації

* Опис модифікованої структури бази даних.
* Скріншоти відповідних змін у фронт-енді.
