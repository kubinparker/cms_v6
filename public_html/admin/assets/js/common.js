function kakunin ( msg, url )
{
    if ( confirm( msg ) ) location.href = url;
}


/** Callback Function 
    * 
    * Ckeditorの内容にファイルのアップロード機能を利用すれば、
    * 必ず↓の「__uploadFile」Functionを定義しないとアップロード完了できない。
    * ＠param files: 選択されたファイルのデータ
    * ＠param editor: Ckeditor Object
    * ＠＠param htmlDP: HtmlDataProcessor (https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_dataprocessor_htmldataprocessor-HtmlDataProcessor.html)
    * 
    */

function __uploadFile ( files, editor, htmlDP )
{
    var fd = new FormData();

    if ( files.length > 10 )
    {
        alert( '最大１０ファイルまでしかアップロードできません。' );
        return false;
    }

    var total_size = 0;
    var is_check_size = false;

    for ( let i = 0; i < files.length; i++ )
    {
        const __size = ( files[ i ].size / 1024 / 1024 ).toFixed( 2 );
        total_size += parseFloat( __size );

        if ( __size > 32 || total_size > 32 )
        {
            is_check_size = true;
            break;
        }
        fd.append( 'files[]', files[ i ] );
    };

    if ( is_check_size )
    {
        alert( '総容量は３２MBが超えました。' );
        return false;
    }

    return $.ajax( {
        'url': "/admin/configs/upload-files",
        'contentType': false,
        'processData': false,
        'method': 'post',
        'data': fd,
        'dataType': 'json',
        'success': function ( resp )
        {
            // response型
            // {
            //     success: true / false,
            //     data: [{
            //             original_name: 'オリジナルファイル名',
            //             url: '保存されたファイルのパス'
            //         },
            //         ...
            //     ]
            // }

            for ( let i = 0; i < resp.data.length; i++ )
            {
                editor.model.change( writer =>
                {
                    editor.model.insertContent(
                        // a tag
                        writer.createText( resp.data[ i ].original_name, {
                            linkHref: resp.data[ i ].url
                        } ),
                        // Ckeditor内に追加するPosition
                        editor.model.document.selection
                    );
                } );
            }

        }
    } );
}


function uploadFile ( e )
{
    var fd = new FormData();
    var files = $( e )[ 0 ].files;

    $( e ).parent( 'td' ).find( '.error-message' ).remove();

    if ( files.length > 10 )
    {
        $( e )
            .parent( 'td' )
            .append( `<div class="error-message">
                <div class="error-message">最大１０ファイルまでしかアップロードできません。</div>
            </div>`);

        return false;
    }

    var total_size = 0;

    var is_check_size = false;

    for ( let i = 0; i < files.length; i++ )
    {
        const __size = ( files[ i ].size / 1024 / 1024 ).toFixed( 2 );
        total_size += parseFloat( __size );

        if ( __size > 32 || total_size > 32 )
        {
            is_check_size = true;
            break;
        }
        fd.append( 'files[]', files[ i ] );
    };

    if ( is_check_size )
    {
        $( e )
            .parent( 'td' )
            .append( `<div class="error-message">
                <div class="error-message">総容量は３２MBが超えました。</div>
            </div>`);

        return false;
    }
    $.ajax( {
        'url': "/admin/configs/upload-files",
        'contentType': false,
        'processData': false,
        'method': 'post',
        'data': fd,
        'dataType': 'json',
        'success': function ( resp )
        {
            if ( resp.success )
            {
                for ( let i = 0; i < resp.data.length; i++ )
                    $( e ).parents( 'td' ).append( `
                        <p class="row_file">
                            <a class="is_file ${ resp.data[ i ].class }" href="${ resp.data[ i ].url }" target="_blank">${ resp.data[ i ].original_name }</a>
                            <span onclick="removeFile(this)">削除</span>
                            <input type="hidden" name="__files[${ resp.data[ i ].original_name }][path]" value="${ resp.data[ i ].url }"/>
                            <input type="hidden" name="__files[${ resp.data[ i ].original_name }][size]" value="${ resp.data[ i ].size }"/>
                        </p>
                    `);
            }
        }
    } );
}


