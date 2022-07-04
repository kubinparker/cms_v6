/**
 * フォーカス移動
 * @param {type} txt
 * @returns {undefined}
 */
function focus_Action_app(element) {
    // var elm = document.form.elements;
    var elm = jQuery(element);
    elm.sort(function(val1,val2){
        var val1 = val1.tabIndex;
        var val2 = val2.tabIndex;
        if (val1 > val2) {
            return 1;
        } else {
            return -1;
        }
    });
    if(window.event.keyCode === 13){
        if(!window.event.shiftKey){
            // event.keyCode = 9;
            if(event.keyCode == 9){
              alert("keyCodeへ代入できない場合の処理");
                    return;
            }else{
                // alert("keyCodeへ代入できない場合の処理");
                var i,nam;
                var index_flg = 0;
                for(i = 0; i < elm.length; i++){
                    if(index_flg == 0){
                        //name属性で現在の要素を判定しフラグを立てる
                        if(event.srcElement.name == elm[i].name){
                            nam = elm[i].name;
                            index_flg = 1;
                        }
                        //フラグが立っている場合そこから先の要素で条件を満たすものがある場合フォーカスを移動する
                    } else if(index_flg == 1){
                        if(elm[i].name != undefined && elm[i].name != nam && elm[i].tabIndex > 0 && elm[i].type != "hidden" && elm[i].readOnly != true){
                            //textの選択状態を強制解除する
                            if(event.srcElement.type == "text" ||event.srcElement.type == "textarea"){
                                event.srcElement.selectionEnd = 0;
                            }
                            elm[i].focus();
                            break;
                        }
                    }
                }
            }
        }else{
            //Shift+Enterの場合
            if(event.keyCode==13){
                var i,nam;
                var index_flg = 0;
                for(i = elm.length - 1; i >= 0; i--){
                    if(index_flg == 0){
                        //name属性で現在の要素を判定しフラグを立てる
                        if(event.srcElement.name == elm[i].name){
                            nam = elm[i].name;
                            index_flg = 1;
                        }
                        //フラグが立っている場合そこから先の要素で条件を満たすものがある場合フォーカスを移動する
                    }else if(index_flg == 1){
                        if(elm[i].name != undefined && elm[i].name != nam && elm[i].tabIndex > 0 && elm[i].type != "hidden" && elm[i].readOnly != true){
                            //textの選択状態を強制解除する
                            if(event.srcElement.type == "text" ||event.srcElement.type == "textarea"){
                                event.srcElement.selectionEnd = 0;
                            }
                            elm[i].focus();
                            break;
                        }
                    }
                }
            }
        }

        return false;
    }
    return true;
}
function focus_Action_list(element) {
    // var elm = document.form.elements;
    var elm = jQuery(element);

    if(window.event.keyCode === 40 || window.event.keyCode === 38){
        if (window.event.keyCode === 13){

        } else
        if(window.event.keyCode === 40 ){
            // event.keyCode = 9;
            if(event.keyCode == 9){
              alert("keyCodeへ代入できない場合の処理");
                    return;
            }else{
                // alert("keyCodeへ代入できない場合の処理");
                var i,nam;
                var index_flg = 0;
                for(i = 0; i < elm.length; i++){
                    if(index_flg == 0){
                        //name属性で現在の要素を判定しフラグを立てる
                        if(event.srcElement.name == elm[i].name){
                            nam = elm[i].name;
                            index_flg = 1;
                        }
                        //フラグが立っている場合そこから先の要素で条件を満たすものがある場合フォーカスを移動する
                    } else if(index_flg == 1){
                        if(elm[i].name != undefined && elm[i].name != nam && elm[i].tabIndex > 0 && elm[i].type != "hidden" && elm[i].readOnly != true){
                            //textの選択状態を強制解除する
                            if(event.srcElement.type == "text" ||event.srcElement.type == "textarea"){
                                event.srcElement.selectionEnd = 0;
                            }
                            elm[i].focus();
                            break;
                        }
                    }
                }
            }
        }else{
            //Shift+Enterの場合
            if(event.keyCode==38){
                var i,nam;
                var index_flg = 0;
                for(i = elm.length - 1; i >= 0; i--){
                    if(index_flg == 0){
                        //name属性で現在の要素を判定しフラグを立てる
                        if(event.srcElement.name == elm[i].name){
                            nam = elm[i].name;
                            index_flg = 1;
                        }
                        //フラグが立っている場合そこから先の要素で条件を満たすものがある場合フォーカスを移動する
                    }else if(index_flg == 1){
                        if(elm[i].name != undefined && elm[i].name != nam && elm[i].tabIndex > 0 && elm[i].type != "hidden" && elm[i].readOnly != true){
                            //textの選択状態を強制解除する
                            if(event.srcElement.type == "text" ||event.srcElement.type == "textarea"){
                                event.srcElement.selectionEnd = 0;
                            }
                            elm[i].focus();
                            break;
                        }
                    }
                }
            }
        }

        return false
    }
    return true;
}

