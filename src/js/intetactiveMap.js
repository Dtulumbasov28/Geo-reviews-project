// ymaps.ready(init);

// function init() {
//   let myPlacemark;
//   let coord;
//   const map = new ymaps.Map("map", {
//     center: [59.94, 30.32],
//     zoom: 12,
//     behaviors: ["drag"],
//   });

//   const clusterer = new ymaps.Clusterer({

//   })
// }

// Класс принимает идентификатор элемента и функцию клика на карту
export default class intetactiveMap {
  constructor(mapId, onClick) {
    this.mapId = mapId;
    this.onClick = onClick;
  }

  // Метод инициализирует карту:
  // вставляет скрипт яндекс-map;
  //
  async init() {
    await this.injectYMapsScript();
    await this.loadYMaps();
    this.initMap();
  }

  // Инициализация карты (1 этап):
  //  создаем промис;
  //  создаенм элемент типа script;
  //  вставляем тег scropt на страницу.
  injectYMapsScript() {
    return new Promise((resolve) => {
      const ymapsScript = document.createElement("script");
      ymapsScript.src =
        "https://api-maps.yandex.ru/2.1/?apikey=9f34e6de-5bfe-4972-aea2-b11055170785&lang=ru_RU";
      document.body.appendChild(ymapsScript);
      ymapsScript.addEventListener("load", resolve);
    });
  }

  // Инициализация карты (2 этап):
  // после загрузки скрипта разрешается промис.
  loadYMaps() {
    return new Promise((resolve) => ymaps.ready(resolve));
  }

  // Инициализация карты (3 этап):
  // создаем кластеризатор;
  // обрабатываем клики по кластеризатору;
  // создаем карту;
  // обрабатываем клики по карте;
  // добавляем кластеризатор на карту;
  initMap() {
    this.clusterer = new ymaps.Clusterer({
      groupByCoordinates: true,
      clusterDisableClickZoom: true,
      clusterOpenBalloonOnClick: false,
    });
    this.clusterer.events.add("click", (e) => {
      const coords = e.get("target").geometry.getCoordinates();
      this.onClick(coords);
    });
    this.map = new ymaps.Map(this.mapId, {
      center: [59.94, 30.32],
      zoom: 12,
    });
    this.map.events.add("click", (e) => this.onClick(e.get("coords")));
    this.map.geoObjects.add(this.clusterer);
  }

  // Метод открывает балун
  openBalloon(coords, content) {
    this.map.ballon.open(coords, content);
  }

  // Метод позволяет заменить контент у открытого балуна
  setBalloonContent(content) {
    this.map.ballon.setData(content);
  }

  // Метод закрывает открытый балун
  closeBalloon() {
    this.map.ballon.close();
  }


  // Метод создает плейсмарк:
  // создаем плеейсмарк;
  // вешает на него обработчик кликов по координатам;
  // добавляет его в кластеризатор.
  createPlacemark(coords) {
    const placemark = new ymaps.Placemark(coords);
    placemark.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordinates();
      this.onClick(coords);
    });
    this.clusterer.add(placemark);
  }
}
