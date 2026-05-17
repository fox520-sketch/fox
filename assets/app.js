
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBO4x73VFAke9X9mEt1I5Sq4IPa9mnrI3M",
  authDomain: "fox-game-home.firebaseapp.com",
  projectId: "fox-game-home",
  storageBucket: "fox-game-home.firebasestorage.app",
  messagingSenderId: "835251030793",
  appId: "1:835251030793:web:10336989458cbc3e0721d8"
};

const DAILY_LIMIT = 5;
const NAME_MAX = 30;
const MESSAGE_MAX = 300;
const ALLOWED_SITES = new Set(["napoleon3", "mqtt-publisher", "iot-dashboard"]);
const TIME_ZONE = "Asia/Taipei";
const THEME_KEY = 'fox-theme';
const DEFAULT_THEME = 'ocean';
const THEMES = [
  ['ocean', '海洋風'],
  ['eye-care', '護眼風'],
  ['e-ink', '電子紙風'],
  ['forest', '森林風'],
  ['grassland', '草原風'],
  ['sakura', '櫻花風'],
  ['twilight', '暮光風'],
  ['moonlight', '月光風']
];

const applyTheme = (theme) => {
  const valid = THEMES.some(([value]) => value === theme) ? theme : DEFAULT_THEME;
  document.documentElement.dataset.theme = valid;
  try { localStorage.setItem(THEME_KEY, valid); } catch {}
  document.querySelectorAll('[data-theme-select]').forEach((select) => {
    if (select.value !== valid) select.value = valid;
  });
  const label = THEMES.find(([value]) => value === valid)?.[1] || '海洋風';
  document.querySelectorAll('[data-theme-current]').forEach((el) => {
    el.textContent = label;
  });
};

const initializeThemeControls = () => {
  document.querySelectorAll('[data-theme-select]').forEach((select) => {
    if (!select.options.length) {
      THEMES.forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        select.appendChild(option);
      });
    }
    select.addEventListener('change', () => applyTheme(select.value));
  });
  let saved = DEFAULT_THEME;
  try { saved = localStorage.getItem(THEME_KEY) || document.documentElement.dataset.theme || DEFAULT_THEME; } catch { saved = document.documentElement.dataset.theme || DEFAULT_THEME; }
  applyTheme(saved);
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const todayKey = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(new Date());

const cleanText = (value, max) => String(value || '')
  .replace(/[<>]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, max);

const setStatus = (box, message, type = 'info') => {
  const status = box.querySelector('.comment-status');
  if (!status) return;
  status.textContent = message;
  status.dataset.type = type;
};

const authReady = new Promise((resolve, reject) => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    try {
      if (user) {
        unsubscribe();
        resolve(user);
        return;
      }
      await signInAnonymously(auth);
    } catch (error) {
      unsubscribe();
      reject(error);
    }
  });
});

const copyText = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {}

  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.left = '-9999px';
  input.style.top = '-9999px';
  document.body.appendChild(input);
  input.focus();
  input.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
  input.remove();
  return ok;
};

initializeThemeControls();

document.querySelectorAll('[data-copy-url]').forEach((button) => {
  button.addEventListener('click', async () => {
    const original = button.textContent;
    const ok = await copyText(button.dataset.copyUrl || '');
    button.textContent = ok ? '已複製' : '複製失敗';
    button.classList.toggle('copied', ok);
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove('copied');
    }, 1600);
  });
});

document.querySelectorAll('.comments').forEach((box) => {
  const site = box.dataset.site;
  if (!ALLOWED_SITES.has(site)) {
    setStatus(box, '這個留言區尚未開放。', 'error');
    return;
  }

  const form = box.querySelector('form');
  const list = box.querySelector('.comment-list');
  const nameInput = form?.querySelector('input[name="name"]');
  const messageInput = form?.querySelector('textarea[name="message"]');
  const submitButton = form?.querySelector('button[type="submit"]');
  const clearButton = box.querySelector('[data-clear]');

  if (!form || !list || !nameInput || !messageInput || !submitButton) return;

  nameInput.maxLength = NAME_MAX;
  messageInput.maxLength = MESSAGE_MAX;

  const renderEmpty = () => {
    list.innerHTML = '<p class="empty">目前還沒有留言，成為第一個留言的人吧。</p>';
  };

  const renderComments = (snapshot) => {
    if (snapshot.empty) {
      renderEmpty();
      return;
    }
    list.innerHTML = snapshot.docs.map((item) => {
      const comment = item.data();
      const created = comment.createdAt?.toDate?.();
      const time = created ? created.toLocaleString('zh-TW', { timeZone: TIME_ZONE }) : '剛剛';
      return `
        <article class="comment-item">
          <div class="comment-meta">${escapeHtml(comment.name)} · ${escapeHtml(time)}</div>
          <div>${escapeHtml(comment.message)}</div>
        </article>
      `;
    }).join('');
  };

  renderEmpty();
  setStatus(box, '正在連線留言板...', 'info');

  authReady
    .then(() => {
      const q = query(
        collection(db, 'sites', site, 'comments'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      onSnapshot(q, renderComments, (error) => {
        console.error(error);
        setStatus(box, '讀取留言失敗，請確認 Firestore 規則與網路連線。', 'error');
      });
      setStatus(box, `所有人可見。每日最多 ${DAILY_LIMIT} 則，名字 ${NAME_MAX} 字內，留言 ${MESSAGE_MAX} 字內。`, 'success');
    })
    .catch((error) => {
      console.error(error);
      setStatus(box, '匿名登入失敗，請確認 Firebase Authentication 已啟用匿名登入。', 'error');
    });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = '送出中...';

    try {
      const user = await authReady;
      const name = cleanText(nameInput.value, NAME_MAX);
      const message = cleanText(messageInput.value, MESSAGE_MAX);
      if (!name || !message) {
        setStatus(box, '請輸入名字與留言內容。', 'error');
        return;
      }

      const day = todayKey();
      const limitId = `${user.uid}_${day}`;
      const limitRef = doc(db, 'sites', site, 'dailyLimits', limitId);
      const commentRef = doc(collection(db, 'sites', site, 'comments'));

      await runTransaction(db, async (transaction) => {
        const limitSnap = await transaction.get(limitRef);
        const currentCount = limitSnap.exists() ? Number(limitSnap.data().count || 0) : 0;
        if (currentCount >= DAILY_LIMIT) {
          throw new Error('DAILY_LIMIT_REACHED');
        }

        transaction.set(limitRef, {
          uid: user.uid,
          day,
          count: currentCount + 1,
          updatedAt: serverTimestamp()
        }, { merge: true });

        transaction.set(commentRef, {
          uid: user.uid,
          name,
          message,
          day,
          limitId,
          createdAt: serverTimestamp()
        });
      });

      form.reset();
      setStatus(box, '留言已送出，所有訪客都可以看到。', 'success');
    } catch (error) {
      console.error(error);
      if (error.message === 'DAILY_LIMIT_REACHED') {
        setStatus(box, `你今天在這個留言區已達 ${DAILY_LIMIT} 則上限。`, 'error');
      } else if (String(error.code || '').includes('permission-denied')) {
        setStatus(box, '留言被安全規則拒絕，請重新貼上並發布新版 firestore.rules。', 'error');
      } else {
        setStatus(box, '留言送出失敗，請稍後再試。', 'error');
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });

  clearButton?.addEventListener('click', () => {
    form.reset();
    setStatus(box, '已清除尚未送出的輸入內容。', 'info');
  });
});
