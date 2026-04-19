// 初期データ or localStorage
let words = JSON.parse(localStorage.getItem("words")) || [
  { front: "apple", back: "りんご", learned: false },
  { front: "dog", back: "犬", learned: false },
  { front: "school", back: "学校", learned: false }
];

let index = 0;
let flipped = false;

const card = document.getElementById("card");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const resetAllBtn = document.getElementById("resetAll");
const frontInput = document.getElementById("frontInput");
const backInput = document.getElementById("backInput");
const addBtn = document.getElementById("addBtn");
const wordList = document.getElementById("wordList");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const themeToggle = document.getElementById("themeToggle");

// 保存
function saveWords() {
  localStorage.setItem("words", JSON.stringify(words));
}

// カード表示
function showCard(withAnim = false) {
  if (words.length === 0) {
    card.textContent = "単語がありません";
    return;
  }
  const word = words[index];
  if (withAnim) {
    card.classList.add("flip");
    setTimeout(() => {
      card.textContent = flipped ? word.back : word.front;
      card.classList.remove("flip");
    }, 150);
  } else {
    card.textContent = flipped ? word.back : word.front;
  }
}

// リスト表示
function renderList() {
  wordList.innerHTML = "";
  words.forEach((w, i) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = `${w.front} - ${w.back}`;

    const meta = document.createElement("span");
    meta.className = "word-meta";

    const learnedToggle = document.createElement("span");
    learnedToggle.className = "learned-toggle";
    learnedToggle.textContent = w.learned ? "✅ 覚えた" : "⬜ 未習得";
    learnedToggle.onclick = () => {
      w.learned = !w.learned;
      saveWords();
      renderList();
    };

    const del = document.createElement("span");
    del.className = "delete-btn";
    del.textContent = "削除";
    del.onclick = () => {
      words.splice(i, 1);
      if (index >= words.length) index = 0;
      saveWords();
      renderList();
      showCard();
    };

    meta.appendChild(learnedToggle);
    meta.appendChild(del);

    li.appendChild(text);
    li.appendChild(meta);
    wordList.appendChild(li);
  });
}

// カード反転
card.onclick = () => {
  flipped = !flipped;
  showCard(true);
};

// 次へ（覚えた単語はスキップ）
nextBtn.onclick = () => {
  if (words.length === 0) return;
  let count = 0;
  do {
    index = (index + 1) % words.length;
    count++;
    if (count > words.length) break;
  } while (words[index].learned);
  flipped = false;
  showCard(true);
};

// シャッフル
shuffleBtn.onclick = () => {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  index = 0;
  flipped = false;
  saveWords();
  renderList();
  showCard(true);
};

// 全削除
resetAllBtn.onclick = () => {
  if (!confirm("本当に全ての単語を削除しますか？")) return;
  words = [];
  saveWords();
  renderList();
  showCard();
};

// 追加
addBtn.onclick = () => {
  const f = frontInput.value.trim();
  const b = backInput.value.trim();
  if (!f || !b) return;
  words.push({ front: f, back: b, learned: false });
  frontInput.value = "";
  backInput.value = "";
  saveWords();
  renderList();
  if (words.length === 1) {
    index = 0;
    flipped = false;
    showCard();
  }
};

// エクスポート
exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(words, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "words.json";
  a.click();
  URL.revokeObjectURL(url);
};

// インポート
importInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (Array.isArray(data)) {
        words = data.map(w => ({
          front: w.front,
          back: w.back,
          learned: !!w.learned,
        }));
        saveWords();
        renderList();
        index = 0;
        flipped = false;
        showCard();
      }
    } catch (err) {
      alert("JSONの読み込みに失敗しました");
    }
  };
  reader.readAsText(file);
};

// ダークモード
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

// 初期表示
renderList();
showCard();
