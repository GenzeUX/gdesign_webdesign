export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  caption: string;
}
export interface Project {
  slug: string;
  name: string;
  category: string;
  summary: string;
  task: string;
  solution: string;
  results: string[];
  source: string;
  cover: number;
  images: ProjectImage[];
}
function image(slug: string, index: number, height: number, caption: string): ProjectImage {
  return { src: `/images/projects/${slug}/${index}.webp`, width: 800, height, caption };
}
const source = (id: number) => `https://t.me/portfolio_sites_gen_design/${id}`;

export const projects: Project[] = [
  {
    slug: 'gildiya-stroiteley-sibiri', name: 'Гильдия Строителей Сибири',
    category: 'Ремонт квартир',
    summary: 'Бренд и сайт для компании, которая раньше находила клиентов по рекомендациям.',
    task: 'Создать сайт с нуля и показать принципы компании через её визуальный образ. До проекта клиенты приходили по рекомендациям, а компания получала 1–2 заявки в месяц.',
    solution: 'Пересобрали бренд компании, разработали индивидуальный дизайн и понятную структуру сайта. Объединили услуги и обращение в компанию в одном пользовательском сценарии.',
    results: ['Готовый сайт для дальнейшего продвижения.', 'Появился ещё один канал привлечения клиентов — обращения через сайт.', 'Количество заявок выросло с 1–2 до 10 в месяц.'],
    source: source(4), cover: 0,
    images: [image('gildiya-stroiteley-sibiri', 1, 402, 'Первый экран сайта Гильдии Строителей Сибири')],
  },
  {
    slug: 'technics', name: 'Техникс', category: 'Модульные дома',
    summary: 'Новый первый экран и фирменный стиль для производителя модульных домов.',
    task: 'Сделать сайт выразительнее и связать его содержание с запросами целевой аудитории. Исходные тексты и цветовые решения не помогали выделить продукт.',
    solution: 'Переработали первый экран, показали решение задачи покупателя и собрали фирменный стиль сайта на основе цвета бренда.',
    results: ['Дизайн обновлён до современного уровня.', 'У компании появился узнаваемый визуальный образ сайта.'],
    source: source(5), cover: 1,
    images: [image('technics', 1, 330, 'Исходный вариант сайта'), image('technics', 2, 466, 'Новый первый экран Техникс')],
  },
  {
    slug: 'fathers-scandic', name: 'Father’s Scandic', category: 'Загородные дома',
    summary: 'Редизайн, продающая структура и запуск рекламы для строительной компании.',
    task: 'Превратить информационный сайт в инструмент продаж. Цены были малозаметны, дизайн устарел, а реклама не была подключена.',
    solution: 'Выделили цены, пересобрали структуру, обновили дизайн и брендинг компании. Подключили рекламу.',
    results: ['За два месяца число заявок выросло с 10 до 30.', 'За тот же период число клиентов выросло с 1 до 3.', 'Средняя конверсия сайта составила 2,5%.'],
    source: source(7), cover: 1,
    images: [image('fathers-scandic', 1, 629, 'Исходный вариант сайта'), image('fathers-scandic', 2, 563, 'Обновлённый дизайн Father’s Scandic')],
  },
  {
    slug: 'sk-alfa', name: 'СК-АЛЬФА', category: 'Премиальное строительство',
    summary: 'Позиционирование строительной компании через дизайн и удобную навигацию.',
    task: 'Передать премиальный характер компании и упростить путь пользователя. Первый экран не привлекал внимание, а навигация по сайту отсутствовала.',
    solution: 'Создали новый первый экран, добавили навигацию и закрепили шапку при прокрутке. Визуально подчеркнули позиционирование компании в премиальном сегменте.',
    results: ['Пользователям стало легче находить нужную информацию.', 'Сформирован визуальный образ премиальной строительной компании.', 'В кейсе отмечен рост количества заявок.'],
    source: source(10), cover: 1,
    images: [image('sk-alfa', 1, 330, 'Исходный вариант сайта'), image('sk-alfa', 2, 533, 'Новый первый экран СК-АЛЬФА')],
  },
  {
    slug: 'svoboda-development', name: 'Svoboda Development', category: 'Девелопмент и коттеджные посёлки',
    summary: 'Редизайн основного сайта и продолжение работы над двумя коттеджными посёлками.',
    task: 'Создать понятный путь к заявке и обновить визуальный образ компании. Структура и цветовая палитра исходного сайта не поддерживали её позиционирование.',
    solution: 'Пересобрали структуру и воронку, добавили предложения, которые раскрывают продукт, и обновили дизайн. Затем выполнили редизайн сайтов SVOBODA VILLAGE и «Хризолитовый».',
    results: ['Сформирован деловой образ компании в строительной сфере.', 'В кейсе отмечен рост узнаваемости и конверсии заявок в продажи.', 'Сотрудничество продолжилось на двух дополнительных сайтах коттеджных посёлков.'],
    source: source(14), cover: 1,
    images: [image('svoboda-development', 1, 402, 'Исходный сайт Svoboda Development'), image('svoboda-development', 2, 467, 'Редизайн основного сайта'), image('svoboda-development', 3, 401, 'Сайт коттеджного посёлка SVOBODA VILLAGE'), image('svoboda-development', 4, 404, 'Сайт коттеджного посёлка «Хризолитовый»')],
  },
  {
    slug: 'karkasvl', name: 'KarkasVL', category: 'Каркасные дома',
    summary: 'Редизайн и тексты на основе анализа аудитории для строительной компании.',
    task: 'Сделать презентацию продукта убедительнее и адресовать тексты основной аудитории компании.',
    solution: 'Выполнили редизайн, переписали тексты на основе анализа целевой аудитории и встроили в структуру сайта воронку продаж.',
    results: ['Средний чек на продукт вырос с 10 до 13 млн рублей.', 'Конверсия заявок в продажи выросла с 10% до 18%.', 'Компания стала получать в среднем на 5 заявок больше в месяц.'],
    source: source(18), cover: 1,
    images: [image('karkasvl', 1, 471, 'Исходный вариант сайта'), image('karkasvl', 2, 453, 'Обновлённый сайт KarkasVL')],
  },
  {
    slug: 'stonebridge', name: 'Stone Bridge estate', category: 'Агентство недвижимости',
    summary: 'Визуальный стиль и сайт с выбором объектов недвижимости.',
    task: 'Создать единую стилистику, логотип и сайт для агентства недвижимости. Объединить взаимодействие покупателей с предложениями компании.',
    solution: 'Разработали общий стиль компании и сайт, на котором покупатели могут выбирать объекты разных категорий.',
    results: ['У компании появилась единая визуальная стилистика, отражающая её ценности.', 'Создана платформа для выбора недвижимости, через которую уже поступают обращения.'],
    source: source(20), cover: 0,
    images: [image('stonebridge', 1, 404, 'Сайт Stone Bridge estate с категориями недвижимости')],
  },
  {
    slug: 'dovod', name: 'DOVOD', category: 'Дизайн и ремонт квартир',
    summary: 'Дизайн, индивидуальные функции, скорость загрузки и SEO для сервиса ремонта.',
    task: 'Обновить простой дизайн, точнее раскрыть потребности аудитории в текстах и подготовить сайт к поисковому продвижению.',
    solution: 'Совместно с командой разработали дизайн и индивидуальные функции с нуля. Оптимизировали скорость загрузки и выполнили SEO-оптимизацию.',
    results: ['В кейсе отмечен рост просмотров сайта.', 'Улучшены позиции в поиске.', 'Выросла конверсия заявок в продажи.'],
    source: source(21), cover: 1,
    images: [image('dovod', 1, 365, 'Исходный вариант сайта'), image('dovod', 2, 404, 'Обновлённый сайт DOVOD')],
  },
];

