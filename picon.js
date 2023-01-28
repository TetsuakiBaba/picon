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
        show_value: false,
    },
    calendar: {
        text: '25',
    },
    badge: {
        text: 'XR',
    },
    circle: {
        text: '神'
    },
    arrow: {
        angle: 0,
        surround: 'none',
        type: 'normal',
    }
}
class picon {
    constructor(dom_key, name, options = {}) {
        let element = document.querySelector(dom_key);
        this.fontsize = parseInt(window.getComputedStyle(element).getPropertyValue('font-size'));
        this.color = window.getComputedStyle(element).getPropertyValue('color');
        this.size = {}
        this.size.w = this.fontsize;
        this.size.h = this.fontsize;
        this.line_width = this.fontsize * 0.1;

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
                if (typeof options.battery.show_value === 'undefined') options.battery.show_value = picon_defaults.battery.show_value;
            }
            this.createSVGbattery(dom_key, options);
        }
        else if (name === 'calendar') {
            if (typeof options.calendar != 'undefined') {
                if (typeof options.calendar.text === 'undefined') options.calendar.text = picon_defaults.calendar.text;
            }
            this.createSVGCalendar(dom_key, options);
        }
        else if (name === 'badge') {
            if (typeof options.badge != 'undefined') {
                if (typeof options.badge.text === 'undefined') options.badge.text = picon_defaults.badge.text;
            }
            this.createSVGBadge(dom_key, options);
        }
        else if (name === 'circle') {
            if (typeof options.circle != 'undefined') {
                if (typeof options.circle.text === 'undefined') options.circle.text = picon_defaults.circle.text;
            }
            this.createSVGCircle(dom_key, options);
        }
        else if (name === 'arrow') {
            if (typeof options.arrow != 'undefined') {
                if (typeof options.arrow.angle === 'undefined') options.arrow.angle = picon_defaults.arrow.angle;
            }
            this.createSVGArrow(dom_key, options);
        }
    }

    createSVGClock(dom_key, options = {}) {
        let h_length = this.size.w * 0.18;
        let m_length = this.size.w * 0.27;
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
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        this.ellipse(this.size.w / 2, this.size.h / 2,
            this.size.w / 2 - this.line_width / 2, this.size.h / 2 - this.line_width / 2);
        this.line(this.size.w / 2,
            this.size.h / 2,
            this.size.w / 2 + clock.h.x,
            this.size.h / 2 + clock.h.y)
        this.line(
            this.size.w / 2,
            this.size.h / 2,
            this.size.w / 2 + clock.m.x,
            this.size.h / 2 + clock.m.y)
    }
    createSVGbattery(dom_key, options = {}) {
        let percentage = parseInt(options.battery.percentage) / 100;
        if (percentage < 0.0) percentage = 0.0;
        if (percentage > 1.0) percentage = 1.0;

        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));

        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        // frame of battery
        this.rect(this.line_width * 0.5, this.size.h * 0.25,
            this.size.w - this.line_width * 1.5, 0.5 * this.size.h);

        // value of battery
        this.rect(this.line_width, this.size.h * 0.25,
            (this.size.w - this.line_width * 2.5) * percentage, 0.5 * this.size.h, { fill: this.color, stroke_width: 0.5, rx: 0, ry: 0 })

        // +
        this.line(this.size.w - this.line_width * 0.5, this.size.h * 0.42,
            this.size.w - this.line_width * 0.5, this.size.h * 0.58);
        if (options.battery.show_value) {
            this.text(options.battery.percentage, this.size.w / 2, this.size.h * 0.68,
                { color: '#777777' }
            );
        }
    }
    createSVGCalendar(dom_key, options = {}) {
        let text = options.calendar.text;

        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';

        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));

        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        this.rect(
            this.line_width * 0.5, this.line_width * 1.0,
            this.size.w - this.line_width, this.size.h - this.line_width * 1.5
        );

        this.rect(
            this.line_width * 0.5, this.line_width * 1.0,
            this.size.w - this.line_width, this.line_width * 1.5
        );

        this.line(this.size.w * 0.25,
            this.line_width * 1.0,
            this.size.w * 0.25,
            this.line_width * 0.5);
        this.line(this.size.w * 0.75,
            this.line_width * 1.0,
            this.size.w * 0.75,
            this.line_width * 0.5);

        this.text(text, this.size.w / 2, this.size.h * 0.78)
    }

    createSVGBadge(dom_key, options = {}) {

        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        this.rect(this.line_width * 0.5, this.size.h * 0.2,
            this.size.w - this.line_width * 1.0, 0.6 * this.size.h);
        this.text(options.badge.text, this.size.w / 2, this.size.h * 0.68);
    }

    createSVGCircle(dom_key, options = {}) {

        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });
        this.ellipse(
            this.size.w / 2, this.size.h / 2,
            (this.size.w - this.line_width) / 2, (this.size.h - this.line_width) / 2
        );
        this.text(options.circle.text, this.size.w / 2, this.size.h * 0.68)
    }
    createSVGArrow(dom_key, options = {}) {

        let angle = -1 * parseFloat(options.arrow.angle);
        let r = this.size.w * 0.5 - this.line_width * 2;
        let l = r; // length of arrow 
        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';
        this.svg = addSVGElement(this.size.w, this.size.h, document.querySelector(dom_key));
        // debug red frame
        //this.rect(0, 0, this.size.w, this.size.h, { stroke: 'red', stroke_width: 1 });

        if (options.arrow.type == 'normal') {
            this.line(this.size.w / 2, this.size.h / 2,
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)))

            this.line(this.size.w / 2, this.size.h / 2,
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) * -1,
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) * -1)

            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(45 + angle))
            )
            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(-45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(-45 + angle))
            )
        }
        else if (options.arrow.type == 'chevron') {
            r *= 0.5;
            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(45 + angle))
            );
            this.line(
                this.size.w / 2 + r * Math.cos(this.d2r(angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)),
                this.size.w / 2 + r * Math.cos(this.d2r(angle)) - l * Math.cos(this.d2r(-45 + angle)),
                this.size.h / 2 + r * Math.sin(this.d2r(angle)) - l * Math.sin(this.d2r(-45 + angle)));
        }


        if (options.arrow.surround == 'none') {

        }
        else if (options.arrow.surround == 'circle') {
            this.ellipse(
                this.size.w / 2, this.size.h / 2,
                (this.size.w - this.line_width) / 2, (this.size.h - this.line_width) / 2
            );
        }
        else if (options.arrow.surround == 'square') {
            this.rect(
                this.line_width * 0.5, this.line_width * 0.5,
                this.size.w - this.line_width, this.size.h - this.line_width
            );
        }
    }

    /**
     * 
     * @param {int} degrees convert degrees to radians
     * @returns 
     */
    d2r(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }

    /**
     * 
     * @param {float} x LEFT point to draw
     * @param {float} y TOP point to draw
     * @param {float} w Width of the rectangle
     * @param {float} h Height of the rectangle
     * @param {object} options stroke_width, stroke, fill, rx, ry
     */
    rect(x, y, w, h,
        options = {
            stroke_width: this.line_width, stroke: this.color,
            fill: "transparent",
            rx: this.line_width, ry: this.line_width
        }) {
        if (typeof options.stroke_width === 'undefined') options.stroke_width = this.line_width;
        if (typeof options.stroke === 'undefined') options.stroke = this.color;
        if (typeof options.fill === 'undefined') options.fill = "transparent";
        if (typeof options.rx === 'undefined') options.rx = this.line_width;
        if (typeof options.ry === 'undefined') options.ry = this.line_width;
        this.svg.innerHTML += `<rect x="${x}" y = "${y}" width="${w}" height="${h}" stroke="${options.stroke}" fill="${options.fill}" stroke-width="${options.stroke_width}" rx="${options.rx}" ry="${options.ry}" />`;
    }
    ellipse(x, y, w, h,
        options = {
            stroke_width: this.line_width, stroke: this.color,
            fill: "transparent",
        }) {
        if (typeof options.stroke_width === 'undefined ') options.stroke_width = this.line_width;
        if (typeof options.stroke === 'undefined ') options.stroke = this.color;
        if (typeof options.fill === 'undefined ') options.fill = "transparent";

        this.svg.innerHTML += `<ellipse cx="${x}" cy = "${y}" stroke="${options.stroke}" fill="${options.fill}" stroke-width="${options.stroke_width}" rx="${w}" ry="${h}" />`;
    }
    line(x1, y1, x2, y2,
        options = {
            stroke_width: this.line_width, stroke: this.color,
            fill: "transparent",
            stroke_linecap: 'round'
        }) {
        this.svg.innerHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"  stroke="${options.stroke}" fill="${options.fill}" stroke-width="${options.stroke_width}" stroke-linecap="${options.stroke_linecap}" />`;
    }
    text(text, x, y,
        options = {
            font_family: 'Helvetica, Arial, san-serif',
            text_anchor: 'middle',
            font_style: 'normal',
            font_weight: '600',
            font_size: this.fontsize * 0.5,
            color: this.color,
        }
    ) {
        if (typeof options.font_family === 'undefined') options.font_family = 'Helvetica, Arial, san-serif';
        if (typeof options.text_anchor === 'undefined') options.text_anchor = 'middle';
        if (typeof options.font_style === 'undefined') options.font_style = 'normal';
        if (typeof options.font_weight === 'undefined') options.font_weight = '600';
        if (typeof options.font_size === 'undefined') options.font_size = this.fontsize * 0.5;
        if (typeof options.color === 'undefined') options.color = this.color;

        this.svg.innerHTML += `<text x="${x}" y="${y}" fill="${options.color}" font-family="${options.font_family}" font-style="${options.font_style}" font-weight=${options.font_weight} text-anchor="${options.text_anchor}" font-size="${options.font_size}">${text}</text>`;
    }

}

