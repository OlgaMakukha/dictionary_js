const engWord = document.getElementById('eng');
const rusWord = document.getElementById('rus');
const addButton = document.getElementById('add-word-btn');
const translateBtn = document.getElementById('translate-btn');
const sortBtn = document.getElementById('sort-btn');
const message = document.getElementById('message-text');
const inputs = document.getElementsByClassName('input');
const table = document.getElementById('table');
const wordsCount = document.getElementById('word-count');
let isAlphabeticalOrder = false;
let words = {};

const sortWords = (words) => {
    return Object.keys(words).sort().reduce((sortedWords, key) => {
        sortedWords[key] = words[key];
        return sortedWords;
    }, {});
};

const updateWordCount = () => {
    const wordCount = Object.keys(words).length;
    wordsCount.textContent = wordCount;
}

const initDictionary = () => {
    const dictionary = localStorage.getItem('words');
    if (dictionary) {
        words = JSON.parse(dictionary);
    }

    for (let word in words) {
        if (words.hasOwnProperty(word)) {
            addWordToTable(word, words[word].join(', '));
        }
    }
    addEventDelete();
    updateWordCount();
}

const flashWords = () => {
    localStorage.setItem('words', JSON.stringify(words));
}

addButton.addEventListener('click', () => {
    message.innerHTML = '';

    if (engWord.value.trim().length === 0 || rusWord.value.trim().length === 0 || !isNaN(engWord.value) || !isNaN(rusWord.value)) {
        Array.from(inputs).forEach((input) => input.classList.add('error'));
    } else {
        Array.from(inputs).forEach((input) => input.classList.remove('error'));
        const eng = engWord.value.trim();
        const rus = rusWord.value.trim();

        if (!words[eng]) {
            words[eng] = [rus];
            addWordToTable(eng, rus);
            flashWords();
            updateWordCount();
        } else if (words[eng] && !words[eng].includes(rus)) {
            words[eng].push(rus);
            updateWordInTable(eng, words[eng].join(', '));
            flashWords();
            updateWordCount();
        } else {
            message.innerHTML = 'Такой перевод для этого слова уже существует';
        }
        engWord.value = '';
        rusWord.value = '';
    }
});

const addWordToTable = (eng, rus) => {
    table.insertAdjacentHTML('beforeend', `
        <tr class="tr" data-eng="${eng}">
            <td class="eng-word">${eng}</td>
            <td class="rus-word">${rus}</td>
            <td class="button">
                <button class="btn-delete"></button>
            </td>
        </tr>
    `);
}

const updateWordInTable = (eng, rus) => {
    const existingRow = table.querySelector(`tr[data-eng="${eng}"]`);
    if (existingRow) {
        existingRow.querySelector('.rus-word').textContent = rus;
    }
}

const deleteWord = (word) => {
    if (words[word]) {
        delete words[word];
        flashWords();
        updateWordCount();
    }
}

const addEventDelete = () => {
    table.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-delete')) {
            const row = event.target.closest('tr');
            const engCell = row.querySelector('.eng-word');
            deleteWord(engCell.textContent);
            row.remove();
        }
    });
}

const translateWord = () => {
    const engWordToTranslate = engWord.value.trim();
    if (words[engWordToTranslate]) {
        rusWord.value = words[engWordToTranslate].join(', ');
        message.innerHTML = '';
    } else {
        rusWord.value = '';
        message.innerHTML = 'Перевод для этого слова не найден в словаре';
    }
}
translateBtn.addEventListener('click', translateWord);

sortBtn.addEventListener('click', () => {
    isAlphabeticalOrder = !isAlphabeticalOrder;
    table.innerHTML = '';
    const wordsToDisplay = isAlphabeticalOrder ? sortWords(words) : words;

    for (let word in wordsToDisplay) {
        if (wordsToDisplay.hasOwnProperty(word)) {
            addWordToTable(word, wordsToDisplay[word].join(', '));
        }
    }
    sortBtn.textContent = isAlphabeticalOrder ? 'В разбросс' : 'По алфавиту';
});

const clearErrorMessage = () => {
    message.innerHTML = '';
};

engWord.addEventListener('input', clearErrorMessage);
rusWord.addEventListener('input', clearErrorMessage);

initDictionary();