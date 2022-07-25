class BuildModalContent
{
    // class methods
    constructor ( modal, type, tr )
    {
        this.__modal__ = modal;
        this.__item__ = type;
        this.__tr__ = tr;
    }
    label ()
    {
        return `<div class="form-group">
            <label for="item-label" class="col-form-label">表示名差し替え</label>
            <input type="text" class="form-control" name="item_label" id="item-label" value="Label">
        </div>
        <div class="form-group">
            <label for="item-text" class="col-form-label"></label>
            <input type="text" class="form-control" name="item_text" id="item-text" value="新規">
        </div>`;
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
    method3 () { }

    [ '__run__' ] ()
    {
        this.__modal__.find( 'form' ).html( this[ this.__item__ ]() );

        var self = this;
        this.__modal__.find( '.btn-primary' ).on( 'click', function ()
        {
            self[ `change_item_${ self.__item__ }` ]( self.__modal__, self.__tr__ );
        } );
    }
}