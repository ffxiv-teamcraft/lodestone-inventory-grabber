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

try {
    const allItemNames = Array.from(document.getElementsByClassName('item-list__list sys_item_row'))
        .map(el => {
            return {
                name: el.childNodes[3].childNodes[1].innerText,
                amount: +el.dataset.stack,
            }
        });

    let langFromUrl = /(fr|na|de|jp|eu).finalfantasyxiv.com/.exec(window.location.href)[1];

    const lang = {
        'fr': 'fr',
        'na': 'en',
        'eu': 'en',
        'jp': 'ja',
        'de': 'de'
    }[langFromUrl];

    fetch(chrome.runtime.getURL('data/items.json'))
        .then((response) => response.json())
        .then(items => {
            const allIds = allItemNames.map(item => {
                const id = Object.keys(items)
                    .find(key => items[key][lang].trim().toLowerCase() === item.name.trim().toLowerCase());
                return {
                    ...item,
                    id: +id
                };
            });
            copyToClipboard(JSON.stringify(allIds));
            alert('Inventory copied inside your clipboard');
        });
} catch (_) {
    alert('Please click this extension only when you\'re inside retainer\'s inventory page (https://finalfantasyxiv.com/lodestone/character/.../retainer/.../baggage)');
}