function addSVGElement(svg_width, svg_height, element_appended) {
    let element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.setAttribute('version', '1.1');
    element.setAttribute('baseProfile', 'full');
    element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    element.setAttribute('width', `${svg_width}`);
    element.setAttribute('height', `${svg_height}`);
    element.setAttribute('viewbox', `0 0 ${svg_width} ${svg_height}`)
    element_appended.appendChild(element);
    return element;
}


function loadPiconTags(dom_picon) {

    let elements = [];
    if (dom_picon) {
        elements = [dom_picon];
    }
    else {
        elements = document.querySelectorAll('i[data-pc-id]');
    }
    //for (let e of elements = elements.querySelectorAll('[data-pc]');
    // piconタグを見つけた場合は該当箇所にsvgアイコンを挿入
    if (elements.length > 0) {
        let id_count = 0;
        for (let e of elements) {
            const name = e.getAttribute('data-pc-id')
            const fontsize = window.getComputedStyle(e).getPropertyValue('font-size');
            if (dom_picon) e.id = dom_picon.id;
            else e.id = `picon_${id_count}`;
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
                let show_value;
                if ((percentage = e.getAttribute('data-pc-percentage')) == null) { percentage = 80 }
                if ((show_value = Boolean(e.getAttribute('data-pc-show-value'))) == null) { show_value = picon_defaults.battery.show_value }
                new picon(`#${e.id}`, name, {
                    battery: {
                        percentage: percentage,
                        show_value: show_value,
                    }
                });
            }
            else if (name == 'calendar') {
                let text;
                if ((text = e.getAttribute('data-pc-text')) == null) { text = '25' }
                new picon(`#${e.id}`, name, {
                    calendar: {
                        text: text,
                    }
                });
            }
            else if (name == 'badge') {
                let text;
                if ((text = e.getAttribute('data-pc-text')) == null) { text = 'BA' }
                new picon(`#${e.id}`, name, {
                    badge: {
                        text: text,
                    }
                });
            }
            else if (name == 'circle') {
                let text;
                if ((text = e.getAttribute('data-pc-text')) == null) { text = picon_defaults.circle.text }
                new picon(`#${e.id}`, name, {
                    circle: {
                        text: text,
                    }
                });
            }
            else if (name == 'arrow') {
                let angle;
                let type;
                let surround
                if ((angle = e.getAttribute('data-pc-angle')) == null) { angle = picon_defaults.arrow.angle }
                if ((type = e.getAttribute('data-pc-type')) == null) { type = picon_defaults.arrow.type }
                if ((surround = e.getAttribute('data-pc-surround')) == null) { surround = picon_defaults.arrow.surround }
                // if (e.hasAttribute('data-pc-surround')) surround = e.getAttribute('data-pc-surround');
                // else surround = picon_defaults.arrow.surround;
                new picon(`#${e.id}`, name, {
                    arrow: {
                        angle: angle,
                        type: type,
                        surround: surround
                    }
                });
            }

            id_count++;
        }




    }
}
loadPiconTags();