function removeFile ( e )
{
    $( e ).parents( 'p' ).remove();
    $( '#is-upload' ).val( 1 );
}


function handleSaveButton ( editor )
{

    $( '.submitButton' ).on( 'click', evt =>
    {
        if ( editor )
        {
            $( '#event-content' ).val( editor.getData() );

            const img_list = Array.from(
                new DOMParser()
                    .parseFromString( editor.getData(), 'text/html' )
                    .querySelectorAll( 'img' )
            )
                .map( img => `<input type="hidden" name="image[]" value="${ img.getAttribute( 'src' ) }">` );


            const file_list = Array.from(
                new DOMParser()
                    .parseFromString( editor.getData(), 'text/html' )
                    .querySelectorAll( 'a' )
            )
                .map( f => `<input type="hidden" name="_files[]" value="${ f.getAttribute( 'href' ) }">` );

            $( '#frm-form' ).append( img_list.join( '' ) )
            $( '#frm-form' ).append( file_list.join( '' ) )
        }
        setTimeout( () =>
        {
            $( '#frm-form' ).submit();
        }, 500 );

        return false;
    } );
}

$( function ()
{
    /**
         * CKeditor 設定
         */
    DecoupledEditor
        .create( document.querySelector( '#editor' ), {

            // 言語　（include ja.js　ファイル）
            language: 'ja',

            // イメージアップロードの設定
            simpleUpload: {
                // response型
                // {
                //     success: true / false,
                //     data: [{
                //             original_name: 'オリジナルファイル名',
                //             url: '保存されたファイルのパス',
                //             element: バリューは任意ですが必ず返す,
                //         },
                //         ...
                //     ]
                // }
                uploadUrl: '/admin/configs/upload-image-event',
                withCredentials: true,
                headers: {
                    // フォームの「csrfToken」Input Hiddenのバリューと同じ
                    'X-CSRF-TOKEN': csrfToken
                }
            },

            // 動画の設定
            mediaEmbed: {
                // 表側Playボタン押せるため
                previewsInData: true,
                // ↓の社会からの動画なら、追加できないよう
                removeProviders: [ 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook' ]
            },

            // フォントサイズ設定
            fontSize: {
                options: [ 'default',
                    14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
                ]
            },

            // a タグの設定
            link: {
                // attr target＝＿blank
                addTargetToExternalLinks: true,

                // 自動Detect Url
                decorators: {
                    detectFilePdf: {
                        mode: 'automatic',
                        callback: url => url.endsWith( '.pdf' ),
                        attributes: {
                            class: 'is_file pdf',
                            target: '_blank'
                        }
                    },
                    detectFileWord: {
                        mode: 'automatic',
                        callback: url => url.endsWith( '.doc' ) || url.endsWith( '.docx' ),
                        attributes: {
                            class: 'is_file doc',
                        }
                    },
                    detectFileXls: {
                        mode: 'automatic',
                        callback: url => url.endsWith( '.xls' ) || url.endsWith( '.xlsx' ),
                        attributes: {
                            class: 'is_file xls',
                        }
                    },
                    detectFileCsv: {
                        mode: 'automatic',
                        callback: url => url.endsWith( '.xls' ) || url.endsWith( '.csv' ),
                        attributes: {
                            class: 'is_file csv',
                        }
                    }
                }
            }
        } )
        .then( editor =>
        {
            // Toolbarの定義
            const toolbarContainer = document.querySelector( '#toolbar-container' );
            toolbarContainer.appendChild( editor.ui.view.toolbar.element );

            // 更新・登録ボタン
            handleSaveButton( editor );
        } )
        .catch( error =>
        {
            // console.log( error );
        } );

    handleSaveButton( false );
} );