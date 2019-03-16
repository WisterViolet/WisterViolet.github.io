let age = 17;
let cnt = 1;
let gcomres = [];
let nores = ` is not defined`;
let manyargs = `Too many arguments to `;
let noarg = ` does not exist in the argument of `;
backcnt = 0;

cmdget = async function () {
    const res = await fetch('/static/command.json');
    const rjson = await res.json();
    return rjson;
}
cmdback = function (flag) {
    if (flag === 'ArrowUp' && backcnt < cnt - 1) {
        backcnt++;
    }
    else if (flag === 'ArrowDown' && backcnt > 0) {
        backcnt--;
    }
    if (backcnt > 0) {
        document.getElementById('cmdline').value = gcomres[cnt - backcnt - 1].command;
    }
    else {
        document.getElementById('cmdline').value = '';
    }
}
cmdin = async function () {
    backcnt = 0;
    let com = await cmdget();
    let command = '';
    command = document.getElementById('cmdline').value;
    document.getElementById('cmdline').value = '';
    command = command.replace(/</g, '&lt;');
    command = command.replace(/>/g, '&gt;');
    document.getElementById('cmdline').scrollIntoView(false);
    word = command.split(' ');
    if (com[word[0]]) {
        if (word[0] === 'jump' && word.length === 2) {
            if (com['jump'][word[1]]) {
                if (!com['jump'][word[1]].match(/http/)) {
                    location.href = com['jump'][word[1]];
                }
                else {
                    open(com['jump'][word[1]], '_blank');
                }
            }
            else {
                gcomres.push({ id: cnt++, command: command, res: `Jump point ${word[1]} does not exist` });
            }
        }
        else if (word.length === 1) {
            if (com[word[0]]['res']) {
                gcomres.push({ id: cnt++, command: command, res: com[word[0]]['res'] });
            }
            else {
                let resp = '';
                for (let key of Object.keys(com[word[0]])) {
                    console.log(com[word[0]][key]);
                    resp += com[word[0]][key] + '\n';
                }
                console.log(resp)
                gcomres.push({ id: cnt++, command: command, res: resp });
            }
        }
        else if (word.length >= 3) {
            gcomres.push({ id: cnt++, command: command, res: manyargs + word[0] });
        }
        else {
            if (com[word[0]][word[1]]) {
                gcomres.push({ id: cnt++, command: command, res: com[word[0]][word[1]] });
            }
            else {
                gcomres.push({ id: cnt++, command: command, res: word[1] + noarg + word[0] });
            }
        }
    }
    else {
        gcomres.push({ id: cnt++, command: command, res: word[0] + nores });
    }
}
{
    const version = 'v0.3.0';
    const newday = '2019/01/10';
    Vue.component('start', {
        delimiters: ['[[', ']]'],
        data: function () {
            return {
                vs: version,
                vd: newday,
            }
        },
        template: `<b>Wister's Terminal
                    Version: [[ vs ]]
                    Last Update: [[ vd ]]
                    Type help for command list.</b>`,
    });

    Vue.component('result', {
        props: ["com"],
        template: `<b><span style="color: yellow;">$</span>
                        <span v-html="com.command"></span><br>
                        <span v-html="com.res"></span><br>
                    </b>`
    });

    Vue.component('cmd', {
        template: `<form class="formline" onsubmit="return false;"><!--
                    --><b style="color: yellow;">$</b><!--
                    --><input id="cmdline" autocomplete="off" autofocus v-on:keyup="$emit('cmdroute', $event)" v-on:keyup. type="text"><!--
                    --></form>`
    });

    let app = new Vue({
        el: '#app',
        data: {
            comres: gcomres,

        },
        methods: {
            keyin(event) {
                if (event.key === 'Enter') {
                    cmdin();
                }
                else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    cmdback(event.key);
                }
            },

        },
    });
}