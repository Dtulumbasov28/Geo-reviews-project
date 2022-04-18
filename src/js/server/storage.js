const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data.json');

//  конструктор проверяет есть ли файл data.json, если нет, то создает его
//  если файл есть, то его содержимое заносится в свойство data
class Storage {
  constructor() {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, '{}');
      this.data = {};
    } else {
      this.data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
  }

  //  метод валидирует координаты, которые приходят от пользователя
  validateCoords(coords) {
    if (!Array.isArray(coords) || coords.length !== 2) {
      throw new Error('Invalid coords data');
    }
  }

  //  метод валидирует запрос
  validateReview(review) {
    if (!review || !review.name || !review.place || !review.text) {
      throw new Error('Invalid review data');
    }
  }

    //  метод собирает отзывы по координатам
  getIndex(coords) {
    return `${coords[0]}_${coords[1]}`;
  }

  //  метод:
  // валидирует координаты;
  // валидирует свойство отзыва;
  // сохраняет индекс отзыва;
  // если ключа с таким индексом нет, то создается пустой массив;
  // добавляется новый отзыв в массив;
  // обновляется хранилище.
  add(data) {
    this.validateCoords(data.coords);
    this.validateReview(data.review);
    const index = this.getIndex(data.coords);
    this.data[index] = this.data[index] || [];
    this.data[index].push(data.review);
    this.updateStorage();
  }

  //  метод получение списка всех координат отзывов для создания плейсмарков
  getCoords() {
    const coords = [];

    for (const item in this.data) {
      coords.push({
        coords: item.split('_'),
        total: this.data[item].length,
      });
    }

    return coords;
  }

  // метод вызова списка отзывов по координатам
  getByCoords(coords) {
    this.validateCoords(coords);
    const index = this.getIndex(coords);
    return this.data[index] || [];
  }

  updateStorage() {
    fs.writeFile(dataPath, JSON.stringify(this.data), () => {});
  }
}

module.exports = Storage;
