// ==UserScript==
// @name         BB Legacy Edition
// @version      1.1.0
// @description  A small Blacket Legacy object for Windows/Mac users
// @author       VillainsRule
// @match        https://legacy.blacket.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blacket.org
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @grant        none
// ==/UserScript==

let config = {
    username: '',
    password: '',
    autoLogin: true
}

let $ = window.$

if (config.autoLogin) {
    if (location.pathname === '/register/') location.pathname = '/login';
    if (location.pathname === '/login/') {
        setTimeout(() => {
            document.getElementsByClassName('styles__input___eldlc-camelCase')[0].value = config.username;
            document.getElementsByClassName('styles__input___eldlc-camelCase')[1].value = config.password;
            document.getElementsByClassName('styles__button___reD9q-camelCase')[0].click();
        }, 100);
    }
}

document.body.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
        let num = Number.parseInt(prompt('Hello, BB user!\n\nWe have some options for you (ENTER THE NUMBER):\n1. addtokens - add tokens.\n2. baddupes - check Legendary and below dupes\n3. checkdupes - check Chroma and above dupes\n4. github - open the BB github\n5. neededblooks - check Chroma and above missing blooks\n6. sell - sell blooks.\n7. sendtrade - send a trade to a user.\n8. spamboxes - spam open boxes'))
        let func = Object.keys(window.bb).sort()[num - 1]
        window.bb[func]();
    }
})

window.bb = {
    checkdupes: () => {
        const colors = {
            Divine: '#ee82ee',
            Mystical: '#a335ee',
            Perfect: '#fffacd',
            Chroma: '#00ccff'
        }
        for (let i = 0; i <= window.maxID; i++) {
            $.get(`/worker/misc/getblook.php?id=${i}`, (res) => {
                $.get(`/worker/blook/getuserblook.php?blook=${res.split('|')[0].replace(/\s/g, '')}`, (res2) => {
                    if (res.split('|')[1] !== 'Mystical' && res.split('|')[1] !== 'Chroma' && res.split('|')[1] !== 'Perfect' && res.split('|')[1] !== 'Divine') return
                    if (Number.parseInt(res2) === 0) return
                    console.log('%c%s', `color: white; font-size: 25px; text-shadow: 0px 0px 15px ${colors[res.split('|')[1]]}`, `${res2}x ${res.split('|')[0]}`);
                })
            })
        }
    },

    baddupes: () => {
        const colors = {
            Legendary: '#ff910f',
            Epic: '#be0000',
            Rare: '#0a14fa',
            Uncommon: '#4bc22e'
        }
        for (let i = 0; i <= window.maxID; i++) {
            $.get(`/worker/misc/getblook.php?id=${i}`, (res) => {
                $.get(`/worker/blook/getuserblook.php?blook=${res.split('|')[0].replace(/\s/g, '')}`, (res2) => {
                    if (res.split('|')[1] !== 'Legendary' && res.split('|')[1] !== 'Epic' && res.split('|')[1] !== 'Rare' && res.split('|')[1] !== 'Uncommon') return
                    if (Number.parseInt(res2) === 0) return
                    console.log('%c%s', `color: white; font-size: 25px; text-shadow: 0px 0px 15px ${colors[res.split('|')[1]]}`, `${res2}x ${res.split('|')[0]}`);
                })
            })
        }
    },

    neededblooks: () => {
        const colors = {
            Divine: '#ee82ee',
            Mystical: '#a335ee',
            Perfect: '#fffacd',
            Chroma: '#00ccff'
        }
        for (let i = 0; i <= window.maxID; i++) {
            $.get(`/worker/misc/getblook.php?id=${i}`, (res) => {
                $.get(`/worker/blook/getuserblook.php?blook=${res.split('|')[0].replace(/\s/g, '')}`, (res2) => {
                    if (res.split('|')[1] !== 'Mystical' && res.split('|')[1] !== 'Chroma' && res.split('|')[1] !== 'Perfect' && res.split('|')[1] !== 'Divine') return
                    if (Number.parseInt(res2) > 0) return
                    console.log('%c%s', `color: white; font-size: 25px; text-shadow: 0px 0px 15px ${colors[res.split('|')[1]]}`, `${res.split('|')[0]}`);
                })
            })
        }
    },

    github: () => window.open('https://github.com/BlacketWare/Legacy'),

    addtokens: () => {
        setInterval(() => {
            $.post('/worker/box/openbox.php', `box=Add Tokens`);
            console.log('[addTokens.js] Added 2,500 tokens!');
        }, 75);
    },

    spamboxes: () => {
        let i = 0;
        const colors = {
            Divine: '#ee82ee',
            Mystical: '#a335ee',
            Perfect: '#fffacd',
            Chroma: '#00ccff',
            Legendary: '#ff910f',
            Epic: '#be0000',
            Rare: '#0a14fa',
            Uncommon: '#4bc22e'
        }
        let zename = prompt('Which box would you like to open?');
        let amt = Number(prompt(`How many of the ${zename} Box would you like to open?\ntype '*' to unlock all possible with your current tokens.`));
        if (isNaN(amt)) amt = Number.MAX_VALUE

        function buyBox(name) {
            $.post('/worker/box/openbox.php', `box=${name}`, function(data) {
                if (data === 'You\'re being rate limited.') return
                if (data.includes('rate')) i--;
                console.log('%c%s', `color: white; font-size: 25px; text-shadow: 0px 0px 15px ${colors[data.split('|')[1]]}`, `${data.split('|')[0]}`);
                window.document.title = data.split('|')[0]
                try {
                    window.updateTokens();
                } catch {}
            });
        }
        var check = setInterval(() => {
            if (i <= amt) {
                buyBox(zename);
                i++;
            } else {
                clearInterval(check);
                alert('Done buying boxes!\nCheck the Blooks page or the Console for your results.');
            }
        }, 75);
    },

    sendtrade: () => {
        let user = prompt('Enter username...')
        $.get(`/worker/user/viewstats.php?username=${user}`, function(data) {
            if (data === 'NO USER') console.log(`There is no account named ${user}.`);
            else {
                $.post('/worker/trading/starttrade.php', `user2=${user}`, function(data) {
                    if (data === 'CANNOT TRADE WITH SELF') console.log(`You can not trade with yourself.`);
                    else console.log(`Waiting for ${user} to accept.`)
                });
            }
        });
    },

    sell: () => {
        let blookName = prompt('Blook name:');
        let sellAmount = prompt(`Amount of ${blookName} to sell:`)
        var sellValue = document.getElementById('sellOutOf').innerHTML.toString().split('/ ')[1];
        var postData = 'blook=' + blookName + '&amount=' + sellAmount;
        $.post('/worker/blook/sellblook.php', postData, function(data) {
            if (data === 'UNAUTHORIZED') window.location = '/login';
        });
        console.log(`Sold ${sellAmount} ${blookName}!`);
    }
}

