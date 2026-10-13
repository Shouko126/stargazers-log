const list = document.querySelector('#repository-list');
const status = document.querySelector('#status');
const count = document.querySelector('#repository-count');

const formatStars = (stars) => new Intl.NumberFormat('zh-CN', {
  notation: 'compact',
  maximumFractionDigits: 1
}).format(stars);

const formatDate = (date) => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}).format(new Date(`${date}T00:00:00`));

function renderRepository(repository, index) {
  const item = document.createElement('li');
  item.className = 'repository-item';
  item.style.setProperty('--item-index', index);

  const details = document.createElement('div');
  const link = document.createElement('a');
  link.className = 'repository-link';
  link.href = repository.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = repository.repo;

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = repository.description;
  details.append(link, description);

  const metadata = document.createElement('div');
  metadata.className = 'metadata';

  const language = document.createElement('span');
  language.className = 'language';
  language.textContent = repository.language;

  const stars = document.createElement('span');
  stars.textContent = `${formatStars(repository.stars)} stars`;

  const date = document.createElement('time');
  date.dateTime = repository.starred_at;
  date.textContent = formatDate(repository.starred_at);

  metadata.append(language, stars, date);
  item.append(details, metadata);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch('./events.json');
    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new TypeError('仓库记录格式无效');
    }

    list.replaceChildren(...repositories.map(renderRepository));
    count.textContent = `${repositories.length} 个仓库`;
    status.textContent = repositories.length ? '' : '还没有星标记录。';
  } catch (error) {
    count.textContent = '暂不可用';
    status.textContent = '无法加载仓库记录，请通过本地 Web 服务器打开此页面。';
    console.error('Failed to load starred repositories:', error);
  }
}

loadRepositories();