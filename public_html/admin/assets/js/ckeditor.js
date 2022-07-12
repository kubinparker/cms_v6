function handleSaveButton ( editor )
{
    $( '.submitButton' ).on( 'click', evt =>
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
                uploadUrl: '/user/user-sites/upload-image-event',
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
            console.error( error );
        } );
} );