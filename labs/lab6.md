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

Реєстрація користувачів на сайті:

__users_index.ejs__

~~~~ html
<form action='/register' method='POST'>
	<label>Username:</label>
	<input type='text' name='username' class='form-control' value='user' />
	<label>Password:</label>
	<input type='password' name='pass' class='form-control' value='' />
	<label>Repeat password:</label>
	<input type='password' name='pass2' class='form-control' value='' />
	<button type='submit' class='btn btn-primary'>Register</button>
</form>
~~~~

__app.js__

~~~~ javascript 
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',
	(req, res) => res.render('users_index', { user: req.user }));
	
app.post('/register',
	(req, res) => {
		let username = req.body.username;
		let pass = req.body.pass;
		let pass2 = req.body.pass2;
		// @todo перевірити валідність даних і створити нового користувача у БД 
		res.redirect('/');
	});
app.listen(3000, () => console.log('App on 3000'));
~~~~

Аутентифікація на сайті за допомогою PassportJS:

~~~~ javascript
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboyBodyParser({ limit: '5mb' }));
app.use(cookieParser());
app.use(session({
	secret: "Some_secret^string",
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// визначає, яку інформацію зберігати у Cookie сесії
passport.serializeUser(function(user, done) {
    // наприклад, зберегти у Cookie сесії id користувача
    done(null, user._id);
});

// отримує інформацію (id) із Cookie сесії і шукає користувача, що їй відповідає
passport.deserializeUser(function(id, done) {
	// отримати користувача по id і викликати done(null, user);
	// при помилці викликати done(err, null)
});

// налаштування стратегії для визначення користувача, що виконує логін
// на основі його username та password
passport.use(new LocalStrategy((username, password, done) => {
	// отримати користувача по його username і password і викликати done(null, user);
	// при помилці викликати done(err, null)
}));

// якщо користувач аутентифікований, req.user міститиме його екземпляр
app.get('/',
	(req, res) => res.render('users_index', { user: req.user }));

// аутентифікація через PassportJS
// викликає функцію-обробника із обраної стратегії ('local' - LocalStrategy)
app.post('/login',
	passport.authenticate('local', { failureRedirect: '/' }),  
	(req, res) => res.redirect('/'));

// вихід із сесії
app.get('/logout', (req, res) => {
	req.logout();  
	res.redirect('/');
});

app.listen(3000, () => console.log('App on 3000'));
~~~~

Приклад обмеження доступу до ресурсів системи для певних ролей користувачів:

~~~~ javascript
// ресурс доступний всім користувачам, навіть неаутентифікованих
app.get('/', 
    (req, res) => res.render('auth_index', { user: req.user }));

// ресурс доступний тільки аутентифікованим користувачам
app.get('/profile',
    (req, res, next) => {
        if (req.user) next();  // пропускати далі тільки аутентифікованих
        else res.status(401).end('Not authorized');
    },
    (req, res) => res.end('User profile page'));

// ресурс доступний аутентифікованим користувачам із роллю 'admin'
app.get('/admin',
    (req, res, next) => {
        if (!req.user) res.status(401).end('Not authorized');
        else if (req.user.role !== 'admin') res.status(403).end('Forbidden');
        else next();  // пропускати далі тільки аутентифікованих із роллю 'admin'
    },
    (req, res) => res.end('Admin page'));
~~~~

## Демонстрація

* Продемонструвати можливість реєстрації нового користувача.
* Продемонструвати авторизацію, відмінність вигляду сайту в залежності від ролі авторизованого користувача і захищеність певного типу інформації на сайті від перегляду неавторизованими користувачами.

## Вимоги до документації

* Опис модифікованої структури бази даних.
* Скріншоти відповідних змін у фронт-енді.