setTimeout(() => {
    if (location.pathname === '/blooks/') {
        function sellBlook() {
            var sellValue = document.getElementById('sellOutOf').innerHTML.toString().split('/ ')[1];
            var sellAmount = document.getElementById('sellAmount').value;
            if (parseInt(window.maxSellAmount, 10) <= parseInt(sellAmount, 10) && parseInt(window.maxSellAmount, 10) != parseInt(sellAmount, 10)) return;
            if (0 >= parseInt(sellAmount, 10)) return;
            document.getElementById('sellPopup').style.display = 'none';
            document.getElementById('loaderScreen').style.display = 'block';
            var blookName = document.getElementById('blookName').innerHTML;
            var amount = document.getElementById('sellAmount').value;
            var postData = 'blook=' + blookName + '&amount=' + amount;
            $.post('/worker/blook/sellblook.php', postData, function(data) {
                if (data === 'UNAUTHORIZED') window.location = '/login';
                var previousValue = document.getElementById('blookQuantity').innerHTML;
                var previousValueNoText = previousValue.replace(/\D/g, '');
                var newValue = previousValueNoText - amount;
                document.getElementById('blookQuantity').innerHTML = `Quantity: ${newValue}`;
                document.getElementById('loaderScreen').style.display = 'none';
                var blookNameFixed = blookName.replace(/\s/g, '');
                $.get(`/worker/blook/getuserblook.php?blook=${blookNameFixed}`, function(data) {
                    window.maxSellAmount = data;
                    document.getElementById('blookQuantity').innerHTML = `Quantity: ${data}`;
                    document.getElementById('sellOutOf').innerHTML = `/ ${data}`;
                    if (data > 0) {
                        document.getElementById('sellButton').style.display = 'block';
                        document.getElementById('setAvatarButton').style.display = 'block';
                    } else {
                        document.getElementById('sellButton').style.display = 'none';
                        document.getElementById('setAvatarButton').style.display = 'none';
                    }
                });
            });
            console.log(`Sold ${sellAmount} ${blookName} worth ${Number(sellValue) * Number(sellAmount.toString())}`);
        }
    }
}, 100);
