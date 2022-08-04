class BuildModalContent
{
    option = [];

    options = {
        'label': `<div class="form-group">
                <label for="item-label" class="col-form-label">表示名</label>
                <input type="text" class="form-control" name="item_label" id="item-label" placeholder="Label">
            </div>`,

        'name': `<div class="form-group">
                <label for="item-name" class="col-form-label">ネーム（カラム名）</label>
                <input type="text" class="form-control" name="item_name" id="item-name" value="{name}">
            </div>`,

        'text': `<div class="form-group">
                <label for="item-text" class="col-form-label">値</label>
                <input type="text" class="form-control" name="item_text" id="item-text" placeholder="新規">
            </div>`,

        'max-length': `<div class="form-group">
                <label for="item-max-length" class="col-form-label">文字数（上限）</label>
                <input name="item_max_length"
                    class="form-control"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type = "number"
                    maxlength = "4"
                    id="item-max-length"
                    value="0"
                />
            </div>`,

        'min-length': `<div class="form-group">
                <label for="item-min-length" class="col-form-label">文字数（下限）</label>
                <input name="item_min_length"
                    class="form-control"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type = "number"
                    maxlength = "4"
                    id="item-min-length"
                    value="0"
                />
            </div>`,

        'require': `<div class="form-group">
                <input type="checkbox" class="form-control" name="item_require" id="item-require" value="1">
                <label for="item-require" class="col-form-label">必須</label>
            </div>`,

        'unique': `<div class="form-group">
                <input type="checkbox" class="form-control" name="item_unique" id="item-unique" value="1">
                <label for="item-unique" class="col-form-label">個性的</label>
            </div>`,

        'mail': `<div class="form-group">
                <input type="checkbox" class="form-control" name="item_email" id="item-email" value="mail">
                <label for="item-email" class="col-form-label">メールアドレス</label>
            </div>`,

        'phone': `<div class="form-group">
                <input type="checkbox" class="form-control" name="item_phone" id="item-phone" value="phone">
                <label for="item-phone" class="col-form-label">電話番号</label>
            </div>`,

        'kana': `<div class="form-group">
                <input type="checkbox" class="form-control" name="item_kana" id="item-kana" value="kana">
                <label for="item-kana" class="col-form-label">フリガナ</label>
            </div>`,

        'size': `<div class="form-group">
                <label for="item-size" class="col-form-label">サイズ</label>
                <input type="text" class="form-control" name="item_size" id="item-size" value="デフォルト">
            </div>`,

        'file_type': `<div class="form-group">
            <input type="checkbox" class="form-control" name="item_checkbox_pdf" id="item-checkbox0" value=".pdf">
            <label for="item-checkbox0" class="col-form-label">.pdf</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox_doc" id="item-checkbox1" value=".doc">
            <label for="item-checkbox1" class="col-form-label">.doc</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox_docx" id="item-checkbox2" value=".docx">
            <label for="item-checkbox2" class="col-form-label">.docx</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox_xls" id="item-checkbox3" value=".xls">
            <label for="item-checkbox3" class="col-form-label">.xls</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox_xlsx" id="item-checkbox4" value=".xlsx">
            <label for="item-checkbox4" class="col-form-label">.xlsx</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox_csv" id="item-checkbox5" value=".csv">
            <label for="item-checkbox5" class="col-form-label">.csv</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox_zip" id="item-checkbox6" value=".zip">
            <label for="item-checkbox6" class="col-form-label">.zip</label>
        </div>`,

        'image_type': `<div class="form-group">
            <input type="checkbox" class="form-control" name="item_checkbox_jpg" id="item-checkbox0" value=".jpg">
            <label for="item-checkbox0" class="col-form-label">.jpg</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox_jpeg" id="item-checkbox1" value=".jpeg">
            <label for="item-checkbox1" class="col-form-label">.jpeg</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox_gif" id="item-checkbox2" value=".gif">
            <label for="item-checkbox2" class="col-form-label">.gif</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox_png" id="item-checkbox3" value=".png">
            <label for="item-checkbox3" class="col-form-label">.png</label>
        </div>`,

        'options': `<div class="form-group">
            <input type="radio" class="form-control" name="item_type" id="item-radio0" value="0" checked>
            <label for="item-radio0" class="col-form-label">普通</label>
            
            <input type="radio" class="form-control" name="item_type" id="item-radio1" value="kana">
            <label for="item-radio1" class="col-form-label">フリガナ</label>
            
            <input type="radio" class="form-control" name="item_type" id="item-radio2" value="phone">
            <label for="item-radio2" class="col-form-label">電話番号</label>
            
            <input type="radio" class="form-control" name="item_type" id="item-radio3" value="mail">
            <label for="item-radio3" class="col-form-label">メールアドレス</label>
        </div>`,
    }

    // class methods
    constructor ( modal, type, tr )
    {
        this.__modal__ = modal;
        this.__item__ = type;
        this.__tr__ = tr;
    }


    label () { this.option = [ 'label', 'text' ]; }
    input_text () { this.option = [ 'label', 'name', 'options', 'require', 'unique', 'min-length', 'max-length' ]; }
    input_date () { this.option = [ 'label', 'name', 'require' ]; }
    input_datetime () { this.option = [ 'label', 'name', 'require' ]; }
    selectbox () { this.option = [ 'label', 'name', 'require' ]; }
    textarea () { this.option = [ 'label', 'name', 'require', 'min-length', 'max-length' ]; }
    textarea_editor () { this.option = [ 'label', 'name', 'require', 'min-length', 'max-length' ]; }
    checkbox () { this.option = [ 'label', 'name', 'require' ]; }
    checkbox_inline () { this.option = [ 'label', 'name', 'require' ]; }
    radio () { this.option = [ 'label', 'name', 'require' ]; }
    radio_inline () { this.option = [ 'label', 'name', 'require' ]; }
    file () { this.option = [ 'label', 'require', 'file_type' ]; }
    image () { this.option = [ 'label', 'require', 'image_type' ]; }


    get_temp_option ( option )
    {
        return this.options.hasOwnProperty( option ) ? this.options[ option ] : '';
    }


    build ()
    {
        this[ this.__item__ ]();
        var self = this;

        var opts = __._array.array_map( function ( opt )
        {
            return self.get_temp_option( opt );
        }, this.option );

        this.__modal__.find( 'form' ).html( __._string.join( '', opts ) );
    }


    setHeader ()
    {
        // ＊＊モーダルのタイトルをセット＊＊ //
        this.__modal__.find( '.modal-title' ).text( `項目設定（${ this.__item__ }）` );
    }


    setValue ()
    {
        // ＊＊モーダルにデータをセット＊＊ //
        var modal = this.__modal__;

        var attrs = [].filter.call( this.__tr__.find( '.item_options' )[ 0 ].attributes, function ( at ) { return at.name } );

        attrs.forEach( ( element ) =>
        {
            let el = modal.find( `*[name="${ element.name }"]` );
            if ( el.length > 0 )
            {
                if ( ( el[ 0 ].type === 'checkbox' || el[ 0 ].type === 'radio' ) )
                {
                    el.each( function ()
                    {
                        if ( $( this ).val() === element.value ) $( this ).attr( 'checked', 'checked' );
                        else return;
                    } );
                }
                else el.val( element.value );
            }
        } );
    }


    change_item ( modal, type, tr )
    {
        // モーダルには掲載されたデータ
        const data_option = modal.find( 'form' ).serializeArray();

        for ( let i in data_option )
        {
            if ( tr.find( `.${ data_option[ i ][ 'name' ] }` ).length > 0 )
                // 項目名のテキスト交換
                tr.find( `.${ data_option[ i ][ 'name' ] }` ).text( data_option[ i ][ 'value' ] );

            // アトリビュートを追加
            tr.find( '.item_options' ).attr( `${ data_option[ i ][ 'name' ] }`, data_option[ i ][ 'value' ] );
        }
        // モーダル非表示
        modal.find( '.btn-secondary' ).trigger( 'click' );
    }


    [ '__run__' ] ()
    {
        this.setHeader();
        this.build();
        this.setValue();

        var self = this;

        // 「　OK ・　同意する　」btn
        this.__modal__.find( '.btn-primary' ).unbind( 'click' );
        this.__modal__.find( '.btn-primary' ).on( 'click', function ()
        {
            self[ `change_item` ]( self.__modal__, self.__item__, self.__tr__ );
        } );
    }
}