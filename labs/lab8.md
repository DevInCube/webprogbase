# Лабораторна робота №8

## Тема
Виконання AJAX-запитів до сервера

## Мета
Реалізувати взаємодію клієнтської частини і веб-сервера за допомогою технологіїї AJAX. Навчитись працювати із клієнтськими шаблонізаторами веб-сторінок.

## Завдання

1. На сторінці пошуку об’єктів замінити HTTP GET запит із переходом на сторінку результатів на AJAX GET запит із динамічним оновленням поточної сторінки та відображення результатів пошуку.
1. Використати клієнтський шаблонізатор сторінок (наприклад, [Mustache](https://www.google.com/url?q=https://github.com/janl/mustache.js&sa=D&ust=1476659636650000&usg=AFQjCNHD_43DunvosTq-KaBA5CgHTmvdjg)) для створення нових DOM-елементів сторінки клієнтським JavaScript.

## Приклади

### AJAX

Виконання AJAX-запиту:

~~~~ javascript
function doSearch() {
  // створити новий об'єкт AJAX-запиту
  var xhttp = new XMLHttpRequest();
  // підписатись на зміну стану об'єкта
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // у стані (this.readyState) 4 об'єкт повністю прийняв відповідь від сервера
      // this.status - код HTTP статуса відповіді
      // this.responseText - HTTP тіло відповіді
      var data = this.responseText;
      // @todo опрацювати прийняті дані
    }
  };
  // задати опції запиту до веб-сервера (GET /get_data)
  xhttp.open("GET", "/get_data", true);
  // відправити запит
  xhttp.send();
}
~~~~

### Mustache

Для використання сторонньої бібліотеки у клієнтському Javascript потрібно додати у <head></head> посилання на online-версію коду бібліотеки. Наприклад, для Mustache:

~~~~ javascript
<script src='https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.2.1/mustache.min.js'></script>
~~~~

Mustache шаблон задається у тезі <script type="x-tmpl-mustache"></script>

~~~~ html
  <!-- Шаблон Mustache -->
	<script id="my-list-template" type="x-tmpl-mustache">

		<div>
			<ul class="list-group">
			{{#list}}
				<li class="list-group-item">
					<span>{{title}}</span>
				</li>
			{{/list}}
			</ul>
		</div>

	</script>
~~~~

Наведений шаблон дозволяє згенерувати HTML список елементів зі списку даних:

~~~~ javascript
function updateList() {
	// дані
	var myList = [
		{ title: 'Title 1' },
		{ title: 'Title 2' },
		{ title: 'Title 3' }
	];
	// отримати об'єкт шаблона із DOM за його ідентифікатором "my-list-template" і взяти його HTML вміст
	var template = document.getElementById("my-list-template").innerHTML;
	// згенерувати HTML строку на основі шаблону і даних
	var renderedHTML = Mustache.render(template, { list: myList });
	// помістити строку з HTML всередину елемента з ідентифікатором "my-list"
	document.getElementById("my-list").innerHTML = renderedHTML;
}
~~~~

В результаті вміст DOM елемента з ідентифікатором "my-list" заповниться новими DOM елементами, що були згенеровані шаблонізатором.

## Демонстрація

* Продемонструвати часткове оновлення вмісту сторінки за допомогою AJAX-запитів і клієнтського JavaScript.

## Вимоги до документації

* Навести код AJAX-запитів
* Навести розмітку клієнтських шаблонів
