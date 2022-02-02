
const vocab = [
	'anpa', 'ante', 'awen', 'esun', 'insa', 'jaki', 'jelo', 'kala', 'kama', 'kasi', 'kili',
	'kule', 'kute', 'lape', 'laso', 'lawa', 'lete', 'lili', 'lipu', 'loje', 'luka', 'lupa',
	'mama', 'mani', 'meli', 'mije', 'moku', 'moli', 'musi', 'mute', 'nasa', 'nena', 'nimi',
	'noka', 'olin', 'open', 'pali', 'pana', 'pini', 'pipi', 'poka', 'poki', 'pona', 'sama',
	'seli', 'selo', 'seme', 'sewi', 'sike', 'sina', 'sona', 'suli', 'suno', 'supa', 'suwi',
	'taso', 'tawa', 'telo', 'toki', 'tomo', 'unpa', 'walo', 'waso', 'wawa', 'weka', 'wile'];

const chars = ['a', 'e', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 's', 't', 'u', 'w'];

var index = 0;
var answers = ['', '', '', '', '', '', '', '', '', ''];
var startTime;
var csec = 0;
var sec = 0;
var min = 0;

function init_ansewers () {
	startTime = new Date();
	csec = 0;
	sec = 0
	min = 0;
	index = 0;
	for (let i = 0; i < 10; i++) {
		do {
			let tmp = vocab[Math.floor(Math.random() * vocab.length)];
			if (!answers.includes(tmp)) {
				answers[i] = tmp;
			}
		} while (answers[i] === '');
	}
}

function init_states () {
	row = 0;
	col = 0;
	array = [['', '', '', ''], ['', '', '', ''], ['', '', '', '']];
	color = [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]];
}

var array;
var color;
var colorname = ['green', 'yellow', 'lightgray'];
var row = 0;
var col = 0;
var valid = true;
var proc = false;
init_states();


// マス目の中の文字と色をかきます
function redrawTable () {
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 3; j++) {
			let elm = document.getElementById('cell' + j + i);
			elm.textContent = array[j][i];
			elm.style.backgroundColor = colorname[color[j][i]];
		}
	}
}

// 矢印などを書きます
function redrawArrow () {
	for (let k = 0; k < 3; k++) {
		let elm = document.getElementById('arrow' + k);
		if (k == row) {
			if (valid) {
				elm.textContent = '▶';
			} else {
				elm.textContent = '？';
			}
		} else {
			elm.textContent = '';
		}
	}
}

// 結果をかきます
function redrawResult () {
	for (let i = 0; i < index; i++) {
		let elm = document.getElementById('ans' + i);
		elm.textContent = answers[i];
	}
	for (let i = index; i < 10; i++) {
		let elm = document.getElementById('ans' + i);
		elm.textContent = '';
	}
}

// 再描画をします
function redraw () {
	redrawTable();
	redrawArrow();
	redrawResult();
}

// 黄色とか緑のやつを計算します
function getHint (ans, cand) {
	let hint = [2, 2, 2, 2];

	// 2 -> 0
	for (let i = 0; i < 4; i++) {
		if (ans[i] === cand[i]) {
			hint[i] = 0; // correct
		}
	}

	// 2 -> 1
	let rest = new Set();
	for (let i = 0; i < 4; i++) {
		if (hint[i] === 2) {
			rest.add(cand[i]);
		}
	}
	for (let item of rest) {
		let flag = false;
		for (let i = 0; i < 4; i++) {
			if ((ans[i] === item) && ((hint[i] === 1) || (hint[i] === 2))) {
				flag = true;
				break;
			}
		}
		if (flag) {
			for (let i = 0; i < 4; i++) {
				if ((cand[i] === item) && (hint[i] === 2)) {
					hint[i] = 1;
					break;
				}
			}
		}
	}

	return hint;
}

function is_correct(hint) {
	let correct = true;
	for (let i = 0; i < 4; i++) {
		if (hint[i] != 0) {
			correct = false;
		}
	}
	return correct;
}

function reset_row() {
	array[row] = ['', '', '', ''];
	col = 0;
}

function input_char (key) {
	if ((proc === false)) {
		init_ansewers();
		init_states();
		proc = true;
	}
	if ((col >= 0) && (col < 4)) {
		array[row][col] = key;
		col++;
	}
}

function backspace_row() {
	if ((col > 0) && (col <= 4)) {
		col--;
		array[row][col] = '';
	}
}

function set_color (hint) {
	for (let i = 0; i < 4; i++) {
		color[row][i] = hint[i];
	}
}

function twitText () {
	s = 'Toki Pona Wordle RTA: ' + get_time() + ' (' + answers.join() + ')';
	url = "https://nymwa.github.io/tokipona-wordle/";
	url = "http://twitter.com/share?url=" + escape(url) + "&text=" + s;
	window.open(url,"_blank","width=600,height=300");
}

function proc_correct () {
	if (index === 9) {
		proc = false;
	} else {
		init_states();
	}
	index++;
}

function enter_row () {
	cand = array[row].join('');
	if (vocab.includes(cand)) {
		let hint = getHint(answers[index], cand);
		set_color(hint)
		if (is_correct(hint)) {
			proc_correct();
		} else if (row === 2) {
			proc = false;
		} else {
			row++;
			col = 0;
		}
		valid = true;
	} else {
		valid = false;
		reset_row();
	}
}

function keyevent (event) {
	let key = event.key;
	if (chars.includes(key)) {
		input_char(key);
	} else if (proc) {
		if (key === 'Backspace') {
			backspace_row();
		} else if (key === 'Enter') {
			enter_row();
		} else if (key === 'Escape') {
			valid = true;
			reset_row();
		}
	}
	redraw();
}

redraw();
document.addEventListener('keydown', event => {keyevent(event);});

function get_time () {
	csec_filled = ('00' + csec).slice(-2);
	sec_filled = ('00' + sec).slice(-2);
	min_filled = ('00' + min).slice(-2);
	return min_filled + ':' + sec_filled + ':' + csec_filled;
}

function stopwatch () {
	let elm = document.getElementById('watch');
	if (proc) {
		let now = new Date();
		diff = new Date(now.getTime() - startTime.getTime());
		csec = Math.floor(diff.getMilliseconds() / 10)
		sec = diff.getSeconds();
		min = diff.getMinutes();
	}
	elm.textContent = get_time();
	setTimeout("stopwatch()", 10);
}

stopwatch();

