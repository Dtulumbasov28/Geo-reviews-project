import InteractiveMap from './intetactiveMap';

// Создание карты:
//  создание свойства, в котором хранится html-шаблон формы балуна;
//  создание объекта класса InteractiveMap;
//  создание функции обработки клика по карте onClick;
//  инициализация карты => вызов функции onInit.
export default class GeoReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    this.map = new InteractiveMap('map', this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));
  }
  //
  //  запрос у сервере коррдинаты всех отзывов;
  //  для каждого координата создаются плеймарки
  //  вышаем обработчик событий "click" при помощи делегирования.
  async onInit() {
    // const coords = await this.callApi('coords');

    for (const item of coords) {
      for (let i = 0; i < item.total; i++) {
        this.map.createPlacemark(item.coords);
      }
    }
    document.body.addEventListener('click', this.onDocumentClick.dind(this));
  }


  //  Метод добавляет сервер:
  //  при помощи fetch посылаем данные на сервер;
  //  возвращается результат в виде json.
  async callApi(method, body = {}) {
    const res = await fetch()(`/geo-review/${method}`, {
      method: 'post',
      body: JSON.stringify(body),
    });
    return await res.json();
  }

  //  Метод вызова при клике на карту/кластеризатор:
  //  создаем div;
  //  наполняем div содержимым html-шаблона;
  //  находим элемент с data-атрибутом review-form;
  //  записываем в элемент координаты для отзыва.
  createForm(coords, reviews) {
    const root = document.createElement('div');
    root.innerHTML = this.formTemplate;
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);

    //  для каждого отзыва создается div;
    //  div наполняем информацией из отзыва.
    for (const item of reviews) {
      const div = document.createElement('div');
      div.classList.add('review-item');
      div.innerHTML = `
    <div>
      <b>${item.name}</b> [${item.place}]
    </div>
    <div>${item.text}</div>
    `;
      reviewList.appendChild(div);
    }

    return root;
  }
  
  //  метод открывает балун с надписью "загрузка"
  //  отправляем запрос к серверу за списком отзывов по координатам
  //  вызываем созданный в createForm html-элемент, затем открывает балун
  async onClick(coords) {
    // this.map.openBalloon(coords, 'Загрузка...');
    const list = await this.callApi('list', {coords});
    const form = this.createForm(coords, list);
    this.map.setBalloonContent(form.innerHTML);
  }

  //  Метод :
  //  создает фильтр по data-tole;
  //  получаем координаты по которым открыта форма;
  //  создаем объект, который отправляется на сервер.
  async onDocumentClick(e) {
    if (e.target.dataset.role === 'review-add') {
      const reviewForm = document.querySelector('[data-role=review-form]');
      const coords = JSON.parse(reviewForm.dataset.coords);
      const data = {
        coords,
        review: {
          name: document.querySelector('[data-role=review-name]').value,
          place: document.querySelector('[data-role=review-place]').value,
          text: document.querySelector('[data-role=review-text]').value,
        },
      };

      //  вызываем callApi
      //  создаем плейсмарк для отзыва;
      //  закрываем балун;
      //  catch для ошибки.
      try {
        // await this.callApi('add', data);
        this.map.createPlacemark(coords);
        this.map.closeBalloon();
      } catch (e) {
        const formError = document.querySelector('.form-error');
        formError.innerText = e.message;
      }
    }
  }
}