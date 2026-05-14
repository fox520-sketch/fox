
const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

document.querySelectorAll('.comments').forEach((box) => {
  const site = box.dataset.site;
  const key = `fox-station-comments-${site}`;
  const form = box.querySelector('form');
  const list = box.querySelector('.comment-list');
  const clearButton = box.querySelector('[data-clear]');

  const getComments = () => JSON.parse(localStorage.getItem(key) || '[]');
  const saveComments = (comments) => localStorage.setItem(key, JSON.stringify(comments));

  const render = () => {
    const comments = getComments();
    if (!comments.length) {
      list.innerHTML = '<p class="empty">目前還沒有留言，成為第一個留言的人吧。</p>';
      return;
    }
    list.innerHTML = comments.map((comment) => `
      <article class="comment-item">
        <div class="comment-meta">${escapeHtml(comment.name)} · ${escapeHtml(comment.time)}</div>
        <div>${escapeHtml(comment.message)}</div>
      </article>
    `).join('');
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !message) return;
    const comments = getComments();
    comments.unshift({
      name,
      message,
      time: new Date().toLocaleString('zh-TW')
    });
    saveComments(comments);
    form.reset();
    render();
  });

  clearButton.addEventListener('click', () => {
    if (confirm('確定要清除此網站的所有留言嗎？')) {
      localStorage.removeItem(key);
      render();
    }
  });

  render();
});
