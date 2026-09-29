/*
 * FAZO — все данные страницы.
 * Меняете тексты, ссылки, часы, отзывы — правьте только этот файл.
 * Плейсхолдеры в текстах: {open}, {close}, {count}.
 */
window.FAZO_CONFIG = {
  defaultLang: "ru",

  // Ссылки
  telegramCatalog: "https://t.me/fazotashkent",
  telegramManager: "https://t.me/fazo_tashkent",
  instagram: "https://www.instagram.com/fazotashkent/",

  // Телефон: как показывать. Ссылка tel: собирается автоматически из цифр.
  phone: "+998 88 355 55 53",

  // Адрес сайта (с / на конце). Используется в разметке schema.org.
  // При смене домена поправьте и og:url / og:image / twitter:image в index.html.
  siteUrl: "https://fazotashkent.github.io/",

  // Карты: ссылки ведут на карточку компании (адрес, часы, отзывы, маршрут).
  maps: {
    yandex: "https://yandex.uz/maps/org/fazo_flowers_boutique_more/52980724132/",
    google: "https://www.google.com/maps/search/?api=1&query=FAZO%20Flower%20Boutique%20%26%20More&query_place_id=ChIJl9UhF8v1rjgRJVPgtIe-06c",
    // ID организации в Яндекс Картах (число из ссылки выше) — для встроенной карты
    yandexOrgId: "52980724132"
  },

  // Координаты точки (широта, долгота): центр встроенной карты и разметка для поисковиков.
  coords: { lat: 41.308557, lng: 69.290481 },

  // Часы работы (время Ташкента). Если close меньше open — закрытие после полуночи.
  hours: { open: "09:00", close: "01:00", timezone: "Asia/Tashkent" },

  // Рейтинг на Яндекс Картах
  rating: {
    value: "5,0",
    count: 108,
    url: "https://yandex.uz/maps/org/fazo_flowers_boutique_more/52980724132/reviews/"
  },

  // Отзывы показываются на языке оригинала в обеих версиях.
  // Пустой массив [] — карточки скрываются, заголовок и кнопка «Все отзывы» остаются.
  reviews: [
    {
      name: "Бакытбек И.",
      text: "Это самый невероятно красивый букет, и красота не только в букете, а в людях, которые причастны к его созданию. Безмерно благодарны, что выручили нас этим букетом под закрытие, вы сделали нас всех счастливыми! Всем рекомендуем! Лучшие цветы"
    },
    {
      name: "Balzhan Toleuova",
      text: "Боже мой!!! Я просто была в восторге!! Такая уютная атмосфера, оформление и дизайн очень особенный, чувствуется любовь к своему делу!"
    },
    {
      name: "Георгий Филиппов",
      text: "Цветочный бутик с большой буквы! Дизайнерский подход к оформлению букета, высший класс, говорю как искушённый клиент. Если хотите не просто цветы, а настоящее произведение искусства — рекомендую."
    }
  ],

  // Аналитика: пустая строка — счётчик не подключается.
  analytics: {
    yandexMetrikaId: "",
    ga4Id: ""
  },

  // Данные для разметки schema.org (поисковики)
  seo: {
    name: "FAZO Flowers boutique & More",
    streetAddress: "ул. Махтумкули, 48",
    addressLocality: "Tashkent",
    addressCountry: "UZ"
  },

  // Тексты. UZ — латиницей.
  i18n: {
    ru: {
      pageTitle: "FAZO — цветочный бутик в Ташкенте",
      pageDescription: "FAZO — премиальный цветочный бутик в Ташкенте. Каталог букетов в Telegram, заказ у менеджера, доставка. Ежедневно 09:00–01:00.",
      tagline: "Flowers boutique & More",
      subtitle: "Премиальный цветочный бутик · Ташкент",
      statusOpen: "Открыто сейчас · до {close}",
      statusClosed: "Сейчас закрыто · откроемся в {open}",
      catalogTitle: "Каталог букетов",
      catalogSub: "Новинки каждый день",
      managerTitle: "Написать менеджеру",
      managerSub: "Заказ букета и консультация",
      callTitle: "Позвонить",
      findTitle: "Как нас найти",
      address: "Ташкент, Мирзо-Улугбекский р-н, ул. Махтумкули, 48",
      hours: "Ежедневно {open}–{close}",
      mapsYandex: "Яндекс Карты",
      mapsGoogle: "Google Maps",
      mapShow: "Показать карту",
      mapFrameTitle: "Карта: FAZO на Яндекс Картах",
      reviewsTitle: "Отзывы",
      // Русский: формы для 1 / 2–4 / 5+ (1 оценка, 3 оценки, 108 оценок)
      reviewsCount: ["{count} оценка на Яндекс Картах", "{count} оценки на Яндекс Картах", "{count} оценок на Яндекс Картах"],
      reviewsSource: "Яндекс Карты",
      reviewsAll: "Все отзывы на Яндекс Картах",
      reviewsListLabel: "Отзывы клиентов",
      ratingLabel: "Рейтинг {value} из 5",
      share: "Поделиться ссылкой",
      copied: "Ссылка скопирована",
      langGroup: "Язык сайта",
      langRu: "RU — русский язык",
      langUz: "UZ — узбекский язык"
    },
    uz: {
      pageTitle: "FAZO — Toshkentdagi gul butigi",
      pageDescription: "FAZO — Toshkentdagi premium gul butigi. Telegramda guldastalar katalogi, menejer orqali buyurtma. Har kuni 09:00–01:00.",
      tagline: "Flowers boutique & More",
      subtitle: "Premium gul butigi · Toshkent",
      statusOpen: "Hozir ochiq · {close} gacha",
      statusClosed: "Hozir yopiq · {open} da ochiladi",
      catalogTitle: "Guldastalar katalogi",
      catalogSub: "Har kuni yangi guldastalar",
      managerTitle: "Menejerga yozish",
      managerSub: "Buyurtma va maslahat",
      callTitle: "Qo‘ng‘iroq qilish",
      findTitle: "Bizni qanday topish mumkin",
      address: "Toshkent, Mirzo Ulug‘bek tumani, Maxtumquli ko‘chasi, 48",
      hours: "Har kuni {open}–{close}",
      mapsYandex: "Yandex Xaritalar",
      mapsGoogle: "Google Maps",
      mapShow: "Xaritani ko‘rsatish",
      mapFrameTitle: "Xarita: FAZO Yandex Xaritalarda",
      reviewsTitle: "Mijozlar fikri",
      reviewsCount: "Yandex Xaritalarda {count} ta baho",
      reviewsSource: "Yandex Xaritalar",
      reviewsAll: "Barcha sharhlar Yandex Xaritalarda",
      reviewsListLabel: "Mijozlar sharhlari",
      ratingLabel: "Reyting: 5 dan {value}",
      share: "Havolani ulashish",
      copied: "Havola nusxalandi",
      langGroup: "Sayt tili",
      langRu: "RU — rus tili",
      langUz: "UZ — o‘zbek tili"
    }
  }
};
