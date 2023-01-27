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
        var draw = SVG().addTo(dom_key).size(this.size.w, this.size.h);

        //draw.rect(this.size.w, this.size.h).fill('none').stroke({ color: 'red' })
        draw.ellipse(this.size.w - this.line_width, this.size.h - this.line_width)
            .fill('none')
            .stroke({
                color: `${this.color}`, width: this.line_width
            })
            .move(this.line_width / 2, this.line_width / 2);
        var line = draw.line(
            this.size.w / 2,
            this.size.h / 2,
            this.size.w / 2 + clock.h.x,
            this.size.h / 2 + clock.h.y)
        line.stroke({ color: `${this.color}`, width: this.line_width, linecap: 'round' });
        var line = draw.line(
            this.size.w / 2,
            this.size.h / 2,
            this.size.w / 2 + clock.m.x,
            this.size.h / 2 + clock.m.y)
        line.stroke({ color: `${this.color}`, width: this.line_width, linecap: 'round' });
    }
    createSVGbattery(dom_key, options = {}) {
        let percentage = parseInt(options.battery.percentage) / 100;
        if (percentage < 0.0) percentage = 0.0;
        if (percentage > 1.0) percentage = 1.0;

        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';

        var draw = SVG().addTo(dom_key).size(this.size.w, this.size.h)

        var rect = draw.rect(this.size.w - this.line_width * 2.0, 0.5 * this.size.h).fill('none').stroke({
            color: `${this.color}`, width: this.line_width, linecap: 'round'
        }).move(this.line_width, this.size.h * 0.25).radius(this.line_width, this.line_width)

        var rect = draw.rect((this.size.w - this.line_width * 3.0) * percentage, 0.5 * this.size.h).fill(`${this.color}`).stroke({
            color: `${this.color}`, width: 1, linecap: 'round'
        }).move(this.line_width * 1.5, this.size.h * 0.25)

        var line = draw.line(
            this.size.w - this.line_width * 0.5,
            this.size.h * 0.42,
            this.size.w - this.line_width * 0.5,
            this.size.h * 0.58)
        line.stroke({ color: `${this.color}`, width: this.line_width, linecap: 'round' });

        if (options.battery.show_value) {
            let t = draw.text(options.battery.percentage).fill('#555555');
            t.attr('letter-spacing', '-0.05em');
            t.font({
                family: 'Helvetica, Arial, san-serif',
                size: this.fontsize * 0.5,
                leading: '1em',
                anchor: 'middle',
                style: 'normal',
                weight: '600',
            })
            t.move(this.size.w / 2 - t.length() / 2, this.line_width * 2.2)
        }
    }

    createSVGCalendar(dom_key, options = {}) {
        let text = options.calendar.text;

        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';

        var draw = SVG().addTo(dom_key).size(this.size.w, this.size.h)
        //draw.rect(this.size.w, this.size.h).fill('none').stroke({ color: 'red' })
        var rect = draw.rect(this.size.w - this.line_width, this.size.h - this.line_width - this.line_width * 0.5).fill('none').stroke({
            color: `${this.color}`, width: this.line_width, linecap: 'round'
        }).move(this.line_width * 0.5, this.line_width * 1.0).radius(this.line_width, this.line_width)

        var rect = draw.rect(this.size.w - this.line_width, this.line_width * 1.5).fill('none').stroke({
            color: `${this.color}`, width: this.line_width, linecap: 'round'
        }).move(this.line_width * 0.5, this.line_width * 1.0).radius(this.line_width, this.line_width)

        var line = draw.line(
            this.size.w * 0.25,
            this.line_width * 1.0,
            this.size.w * 0.25,
            this.line_width * 0.5)
        line.stroke({ color: `${this.color}`, width: this.line_width, linecap: 'round' });

        var line = draw.line(
            this.size.w * 0.75,
            this.line_width * 1.0,
            this.size.w * 0.75,
            this.line_width * 0.5)
        line.stroke({ color: `${this.color}`, width: this.line_width, linecap: 'round' });


        let t = draw.text(text);
        t.attr('letter-spacing', '-0.05em');
        t.font({
            family: 'Helvetica, Arial, san-serif',
            size: this.fontsize * 0.6,
            leading: '1em',
            anchor: 'middle',
            style: 'normal',
            weight: '600',
        })
        t.move(this.size.w / 2 - t.length() / 2, this.line_width * 2.5)
        //t.move(this.size.w * 0.23, this.size.h * 0.32);

    }

    createSVGBadge(dom_key, options = {}) {

        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';
        var draw = SVG().addTo(dom_key).size(this.size.w, this.size.h)

        //draw.rect(this.size.w, this.size.h).fill('none').stroke({ color: 'red' })
        var rect = draw.rect(this.size.w - this.line_width * 2.0, 0.6 * this.size.h).fill('none').stroke({
            color: `${this.color}`, width: this.line_width, linecap: 'round'
        }).move(this.line_width, this.size.h * 0.25).radius(this.line_width, this.line_width)

        let t = draw.text(options.badge.text).fill(this.color);
        t.attr('letter-spacing', '-0.05em');
        t.font({
            family: 'Helvetica, Arial, san-serif',
            size: this.fontsize * 0.4,
            leading: '1em',
            anchor: 'middle',
            style: 'normal',
            weight: '600',
        })
        t.move(this.size.w / 2 - t.length() / 2, this.line_width * 3.2)

    }

    createSVGCircle(dom_key, options = {}) {

        // そのままだと追加してしまうので、対象domの中身は一回クリア
        document.querySelector(`${dom_key}`).innerHTML = '';
        var draw = SVG().addTo(dom_key).size(this.size.w, this.size.h)

        //        draw.rect(this.size.w, this.size.h).fill('none').stroke({ color: 'red' })
        draw.ellipse(this.size.w - this.line_width, this.size.h - this.line_width)
            .fill('none')
            .stroke({
                color: `${this.color}`, width: this.line_width
            })
            .move(this.line_width / 2, this.line_width / 2);
        let t = draw.text(options.badge.text).fill(this.color);
        t.attr('letter-spacing', '-0.05em');
        t.font({
            family: 'Helvetica, Arial, san-serif',
            size: this.fontsize * 0.5,
            leading: '1em',
            anchor: 'middle',
            style: 'normal',
            weight: '600',
        })
        t.move(this.size.w / 2 - t.length() / 2, this.line_width * 2.2)

    }

}


function loadPiconTags() {
    let elements = document.querySelectorAll('i[data-pc-id]');
    //for (let e of elements = elements.querySelectorAll('[data-pc]');

    // piconタグを見つけた場合は該当箇所にsvgアイコンを挿入
    if (elements.length > 0) {
        let id_count = 0;
        for (let e of elements) {
            const name = e.getAttribute('data-pc-id')
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
                    badge: {
                        text: text,
                    }
                });
            }

            id_count++;
        }
    }
}
loadPiconTags();