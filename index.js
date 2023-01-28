window.addEventListener('DOMContentLoaded', function () {
    let elements = document.querySelectorAll('input');
    for (let e of elements) {
        updateInput(e);
    }
})

function updateInput(dom) {
    let name = dom.getAttribute('data-pc-target-name');
    let parameter = dom.getAttribute('data-pc-parameter');
    let placeholder = document.querySelector(`#${name}_placeholder`);
    let picon = placeholder.querySelector('i');
    picon.setAttribute(`data-pc-${parameter}`, dom.value);
    loadPiconTags(picon);

    let picon_clone = picon.cloneNode();
    picon_clone.removeAttribute('id');
    let result = picon_clone.outerHTML.match(/<i.*?>/gi);
    let str = result[0];
    str = str.replace('=""', '');
    str += '</i>';
    document.querySelector(`#${name}_code`).innerText = str;
    document.querySelector(`#${name}_svg`).innerText = picon.innerHTML;
}