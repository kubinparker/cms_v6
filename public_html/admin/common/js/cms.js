//--子ウインドウの有無確認関数
function win_closed(winVar) {

  var ua = navigator.userAgent
  if( !!winVar )
      if( ( ua.indexOf('Gecko')!=-1 || ua.indexOf('MSIE 4')!=-1 )
           && ua.indexOf('Win')!=-1 )
           return winVar.closed
      else return typeof winVar.document  != 'object'
  else return true
}

//--サブウインドウを開く/フォーカス
function openwin(winVar, cgiparam, targetName, winparam){
	if(win_closed(winVar)){
	  winVar = window.open(cgiparam,targetName
	                   ,winparam);
  }
  winVar.focus()
}

function getSelected (e) {
    if (document.selection) {
        e.focus();
        var range = document.selection.createRange();
        return range.text;
    } else {
        var length = e.textLength;
        var start = e.selectionStart;
        var end = e.selectionEnd;
        if (end == 1 || end == 2) end = length;
        return e.value.substring(start, end);
    }
}

function setSelection (e, v) {
    if (document.selection) {
        e.focus();
        var range = document.selection.createRange();
        range.text = v;
    } else {
        var length = e.textLength;
        var start = e.selectionStart;
        var end = e.selectionEnd;
        if (end == 1 || end == 2) end = length;
        e.value = e.value.substring(0, start) + v + e.value.substr(end, length);
        e.selectionStart = start + v.length;
        e.selectionEnd = start + v.length;
    }
    e.focus();
}

function formatStr (e, v) {
    var str = getSelected(e);
    if (!str) return;
    setSelection(e, '<' + v + '>' + str + '</' + v + '>');
    return false;
}

function cmsShortCuts(e) {
    e = e || event;
    if (!e || (!e.ctrlKey)) return;
    /* we have to add 64 to keyCode since the user hit a control key */
    var code = (e.keyCode) ? (e.keyCode + 64) :
               ((e.which) ? e.which : 0);
    var ch = String.fromCharCode(code);
    el = e.target || e.srcElement;
    if (el.nodeType == 3) el = el.parentNode; // Safari bug
    if (ch == 'A') insertLink(el, false);
    if (ch == 'B') formatStr(el, 'strong');
    if (ch == 'I') formatStr(el, 'em');
    if (ch == 'U') formatStr(el, 'u');
}

function insertLink (e, isMail) {
    var str = getSelected(e);
    var link = '';
    if (!isMail) {
        if (str.match(/^https?:/)) {
            link = str;
        } else if (str.match(/^(\w+\.)+\w{2,5}\/?/)) {
            link = 'http://' + str;
        } else if (str.match(/ /)) {
            link = 'http://';
        } else {
            link = 'http://' + str;
        }
    } else {
        if (str.match(/@/)) {
            link = str;
        }
    }
    var my_link = prompt(isMail ? 'Enter email address:' : 'リンク先のURLを入力してください:', link);
    if (my_link != null) {
         if (str == '') str = my_link;
         if (isMail) my_link = 'mailto:' + my_link;
        setSelection(e, '<a href="' + my_link + '" target="_blank">' + str + '</a>');
    }
    return false;
}


function formatBox (e, v) {
    var str = getSelected(e);
    if (!str) return;
    setSelection(e, '<div style="' + v + '">' + str + '</div>');
    return false;
}

function insertTag (textArea, startTag, endTag) {
	var txt = null;
	var position = null;
	if ( document.selection && document.selection.createRange ) {
		textArea.focus();
		textArea.range = document.selection.createRange();
	}
	else if ( typeof(textArea.selectionStart) == 'number' ) {
		position  =
			new Array(textArea.selectionStart, textArea.selectionEnd);
	}

	if ( textArea.range ) {
		txt = textArea.range.text;
	}
	else if ( position ) {
		txt = textArea.value.substring(position[0], position[1]);
	}

	if ( txt == null ) {
		textArea.value += startTag + endTag;
	}
	else {
		var len_txt  = txt.length;
		var len_stag = startTag.length;
		var len_etag = endTag.length;
		if ( textArea.range ) {
			var ret = txt.match(/\r\n|\r|\n/g);
			if ( ret ) len_txt -= ret.length;
			textArea.range.text = startTag + txt + endTag;
			textArea.range.move('character', - (len_txt + len_etag));
			textArea.range.moveEnd('character', len_txt);
			textArea.range.select();
		}
		else if ( position ) {
			textArea.value =
				textArea.value.substring(0, position[0]) +
				startTag + txt + endTag +
				textArea.value.substring(position[1], textArea.value.length);
			textArea.selectionStart = position[0] + len_stag;
			textArea.selectionEnd = position[1] + len_stag;
		}
	}
	textArea.focus();
}

//ボックスの開閉
function boxOpenClose(id, o) {
	$id = $('#'+id);
	init = $id.data('init') || false;
	if (!init) {
		InitColorPalette(id, o);
		$id.data('init', true);
	}
	$id.toggle();
    return false;
}

function InitColorPalette(id, o) {
	$('#'+id+' td').hover(function(){$(this).css('border', '1px dotted white')},
						  function(){$(this).css('border', '1px solid gray')});
	$('#'+id+' td').on('mousedown', function(){
		insertTag(o, '<span style="color:' + $(this).attr('bgcolor') + '";>','</span>');
		$('#'+id).hide();
	});
}

function checkForm(fm){
	if(fm.nm.value == ''){
		alert('タイトルは必ず入力してください。');
		return false;
	}
	return confirm('登録しますか？');
}


function kakunin(msg, url) {
    if (confirm(msg)) {
        location.href = url;
    }
}

$(function () {
    // 日付
    $('.datepicker').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    //日付変更時に実行
    $('.datepicker').on('change', function() {
        var $this = $(this);
        if (! $this.val() && $this.data('auto-date')) {
            var dt = new Date(), d = [];
            var m = '0' + (dt.getMonth() + 1);
            var dd = '0' + dt.getDate();
            d.push(dt.getFullYear()),
            d.push(m.substr(m.length-2,2)),
            d.push(dd.substr(dd.length-2,2));
            $(this).val(d.join('-'));
        }
    });

    // フォームボタン
    $('.submitButton').on('click', function () {
        $(this).closest('form').submit();
        return false;
    });
    $('#reset').on('click', function () {
        $(this).closest('form')[0].reset();
        return false;
    });
});
