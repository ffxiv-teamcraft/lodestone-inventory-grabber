const itemsUrl = chrome.runtime.getURL('data/items.json');

function copyToClipboard(text) {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    document.body.removeChild(input);
}


const allItemNames = Array.from(document.getElementsByClassName('item-list__list sys_item_row'))
    .map(el => {
        return {
            name: el.childNodes[3].childNodes[1].innerText,
            amount: +el.dataset.stack,
        }
    });

let langFromUrl = /(fr|na|de|jp).finalfantasyxiv.com/.exec(window.location.href)[1];

const lang = {
    'fr': 'fr',
    'na': 'en',
    'jp': 'ja',
    'de': 'de'
}[langFromUrl];

fetch(itemsUrl)
    .then((response) => response.json())
    .then(items => {
        const allIds = allItemNames.map(item => {
            return {
                ...item,
                id: +Object.keys(items).find(key => items[key][lang].toLowerCase() === item.name.trim().toLowerCase())
            };
        });
        console.log(allIds);
        copyToClipboard(JSON.stringify(allIds));
    });

