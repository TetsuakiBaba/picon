/**
 * picon
 * 2023(C)Tetsuaki BABA
 */
picon_defaults = {
    clock: {
        hour: 10,
        minute: 10,
    },
    battery: {
        percentage: 80,
    }
}
class picon {
    constructor(dom_key, name, options = {}) {
        let element = document.querySelector(dom_key);
        this.fontsize = window.getComputedStyle(element).getPropertyValue('font-size');
        this.color = window.getComputedStyle(element).getPropertyValue('color');

        if (name === 'clock') {
            // optionが全く定義されていない
            if (typeof options.clock === 'undefined') {
                options.clock = {};
                options.clock.hour = picon_defaults.clock.hour;
                options.clock.minute = picon_defaults.clock.minute;
            }
            // optionが一部でも定義されている
            else {
                if (typeof options.clock.hour === 'undefined') options.clock.hour = picon_defaults.clock.hour;
                if (typeof options.clock.minute === 'undefined') options.clock.minute = picon_defaults.clock.minute;
            }
            this.createSVGClock(dom_key, options);

        }
        else if (name === 'battery') {
            if (typeof options.battery != 'undefined') {
                if (typeof options.battery.percentage === 'undefined') options.battery.percentage = picon_defaults.battery.percentage;
            }
            this.createSVGbattery(dom_key, options);
        }
    }

    createSVGClock(dom_key, options = {}) {
        let svg_width = parseInt(this.fontsize);
        let svg_height = parseInt(this.fontsize);
        let line_width = svg_width * 0.1;
        let h_length = svg_width * 0.18;
        let m_length = svg_width * 0.27;
        let h = options.clock.hour;
        let m = options.clock.minute;
        let clock = {
            h: {
                x: h_length * Math.cos(2 * Math.PI * (((h - 3) % 12) / 12)),
                y: h_length * Math.sin(2 * Math.PI * (((h - 3) % 12) / 12))
            },
            m: {
                x: m_length * Math.cos(2 * Math.PI * (((m - 15) % 60) / 60)),
                y: m_length * Math.sin(2 * Math.PI * (((m - 15) % 60) / 60))
            }
        }

        document.querySelector(`${dom_key}`).innerHTML = '';
        var draw = SVG().addTo(dom_key).size(svg_width, svg_height)
        var rect = draw.ellipse(svg_width * 0.8, 0.8 * svg_height).fill('none').stroke({
            color: `${this.color}`, width: line_width
        }).move(svg_width * 0.1, svg_height * 0.1);
        var line = draw.line(
            svg_width / 2,
            svg_height / 2,
            svg_width / 2 + clock.h.x,
            svg_height / 2 + clock.h.y)
        line.stroke({ color: `${this.color}`, width: line_width, linecap: 'round' });
        var line = draw.line(
            svg_width / 2,
            svg_height / 2,
            svg_width / 2 + clock.m.x,
            svg_height / 2 + clock.m.y)
        line.stroke({ color: `${this.color}`, width: line_width, linecap: 'round' });
    }
    createSVGbattery(dom_key, options = {}) {
        let svg_width = parseInt(this.fontsize);
        let svg_height = parseInt(this.fontsize);
        let line_width = svg_width * 0.1;
        let percentage = parseInt(options.battery.percentage) / 100;

        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';

        var draw = SVG().addTo(dom_key).size(svg_width, svg_height)
        var rect = draw.rect(svg_width - line_width * 2.0, 0.5 * svg_height).fill('none').stroke({
            color: `${this.color}`, width: line_width, linecap: 'round'
        }).move(line_width, svg_height * 0.25).radius(line_width, line_width)

        var rect = draw.rect((svg_width - line_width * 3.0) * percentage, 0.5 * svg_height).fill(`${this.color}`).stroke({
            color: `${this.color}`, width: 0, linecap: 'round'
        }).move(line_width * 1.5, svg_height * 0.25)

        var line = draw.line(
            svg_width - line_width * 0.5,
            svg_height * 0.42,
            svg_width - line_width * 0.5,
            svg_height * 0.58)
        line.stroke({ color: `${this.color}`, width: line_width, linecap: 'round' });
    }
}

function loadpiconTags() {
    let elements = document.querySelectorAll('i[data-pc]');
    //for (let e of elements = elements.querySelectorAll('[data-pc]');
    console.log(elements);
    // piconタグを見つけた場合は該当箇所にsvgアイコンを挿入
    if (elements.length > 0) {
        let id_count = 0;
        for (let e of elements) {
            const name = e.getAttribute('data-pc-name')
            const fontsize = window.getComputedStyle(e).getPropertyValue('font-size');
            e.id = `picon_${id_count}`;
            if (name == 'clock') {
                let hour, minute;
                if ((hour = e.getAttribute('data-pc-hour')) == null) { hour = 10 }
                if ((minute = e.getAttribute('data-pc-minute')) == null) { minute = 10 }
                new picon(`#${e.id}`, name, {
                    clock: {
                        hour: hour,
                        minute: minute,
                    }
                });
            }
            else if (name == 'battery') {
                let percentage;
                if ((percentage = e.getAttribute('data-pc-percentage')) == null) { percentage = 80 }
                new picon(`#${e.id}`, name, {
                    battery: {
                        percentage: percentage,
                    }
                });
            }

            id_count++;
        }
    }
}
loadpiconTags();