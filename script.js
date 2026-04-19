
let words = [];
let currentIndex = 0;

const card = document.getElementById("card");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const addBtn = document.getElementById("addBtn");
const wordInput = document.getElementById("wordInput");
const meaningInput = document.getElementById("meaningInput");
const wordList = document.getElementById("wordList");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");
const themeToggle = document.getElementById("themeToggle");

function showCard() {
    if (words.length === 0) {
        card.textContent = "単語を追加してね";
        return;
    }
    const item = words[currentIndex];
    card.textContent = item.word;
}

card.addEventListener("click", () => {
    if (words.length === 0) return;

    const item = words[currentIndex];
    if (card.textContent === item.word) {
        card.textContent = item.meaning;
    } else {
        card.textContent = item.word;
    }
});

nextBtn.addEventListener("click", () => {
    if (words.length === 0) return;
    currentIndex = (currentIndex + 1) % words.length;
    showCard();
});

shuffleBtn.addEventListener("click", () => {
    if (words.length === 0) return;
    currentIndex = Math.floor(Math.random() * words.length);
    showCard();
});

deleteAllBtn.addEventListener("click", () => {
    if (!confirm("本当に全部削除しますか？")) return;
    words = [];
    updateList();
    showCard();
});

addBtn.addEventListener("click", () => {
    const word = wordInput.value.trim();
    const meaning = meaningInput.value.trim();

    if (!word || !meaning) return;

    words.push({ word, meaning, learned: false });
    wordInput.value = "";
    meaningInput.value = "";

    updateList();
    showCard();
});

function updateList() {
    wordList.innerHTML = "";

    words.forEach((item, index) => {
        const li = document.createElement("li");

        const meta = document.createElement("div");
        meta.className = "word-meta";
        meta.textContent = `${item.word} - ${item.meaning}`;

        const learnedBtn = document.createElement("span");
        learnedBtn.className = "learned-toggle";
        learnedBtn.textContent = item.learned ? "✔" : "○";
        learnedBtn.addEventListener("click", () => {
            item.learned = !item.learned;
            updateList();
        });

        const deleteBtn = document.createElement("span");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "削除";
        deleteBtn.addEventListener("click", () => {
            words.splice(index, 1);
            updateList();
            showCard();
        });

        li.appendChild(meta);
        li.appendChild(learnedBtn);
        li.appendChild(deleteBtn);
        wordList.appendChild(li);
    });
}

exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(words, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "words.json";
    a.click();
});

importBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        words = JSON.parse(reader.result);
        updateList();
        showCard();
    };
    reader.readAsText(file);
});

let isDark = false;

themeToggle.addEventListener("click", () => {
    isDark = !isDark;
    document.body.classList.toggle("dark");
    themeToggle.textContent = isDark ? "☀" : "🌙";
});

showCard();
updateList();
