// ==UserScript==
// @name         Betastar Multitool [Official]
// @version      2.0
// @description  A very nice Betastar multitool! Use the ESC button to trigger.
// @author       VillainsRule
// @match        *://betastar.org/*
// @icon         https://betastar.org/favicon.ico
// @grant        none
// ==/UserScript==

/* ====================================================================================

                                    BETATOOL v2.0
                         This is code I would rather forget.
                         It is f***ing horrible. Please use
                         at your own risk. It may not run.

==================================================================================== */

let $ = window.$;
let socket = window.socket;

socket.off('clear')
socket.off('run')
socket.off('announcement')
socket.on('announcement', () => {
    socket.off('announcement')
});
socket.on('run', () => {
    socket.off('run')
});
socket.on('clear', () => {
    socket.off('clear')
});

if (location.pathname === '/chat/') {
    const emojis = {
        skull: '💀',
        smile: '😃',
        smilesweat: '😅',
        troll: '😈',
        rofl: '🤣',
        undersmile: '🙃',
        wink: '😉',
        blush: '😊',
        angel: '😇',
        loveeyes: '😍',
        stareyes: '🤩',
        kiss: '😘',
        crazy: '🤪',
        toungeout: '😜',
        moneyeyes: '🤑',
        hug: '🤗',
        think: '🤔',
        ziplips: '🤐',
        sus: '🤨',
        why: '😑',
        expressionless: '😶',
        sly: '😏',
        eyeroll: '🙄',
        drool: '🤤',
        sleep: '😴',
        mask: '😷',
        puke: '🤢',
        cold: '🥶',
        hot: '🥵',
        deadeyes: '😵',
        mindblown: '🤯',
        party: '🥳',
        cool: '😎',
        nerd: '🤓',
        eyeglass: '🧐',
        sad: '🙁',
        shocked: '😯',
        flushed: '😳',
        worried: '😟',
        puppyeyes: '🥺',
        sob: '😭',
        cry: '😢',
        whew: '😥',
        fear: '😱',
        disappointed: '😞',
        tired: '😫',
        yawn: '🥱',
        pissed: '😤',
        mad: '😡',
        fuck: '🤬',
        evil: '😈',
        villainsrule: '😈',
        poop: '💩',
        clown: '🤡',
        ghost: '👻',
        bot: '🤖',
        100: '💯',
        pow: '💥',
        bomb: '💣',
        text: '💬',
        think: '💭',
        wave: '👋',
        clap: '👏',
        fistbump: '👊',
        handshake: '🤝',
        flex: '💪',
        butt: '🍑',
        food: '🍗',
        burrito: '🌯',
        globe: '🌎',
        map: '🗺'
    }

    let replacers = {
        ...Object.fromEntries(
            Object.entries(emojis).map(
                e => [`:${e[0]}:`, e[1]]
            )
        )
    }

    function sendMessage() {
        var message = document.getElementById('#inputField').value;
        if (message === '') {
            return;
        }
        for (const r of Object.entries(replacers)) {
            message = message.replaceAll(r[0], r[1])
        }
        socket.emit('smes', message);
        document.getElementById('#inputField').value = '';
    }

    socket.on('rmes', (m) => {
        Array.from(document.querySelector('.chatBox').children).forEach(msg => {
            let user = msg.children[1].innerText.split(
                '] '
            )[1].split(' >')[0]
            if (window.getBlockedUsers().includes(user)) {
                msg.remove()
            }
        })
    })
}

// Fix Trade Decline
socket.on('declined', () => {
    function rmvtradedecline() {
        const elements = document.getElementsByClassName('declinedPopup');
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }
    setTimeout(rmvtradedecline, 6000);
});

function claimRewards() {
    $('body').append(`<div class='loadingModal'><img class='loadingAnimation' src='/image/blaxLogo.png'/></div>`);
    $.get(`/api/claim`, function(data) {
        if (data === 'ALREADY CLAIMED') {
            $('body').append(`<div class='errorModal'><div class='errorPopup'><text class='errorText'>Error</text><text class='errorReason'>You have already claimed todays reward.</text><button id='#okayButton' class='okayButton'>Okay</button></div></div>`);
            document.getElementById('#okayButton').addEventListener('click', function() {
                $('.errorModal').remove();
                $('.loadingModal').remove();
            });
            document.getElementById('#okayButton').focus();
            return;
        } else {
            userDataSelf.atoms = userDataSelf.atoms + 750;
            var atomsLocalized = userDataSelf.atoms.toLocaleString();
            document.getElementById('#userAtoms').innerText = `Atoms: ${atomsLocalized}`;
            confetti({
                particleCount: 75,
                spread: 500,
                origin: {
                    y: 0.5
                }
            });
            $('.errorModal').remove();
            $('.loadingModal').remove();
        }
    });
}