export const featuredProjects = ['stonebridge', 'svoboda-development', 'gildiya-stroiteley-sibiri']
  .map((slug) => projects.find((project) => project.slug === slug)!);

// Restored derivatives are labeled separately; the untouched images above remain public.
export const restoredPreviews: Record<string, ProjectImage> = {
  technics: { src: '/images/projects/technics/restored-preview.webp', width: 1644, height: 957, caption: 'Техникс — превью сайта' },
  'svoboda-development': { src: '/images/projects/svoboda-development/restored-preview.webp', width: 1642, height: 958, caption: 'Svoboda Development — превью сайта' },
  karkasvl: { src: '/images/projects/karkasvl/restored-preview.webp', width: 1668, height: 943, caption: 'KarkasVL — превью сайта' },
  dovod: { src: '/images/projects/dovod/restored-preview.webp', width: 1765, height: 891, caption: 'DOVOD — превью сайта' },
  stonebridge: { src: '/images/projects/stonebridge/restored-preview.webp', width: 1764, height: 892, caption: 'Stone Bridge estate — превью сайта' },
  'gildiya-stroiteley-sibiri': { src: '/images/projects/gildiya-stroiteley-sibiri/restored-preview.webp', width: 1770, height: 889, caption: 'Гильдия Строителей Сибири — превью сайта' },
  'fathers-scandic': { src: '/images/projects/fathers-scandic/restored-preview.webp', width: 1495, height: 1052, caption: 'Father’s Scandic — превью сайта' },
  'sk-alfa': { src: '/images/projects/sk-alfa/restored-preview.webp', width: 1536, height: 1024, caption: 'СК-АЛЬФА — превью сайта' },
};
export function projectCover(project: Project) {
  return restoredPreviews[project.slug] || project.images[project.cover];
}
