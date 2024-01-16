var picon_list = [
    {
        id: 'clock',
        doms: [
            { name: 'hour', type: 'number', value: picon_defaults.clock.hour },
            { name: 'minute', type: 'number', value: picon_defaults.clock.minute }
        ]
    },
    {
        id: 'battery',
        doms: [
            { name: 'percentage', type: 'number', value: picon_defaults.battery.percentage },
            { name: 'show-value', type: 'select', values: ['false', 'true'] }
        ]
    },
    {
        id: 'calendar',
        doms: [
            { name: 'text', type: 'text', value: picon_defaults.calendar.text }
        ]
    },
    {
        id: 'badge',
        doms: [
            { name: 'text', type: 'text', value: picon_defaults.badge.text }
        ]
    },
    {
        id: 'circle',
        doms: [
            { name: 'text', type: 'text', value: picon_defaults.circle.text }
        ]
    },
    {
        id: 'arrow',
        doms: [
            { name: 'angle', type: 'number', value: picon_defaults.arrow.angle },
            { name: 'type', type: 'select', values: ['normal', 'chevron'] },
            { name: 'surround', type: 'select', values: ['none', 'circle', 'square'] }
        ]
    },
    {
        id: 'filetype',
        doms: [
            { name: 'text', type: 'text', value: picon_defaults.filetype.text }
        ]
    },
    {
        id: 'folder',
        doms: [
            { name: 'text', type: 'text', value: picon_defaults.folder.text }
        ]
    },
    {
        id: 'volume',
        doms: [
            { name: 'value', type: "number", value: picon_defaults.volume.value }
        ]
    },
    {
        id: 'chat',
        doms: [
            { name: 'angle', type: 'number', value: picon_defaults.chat.angle },
            { name: 'text', type: 'text', value: picon_defaults.chat.text },
        ]
    },
    {
        id: 'person',
        doms: [
            { name: 'text', type: 'text', value: picon_defaults.person.text },
            { name: 'size', type: "number", value: picon_defaults.person.size }
        ]
    },
    {
        id: 'compass',
        doms: [
            { name: 'angle', type: 'number', value: picon_defaults.compass.angle }
        ]
    }
]

function createPiconElements() {
    let picons_placeholder = document.querySelector('#picons');
    for (let p of picon_list) {
        let div1 = buildElement('div', '', 'col-md-6 col-lg-4 col-xxl-3 mb-4', '', picons_placeholder);
        let div_card = buildElement('div', '', 'card', '', div1);
        let div2 = buildElement('div', `<h6 class="card-subtitle text-muted">${p.id}</h6>`, 'card-body', '', div_card);
        let div3 = buildElement('div', '', 'text-center', 'font-size:5em', div2);
        div3.id = `${p.id}_placeholder`;

        let i = buildElement('i', '', '', '', div3);
        i.setAttribute(`data-pc-id`, p.id);
        div2.innerHTML += 'parameter(s)';
        let div_row = buildElement('div', '', 'row g-1', '', div2);
        for (let dom of p.doms) {
            let div_col = buildElement('div', '', 'col-md-6', '', div_row);
            let div_form = buildElement('div', '', 'form-floating', '', div_col);
            if (dom.type == 'select') {
                let select = buildElement('select', '', 'form-select', '', div_form);
                select.setAttribute('data-pc-parameter', `${dom.name}`);
                select.setAttribute('data-pc-target-name', `${p.id}`);
                select.value = 'false';
                for (let o of dom.values) {
                    buildElement('option', `${o}`, '', '', select);
                }
                select.options[0].selected = true;
                select.addEventListener('change', function () {
                    updateInput(this);
                })

            }
            else {
                let input = buildElement('input', '', 'form-control', '', div_form);
                input.setAttribute('type', dom.type);
                input.setAttribute('data-pc-target-name', `${p.id}`);
                input.setAttribute('data-pc-parameter', `${dom.name}`);
                input.value = dom.value;
                input.addEventListener('change', function () {
                    updateInput(this);
                })
            }

            buildElement('label', `data-pc-${dom.name}`, '', '', div_form);
        }
        let p1 = buildElement('p', '', 'border card-text small p-2 mt-4 mb-0', '', div2);
        p1.id = `${p.id}_code`;
        let div_grid = buildElement('div', '', 'd-grid mb-4 gap-2 d-md-flex justify-content-md-end', '', div2);
        let button1 = buildElement('button', 'copy', 'btn btn-secondary btn-sm', '', div_grid);
        button1.setAttribute('data-clipboard-target', `#${p.id}_code`)
        button1.id = 'btn-copy';

        let p2 = buildElement('p', '', 'border p-2 m-0', 'font-size:0.5em', div2);
        p2.id = `${p.id}_svg`;
        let div_grid2 = buildElement('div', '', 'd-grid gap-2 d-md-flex justify-content-md-end', '', div2);
        let button2 = buildElement('button', 'copy', 'btn btn-secondary btn-sm', '', div_grid2);
        button2.setAttribute('data-clipboard-target', `#${p.id}_svg`);
        button2.id = `btn-copy`;

        let button3 = buildElement('button', 'download', 'btn btn-secondary btn-sm', '', div_grid2);
        button3.addEventListener('click', function () {
            // p2.id にsvgタグがある
            let content = document.querySelector(`#${p2.id}`).textContent;
            let blob = new Blob([content], { "type": "image/svg+xml" });
            let a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.setAttribute('download', `picon_${p.id}.svg`);
            a.click();
        })


    }

    let es = document.querySelectorAll('#btn-copy');
    for (let element of es) {
        let clipboard = new ClipboardJS(element);
        clipboard.on('success', function (e) {
            const currentLabel = element.innerHTML;

            // Exit label update when already in progress
            if (element.innerHTML === 'Copied!') {
                return;
            }

            // Update button label
            element.innerHTML = 'Copied!';
            element.classList.replace('btn-secondary', 'btn-success');

            // Revert button label after 3 seconds
            setTimeout(function () {
                element.innerHTML = currentLabel;
                element.classList.replace('btn-success', 'btn-secondary');
            }, 3000)
        })
    }

}

window.addEventListener('DOMContentLoaded', function () {
    createPiconElements();

    loadPiconTags();
    let elements = document.querySelectorAll('input');
    for (let e of elements) {
        updateInput(e);
    }

    updateMasonry();
})

function buildElement(name_tag, innerHTML, str_class, str_style, element_appended) {
    let element = document.createElement(name_tag);
    if (innerHTML != '') element.innerHTML = innerHTML;
    if (str_class != '') element.classList = str_class;
    if (str_style != '') element.setAttribute('style', str_style);
    element_appended.appendChild(element);
    return element;
}

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



    updateMasonry();
}

function updateMasonry() {
    var elem_picons = document.querySelector('#picons');
    var msnry_topics = new Masonry(elem_picons, {
        // options
        percentPosition: true,
        originLeft: true,
    });
}