/**
 * selectの値をテキストボックスへ
 */
function setSelectValue2Text(self,target) {
    var val = jQuery(self).val();
    jQuery(target).val(val);
}
/**
 * textbox の値を　select へ
 * @param {[type]} self   [description]
 * @param {[type]} target [description]
 */
function setTextValue2Select(self, target, defaultValue) {
    var val = jQuery(self).val();

    // option値の存在チェック
    var option = jQuery(target).children('option[value="' + val + '"]');
    if (option.length == 0) {
        val = defaultValue;
        jQuery(self).val(val);
    }
    jQuery(target).val(val);
}

/**
 * 整数の桁数をそろえる
 * @param  {[type]} self        [description]
 * @param  {[type]} len         [description]
 * @param  {[type]} zeroReturn  [description]
 * @param  {[type]} returnValue [description]
 * @return {[type]}             [description]
 */
function fcoutCode(self, len, zeroReturn, returnValue) {

    if (typeof zeroReturn === "undefined") {
        zeroReturn = true;
    }
    if (typeof returnValue === "undefined") {
        returnValue = "";
    }
    var val = jQuery(self).val();
    if ((val == "" || val == 0 || val == '#') && zeroReturn === false) {
        val = returnValue;
    } else {
        val = sprintf("%0" + len + "d", val);
    }

    jQuery(self).val(val);
}
/**
 * 小数点の桁数を揃える
 * @param {[type]} self [description]
 * @param {[type]} len  [description]
 */
function Number2Fixed(self, len) {
    var val = Number(jQuery(self).val());
    var res = "";

    if (val == "") {
        res = "";    
    } else {
        res = (val).toFixed(2);
    }

    jQuery(self).val(res);

}

/**
 * 一覧表示　カレント行の色
 */
function select_row_color(self, target, color) {
    if (typeof color === "undefined") {
        color = "#d6f5eb";
    }
    jQuery(target).closest('tr').css('background-color', "#fff");
    jQuery(target).closest('tr td').css('background-color', "#fff");
    jQuery(target).closest('tr input').css('background-color', "#fff");

    jQuery(self).closest('tr').css('background-color', color);
    jQuery(self).closest('tr td').css('background-color', color);
    jQuery(self).closest('tr input').css('background-color', color);
}

/**
 * 全角から半角に変換
 * @param  {[type]} strVal [description]
 * @return {[type]}        [description]
 */
function toHalfWidth(self){
    var strVal = jQuery(self).val();

    // 半角変換
    var halfVal = strVal.replace(/[！-～]/g,
        function( tmpStr ) {
            // 文字コードをシフト
            return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
        }
    );
 
    // 文字コードシフトで対応できない文字の変換
    strVal = halfVal.replace(/”/g, "\"")
        .replace(/’/g, "'")
        .replace(/‘/g, "`")
        .replace(/￥/g, "\\")
        .replace(/　/g, " ")
        .replace(/〜/g, "~");

    jQuery(self).val(strVal);
}