if (!localStorage.blockedUsers) {
    localStorage.blockedUsers = JSON.stringify([])
}

function blockuser(name) {
    let json = JSON.parse(localStorage.blockedUsers)
    localStorage.blockedUsers = JSON.stringify(json.concat(name))
}

function unblockuser(name) {
    let json = JSON.parse(localStorage.blockedUsers)
    localStorage.blockedUsers = JSON.stringify(json.filter(value => {
        return value !== name
    }))
}

socket.on('request', (user) => {
    let sentuser = `${user}`;
    if (getBlockedUsers().includes(sentuser)) {
        console.log(sentuser + ' attempted to send a request but was blocked.');
        $('.tradeRequest').remove();
        socket.emit('decline');
    }
});

function chatdl() {
    var text = ``;
    for (var elem of document.getElementsByClassName('chatBox')[0].children) {
        var profile = elem.children[0].src.endsWith('gif') ? 'Owner' : capitalizeFirstLetter(elem.children[0].src.replace('https://betastar.org', '').replace('/image/elements/', '').replace('.png', ''));
        text += `${profile} - ${elem.children[1].textContent.replace(' > ', '')}: ${elem.children[2].textContent}\n`.replace('Https://betastar.org', '');
    }
    downloadFile(`data:application/txt,${encodeURIComponent(text)}`);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function downloadFile(url) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        a.download = `logs-${mm}-${dd}-${yyyy}-${today.getSeconds()}.txt`;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

function seeUserElem() {
    var x = prompt('Whose elements do you want to view?');
    Array.from(document.getElementById('#elementList').children).forEach(a => a.remove())
    $.get('/api/elements?name=' + x, function(data) {
        elementList = JSON.parse(data);
    });
    $.get('/api/user/elements?name=' + x, function(data) {
        if (data === '') {
            document.getElementById('#elementRarity').innerText = 'Common';
            document.getElementById('#elementRarity').style.color = 'white';
            document.getElementById('#elementRarity').style.textShadow = '0px 0px 25px white';
            document.getElementById('#elementImage').src = '/image/elements/blax.png';
            document.getElementById('#elementName').innerText = 'Betastar';
            document.getElementById('#elementPrice').innerText = 'Can\'t be sold.';
            return;
        }
        document.getElementById('#elementRarity').innerText = 'Common';
        document.getElementById('#elementRarity').style.color = 'white';
        document.getElementById('#elementRarity').style.textShadow = '0px 0px 25px white';
        document.getElementById('#elementImage').src = '/image/elements/blax.png';
        document.getElementById('#elementName').innerText = 'Betastar';
        document.getElementById('#elementPrice').innerText = 'Can\'t be sold.';
        userElements = JSON.parse(data);
        if (typeof elementList === 'undefined') {
            reset();
            return;
        }
        Object.entries(userElements).forEach((entry) => {
            const [key, value] = entry;
            if (typeof elementList[key] === 'undefined') {
                $(`<img id='error' src='/image/elements/error.png' onclick='showElementError()' class='bottomElement'>`).appendTo('.elementList');
            } else {
                $(`<img id='${key}' src='${elementList[key].imageURL}' onclick='viewElement('${key}')' class='bottomElement'>`).appendTo('.elementList');
            }
        });
    });
    window.currentElement = 'blax';
    window.currentQuantity = -1;
    $('.loadingModal').remove();
}

function sellAll() {
    $.get('/api/user/elements', function(data) {
        window.userElements = JSON.parse(data)
        Object.keys(elementList).forEach(element => sell(element))
    })

    async function sell(element) {
        var amt = window.userElements[element]
        if (-1 >= amt) return
        $.post(`/api/sell/`, `element=${element}&quantity=${amt}`, function() {
            isNaN(amt) ? '' : console.log(`Sold ${amt} ${element}(s)`);
        })
    }
}

function spoof() {
    Array.from(document.getElementById('#elementList').children).forEach(a => a.remove())
    Object.entries(elementList).forEach((entry) => {
        const [key, value] = entry;
        $(`<img id='${key}' src='${elementList[key].imageURL}' onclick='viewElement('${key}')' class='bottomElement'>`).appendTo('.elementList');
    })
    for (i = 0; i < Object.keys(elementList).length; i++) {
        elemes = Object.keys(elementList)
        userElements[elemes[i]] = Math.floor(elementList[elemes[i]]['chance'] / 2 + Math.round(Math.random() * 20));
    }
}

function sellDupe() {
    $.get('/api/user/elements', function(data) {
        window.userElements = JSON.parse(data)
        Object.keys(elementList).forEach(element => sell(element))
    })

    async function sell(element) {
        var amt = window.userElements[element] - 1
        if (0 >= amt) return
        $.post(`/api/sell/`, `element=${element}&quantity=${amt}`, function() {
            isNaN(amt) ? '' : console.log(`Sold ${amt} ${element}(s)`)
        })
    }
}

function spamCrates() {
    var i = 0;
    var boxes = []
    colors = {
        divine: '#ee82ee',
        mythical: '#a335ee',
        perfect: '#fffacd',
        fabled: '#0c7500',
        legendary: '#ff910f',
        epic: '#be0000',
        rare: '#0a14fa',
        uncommon: '#4bc22e',
        common: '#ffffff'
    }

    var name = prompt('Which crate would you like to open?\n\nOptions:\n' + Object.keys(cratesList).join('\n'));
    if (!Object.keys(cratesList).includes(name)) {
        alert('That crate doesn\'t exist...')
        name = prompt('Which crate would you like to open?\n\nOptions:\n' + Object.keys(cratesList).join('\n'));
    }
    var amt = Number(prompt('How many crates would you like to open?\ntype \'*\' to unlock all you can with your current atoms.'));
    if (isNaN(amt)) amt = Number.MAX_VALUE

    function buyBox() {
        $.post('/api/open/', `crate=${name}`, function(data) {
            try {
                if (data.includes('rate')) i--
                else {
                    rarity = elementList[data]['rarity'].toLowerCase()
                    console.log('%c%s', `color: ${colors[rarity]}; font-size: 25px; text-shadow: 0px 0px 15px ${colors[rarity]};`, `${data}`);
                }
            } catch (e) {
                i = amt
            }
        });
    }
    var check = setInterval(() => {
        if (i < amt) {
            buyBox();
            i++;
        } else {
            clearInterval(check);
            alert('Done buying boxes! Check the console or the Elements page.');
        }
    }, 500);
}

function elemCalc() {
    var wordCount = confirm('Is the element one word?\nOk = yes, Cancel = no\n\nNow works on the Spungle crate!');

    if (wordCount) {
        try {
            let element = prompt('What element are you trying to get?').toLowerCase();
            let amt = prompt('How many crates are you opening?');
            let amount = prompt('How many are you aiming for?');
            let chance = elementList[element]['chance'];
            alert('Press OK to calculate');
            let calculation = chance * amt;
            alert('You have a ' + calculation + '% chance to get at least one ' + element + '. (Press OK to continue)')
            alert('You have a ' + (calculation / amount) + '% chance to get ' + amount + ' ' + element + '.')
        } catch (e) {
            alert('An error (' + e + ') has occurred, you may not have entered the element name properly.')
        }
    } else {
        var spungle = confirm('Is the element from the Spungle crate?\nOk = yes, Cancel = no');
        let twoword = prompt('Enter the element name:').toLowerCase();
        const splitter = twoword.split(' ');
        let twowordfin1st = splitter[0];
        let twowordfin2nd = splitter[1];
        let splitfin = ''
        if (spungle) {} else {
            splitfin = twowordfin2nd.charAt(0).toUpperCase() + twowordfin2nd.slice(1);
        }
        try {
            let element = '';
            if (spungle) {
                element = twowordfin1st + twowordfin2nd;
            } else {
                element = twowordfin1st + splitfin;
            }
            let amt = prompt('How many crates are you opening?');
            let amount = prompt('How many are you aiming for?');
            let chance = elementList[element]['chance'];
            alert('Press OK to calculate');
            let calculation = chance * amt;
            alert('You have a ' + calculation + '% chance to get at least one ' + twoword + '. (Press OK to continue)')
            alert('You have a ' + (calculation / amount) + '% chance to get ' + amount + ' ' + twoword + '.')
        } catch (e) {
            alert('An error (' + e + ') has occurred, you may not have entered the element name properly.');
        }
    }
}

function confetti() {
    let x = prompt('How much confetti?\n\nOptions:\nbite size\nsmall\nmedium\nbig\ncomputer lagging').toLowerCase();
    switch (x) {
        case 'bite size':
            confetti({
                particleCount: 500,
                spread: 500,
                origin: {
                    y: 0.5
                }
            });
            break;
        case 'small':
            confetti({
                particleCount: 2500,
                spread: 500,
                origin: {
                    y: 0.5
                }
            });
            break;
        case 'medium':
            confetti({
                particleCount: 7500,
                spread: 500,
                origin: {
                    y: 0.5
                }
            });
            break;
        case 'big':
            confetti({
                particleCount: 12500,
                spread: 500,
                origin: {
                    y: 0.5
                }
            });
            break;
        case 'computer lagging':
            confetti({
                particleCount: 20000,
                spread: 500,
                origin: {
                    y: 0.5
                }
            });
            break;
        default:
            alert('Size not found!');
    }
}

function viewuser() {
    let x = prompt('Who do you want to look up?');
    $.get(`/api/user?name=` + x, function(data) {
        userData = JSON.parse(data);
        console.log('Viewing \'' + x + '\'!');
        console.log('Atoms: ' + userData.atoms.toLocaleString());
        let elem = userData.element.toString();
        if (!elem.indexOf('CUSTOM')) {
            console.log('Element: CUSTOM');
        } else {
            let elem2 = elem.charAt(0).toUpperCase() + elem.slice(1);
            console.log('Element: ' + elem2);
        }
        console.log(`Role: ${userData.role}`);
        console.log(`Color: ${userData.color}`);
        if (userData.linked === 'none') {
            console.log('Discord not linked');
        } else {
            var linkSplit = userData.linked.split('|');
            console.log('Linked with Discord: ' + linkSplit[0]);
        }
    });
}

function vtelem() {
    document.getElementById('#elementPopup').style.display = 'none';
    document.getElementById('#setElementButton').addEventListener('click', function() {
        var elempick = prompt('Enter element name:');
        setElement(elempick);
        alert('Note: if you picked an element you don\'t have, it won\'t work.');
    });
}
if (location.pathname === '/trade/') {
    vtelem();
}
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 27) {
        var command = prompt('Enter a command:').toLowerCase();
        switch (command) {
            case 'block':
                var usertoblock = prompt('Enter name of user to block - case sensitive!');
                blockuser(usertoblock);
                break;
            case 'block list':
                alert(JSON.parse(localStorage.blockedUsers));
                break;
            case 'unblock':
                var unbuser = prompt('Who do you want to unblock?');
                unblockuser(unbuser);
                break;
            case 'download':
                if (location.pathname === '/chat/') {
                    chatdl();
                } else {
                    alert('Wrong page, find the Chat page to use this script!');
                }
                break;
            case 'see elements':
                if (location.pathname === '/elements/') {
                    seeUserElem();
                } else {
                    alert('Wrong page, find the Elements page to use this script!');
                }
                break;
            case 'sell all':
                if (location.pathname === '/elements/') {
                    sellAll();
                } else {
                    alert('Wrong page, find the Elements page to use this script!');
                }
                break;
            case 'spoof':
                if (location.pathname === '/elements/') {
                    spoof();
                } else {
                    alert('Wrong page, find the Elements page to use this script!');
                }
                break;
            case 'sell dupes':
                if (location.pathname === '/elements/') {
                    sellDupe();
                } else {
                    alert('Wrong page, find the Elements page to use this script!');
                }
                break;
            case 'offline':
                socket.disconnect();
                if (url === '/stats/') {
                    document.getElementById('#userElement').classList.remove('userElementOnline');
                    document.getElementById('#userElement').classList.add('userElementOffline');
                }
                break;
            case 'spam crates':
                var school = confirm('Requires Console access. Click Cancel to end.\n\nSchool Tool comin soon!');
                if (school) {
                    if (location.pathname === '/crates/') {
                        spamCrates();
                    } else {
                        alert('Wrong page, find the Crates page to use this script!');
                    }
                } else {
                    alert('Cancelled!');
                }
                break;
            case 'element calculator':
                elemCalc();
                break;
            case 'auto decline':
                socket.on('request', (user) => {
                    let sentuser = `${user}`;
                    console.log(sentuser + ' attempted to send a request but was blocked.');
                    $('.tradeRequest').remove();
                    socket.emit('decline');
                });
                break;
            case 'confetti':
                confetti();
                break;
            case 'user':
                viewuser();
                break;
            case 'daily':
                claimRewards();
                break;
            default:
                alert('Not a command! It may be automatic!');
                break;
        }
    }
});
