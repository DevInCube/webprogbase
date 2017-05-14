# Лабораторна робота №1

## Тема
Клієнт-серверна архітектура програм. Протокол TCP

## Мета
Навчитись розділяти програми на серверні та клієнтські частини та організовувати доступ клієнтів до ресурсів та функцій серверів за допомогою власного протоколу взаємодії.

## Завдання
Перед тим як приступити до виконання лабораторних завдань потрібно обрати спеціальний тип об’єктів з реального світу, із набором яких потрібно буде працювати (наприклад: фільми, музика, актори, книги, тощо).

1. Створити JSON-файл, у який внести близько 10 об’єктів, що містять:

  * мінімум 2 строки
  * 2 числа
  * строку із датою у форматі [ISO 8601](https://www.google.com/url?q=https://en.wikipedia.org/wiki/ISO_8601&sa=D&ust=1476658319702000&usg=AFQjCNFit93SUk7rnJ9TL8jSLMiHYsfQnA) 

1. Реалізувати консольний TCP сервер, біля якого розмістити описаний JSON-файл.

1. Реалізувати консольний TCP клієнт. Клієнт після запуску запитує у користувача адресу сервера і виконує підключення до нього. Після цього клієнт може виконувати запити до сервера.
1. Описати власний протокол обміну даними між клієнтом і сервером. Важливо щоби і клієнт і сервер писали у консоль всю інформацію, яку вони отримують і відправляють. У протоколі обов’язково повинні бути команди (які клієнт відправляє серверу):

  * завершення з’єднання
  * отримання всього вмісту JSON-файлу із сервера        
  * отримання відфільтрованого по певному полю списку об’єктів із JSON-файлу сервера
  * отримання загальної кількості об’єктів у JSON-файлі
  * отримання інформації про підключених до сервера клієнтів (їх адреси)

## Демонстрація

* JSON-файл має проходити [jsonlint](https://www.google.com/url?q=https://www.npmjs.com/package/jsonlint&sa=D&ust=1476658319705000&usg=AFQjCNGPyxVDYg0uMk1nwRJ6L_AGa6OgHw) валідацію
* Запустити два процеси сервера та два процеси клієнта
* Продемонструвати підключення клієнтів до окремих серверів
* Продемонструвати підключення обох клієнтів до одного сервера та виконання всіх команд із протоколу взаємодії.

## Вимоги до документації

* Описати структуру JSON-об’єктів.
* Описати протокол обміну даними між клієнтом і сервером.

## Лістинг

__server.js__
~~~~js
var net = require('net');
var server = net.createServer(function(connection) {
   console.log('client %s:%s connected', connection.remoteAddress, connection.remotePort);
   
   // https://nodejs.org/api/net.html#net_event_data
   connection.on("data", data => {
          // receive message from client
          console.log(String(data));
         
          connection.write('On data response!\r\n');  // send message to client
   });
   
   connection.on('end', function() {
          console.log('client disconnected');
   });
   
   connection.write('Hello World!\r\n');  // send message to client
   
   connection.pipe(connection);
});
server.listen(8080, function() {
  console.log('server is listening');
});
~~~~

__client.js__
~~~~js
const net = require('net');
const stdin = process.openStdin();
const connectionOptions = {
    host: "localhost",
    port: 8080
};
const client = net.connect(connectionOptions, () => {
  // 'connect' listener
  console.log('connected to server!');
  client.write('Hello world!\r\n');  // send data to server
});
// receive data from server
client.on('data', (data) => {
  console.log("Server: " + data.toString());
});
// when client disconnected
client.on('end', () => {
  console.log('disconnected from server');
  stdin.removeListener('data', stdinDataListener);  // unsubscribe
  stdin.destroy();  // close stdin
});
const stdinDataListener = function(data) {
    let str = data.toString().trim();
    console.log("You entered: " + str);
    if (str === "q") {
            client.end();  // disconnect client from server
    } else {
            client.write(str);  // send input string to server
    }
};
stdin.addListener('data', stdinDataListener);
~~~~