/**
 * 全角は2文字、半角は1文字でカウント
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function countChara(str) {
  var r = 0; 
    for (var i = 0; i < str.length; i++) { 
        var c = str.charCodeAt(i); 
        // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff 
        // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3 
        if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) { 
            r += 1; 
        } else { 
            r += 2; 
        } 
    } 
    return r;
}
/**
 * 指定文字（len）を超えるとカットする
 * @param  {[type]} self [description]
 * @param  {[type]} len  [description]
 * @return {[type]}      [description]
 */
function cutString(self, len) {
    var str = jQuery(self).val();
    var r = 0;
    var result = '';

    for (var i = 0; i < str.length; i++) { 
        var c = str.charCodeAt(i); 
        // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff 
        // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3 
        if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) { 
            r += 1;
            result = result + String.fromCharCode(c);
            if (r >= len) {
                break;
            }
        } else { 
            r += 2; 
            if (r >= len) {
                break;
            }
            result = result + String.fromCharCode(c);
        } 
    }

    jQuery(self).val(result);
    return result;
}
function charaCountCheck(self, len) {
    var str = jQuery(self).val();

    var count = countChara(str);
    if (count > len) {
        return false;
    }
    return true;
}

/**
 * 2桁以下の場合は年月を補完
 * 5桁以下の場合は年を補完
 * @return {[type]} [description]
 */
function autoComplateDate(self, dt) {
    if (typeof dt === "undefined") {
        var dt = jQuery(self).val();
    }
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = sprintf("%02d", month);
    var res = dt;

    // 2桁以下
    if (dt.length > 0 && dt.length <= 2) {
        res = year + '/' + month + '/' + sprintf("%02d", dt);
    }
    else if (dt.length > 2 && dt.length <= 5) {
        var mmdd = dt.split("/");
        var m = '';
        var d = '';
        if (mmdd.length == 2) {
            m = mmdd[0];
            d = mmdd[1];
        } else if (mmdd.length == 1) {
            if (dt.length == 3) {
                m = dt.substr(0, 1);
                d = dt.substr(1, 2);
            } else if (dt.length == 4) {
                m = dt.substr(0, 2);
                d = dt.substr(2, 2);
            }

        }
        if (m != "" && d != "") {
            res = year + '/' + sprintf("%02d", m) + '/' + sprintf("%02d", d);
        }
    }
    else if (dt.length == 8) {
        var y = dt.substr(0, 4);
        var m = dt.substr(4, 2);
        var d = dt.substr(6, 2);

        res = y + '/' + sprintf("%02d", m) + '/' + sprintf("%02d", d);
    }

    if (self) {
        jQuery(self).val(res);
    }

    return res;
}

/**
 * number_formatと同等
 */
function nf(self, decimal) {
    var num = jQuery(self).val();
    var d = 0;

    if (typeof decimal === 'undefined') {
        d = 0;
    } else {
        d = decimal;
    }

    var res = number_format(num, d);

    jQuery(self).val(res);

    return d;
}

function alert_dlg(message, options) {
    var buttons = [
        {
          text:'はい',
          click: function(){
            $(this).dialog("close");
          }
        }
    ];

    if (typeof options !== 'undefined') {
        if (typeof options.buttons !== 'undefined') {
            buttons = options.buttons;
        }
    }
    $("#kakunin_dialog").dialog({
        autoOpen:false,
        width:300,
        modal: true,
        buttons: buttons
    });
    $("#kakunin_dialog p").html(message);
    $("#kakunin_dialog").dialog("open");
}

Object.defineProperty(Object.prototype, "forIn", {
    value: function(fn, self) {
        self = self || this;

        Object.keys(this).forEach(function(key, index) {
            var value = this[key];

            fn.call(self, key, value, index);
        }, this);
    }
});