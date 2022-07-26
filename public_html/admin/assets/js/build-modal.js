class BuildModalContent
{
    option = [];

    options = {
        'label': `<div class="form-group">
                <label for="item-label" class="col-form-label">表示名</label>
                <input type="text" class="form-control" name="item_label" id="item-label" value="Label">
            </div>`,

        'name': `<div class="form-group">
                <label for="item-name" class="col-form-label">ネーム（カラム名）</label>
                <input type="text" class="form-control" name="item_name" id="item-name" value="">
            </div>`,

        'text': `<div class="form-group">
                <label for="item-text" class="col-form-label">値</label>
                <input type="text" class="form-control" name="item_text" id="item-text" value="新規">
            </div>`,

        'max-length': `<div class="form-group">
                <label for="item-max-length" class="col-form-label">文字数（上限）</label>
                <input type="text" class="form-control" name="item_max_length" id="item-max-length" value="0">
            </div>`,

        'min-length': `<div class="form-group">
                <label for="item-min-length" class="col-form-label">文字数（下限）</label>
                <input type="text" class="form-control" name="item_min_length" id="item-min-length" value="0">
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

        // 'date': `<div class="form-group">
        //         <input type="checkbox" class="form-control" name="item_date" id="item-date" value="1">
        //         <label for="item-date" class="col-form-label">日付</label>
        //     </div>`,

        // 'datetime': `<div class="form-group">
        //         <input type="checkbox" class="form-control" name="item_datetime" id="item-datetime" value="1">
        //         <label for="item-datetime" class="col-form-label">日時</label>
        //     </div>`,

        'file_type': `<div class="form-group">
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox0" value="pdf">
            <label for="item-checkbox0" class="col-form-label">.pdf</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox1" value="doc">
            <label for="item-checkbox1" class="col-form-label">.doc</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox2" value="docx">
            <label for="item-checkbox2" class="col-form-label">.docx</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox3" value="xls">
            <label for="item-checkbox3" class="col-form-label">.xls</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox4" value="xlsx">
            <label for="item-checkbox4" class="col-form-label">.xlsx</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox5" value="csv">
            <label for="item-checkbox5" class="col-form-label">.csv</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox6" value="zip">
            <label for="item-checkbox6" class="col-form-label">.zip</label>
        </div>`,

        'image_type': `<div class="form-group">
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox0" value="jpg">
            <label for="item-checkbox0" class="col-form-label">.jpg</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox1" value="jpge">
            <label for="item-checkbox1" class="col-form-label">.jpge</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox2" value="gif">
            <label for="item-checkbox2" class="col-form-label">.gif</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox3" value="png">
            <label for="item-checkbox3" class="col-form-label">.png</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox4" value="svg">
            <label for="item-checkbox4" class="col-form-label">.svg</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox5" value="ico">
            <label for="item-checkbox5" class="col-form-label">.ico</label>
            
            <input type="checkbox" class="form-control" name="item_checkbox" id="item-checkbox6" value="pjpeg">
            <label for="item-checkbox6" class="col-form-label">.pjpeg</label>
        </div>`,

        'options': `<div class="form-group">
            <input type="radio" class="form-control" name="item_radio" id="item-radio0" value="0" checked>
            <label for="item-radio0" class="col-form-label">普通</label>
            
            <input type="radio" class="form-control" name="item_radio" id="item-radio1" value="kana">
            <label for="item-radio1" class="col-form-label">フリガナ</label>
            
            <input type="radio" class="form-control" name="item_radio" id="item-radio2" value="phone">
            <label for="item-radio2" class="col-form-label">電話番号</label>
            
            <input type="radio" class="form-control" name="item_radio" id="item-radio3" value="mail">
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
    file () { this.option = [ 'label', 'name', 'require', 'size', 'file_type' ]; }
    image () { this.option = [ 'label', 'name', 'require', 'size', 'image_type' ]; }


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


    change_item_label ( modal, tr )
    {
        const data_option = modal.find( 'form' ).serializeArray();
        console.log( data_option );
        for ( let i in data_option )
        {
            if ( tr.find( `.${ data_option[ i ][ 'name' ] }` ).length > 0 )
            {
                tr.find( `.${ data_option[ i ][ 'name' ] }` ).text( data_option[ i ][ 'value' ] );
                // continue add input hidden and hide modal
            }
        }
    }


    setHeader ()
    {
        this.__modal__.find( '.modal-title' ).text( `項目設定（${ this.__item__ }）` );
    }


    [ '__run__' ] ()
    {
        this.setHeader();
        this.build();
        var self = this;
        this.__modal__.find( '.btn-primary' ).on( 'click', function ()
        {
            if ( typeof self[ `change_item_${ self.__item__ }` ] === 'function' )
                self[ `change_item_${ self.__item__ }` ]( self.__modal__, self.__tr__ );
        } );
    }
}