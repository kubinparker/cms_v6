<!DOCTYPE html>
<html lang="ja">

<head>
    <?= $this->Html->charset(); ?>
    <meta name="viewport" content="<?php include WWW_ROOT . "admin/common/include/viewport.inc" ?>">
    <title><?= $__title__; ?></title>
    <link rel="shortcut icon" href="/favicon.ico">

    <?= $this->Html->css([
        "/admin/common/css/normalize",
        "/admin/common/css/font",
        "/admin/common/css/common",
        "/admin/common/css/cms",
        "/admin/common/css/cms_theme",
        "/admin/common/css/bootstrap.min",
        "/admin/common/css/jquery.datetimepicker",
    ]); ?>

    <?= $this->Html->script([
        "/admin/common/js/jquery-3.5.1.min",
        "/admin/common/js/jquery.datetimepicker.full.min",
        "/admin/common/js/common",
    ]); ?>

    <?= $this->fetch('beforeHeaderClose'); ?>
    <script>
        function render_csrfToken() {
            <?= sprintf(
                'var csrfToken = %s;',
                json_encode($this->request->getParam('_csrfToken'))
            ) ?>
            return csrfToken;
        }
        var csrfToken = render_csrfToken();
    </script>
</head>

<body class="user-layout">

    <?= $this->fetch('afterBodyStart'); ?>

    <div id="container">
        
        <?= $this->element('header'); ?>
        <?= $this->element('side'); ?>
        <?= $this->fetch('beforeContentStart'); ?>

        <div id="content">
            <?= $this->fetch('content'); ?>
            <?php include WWW_ROOT . "admin/common/include/footer.inc" ?>
        </div>

        <?= $this->fetch('afterContentClose'); ?>

    </div>
    <div id="kakunin_dialog" title="確認">
        <p></p>
    </div>

    <script>
        /** Callback Function 
         * 
         * Ckeditorの内容にファイルのアップロード機能を利用すれば、
         * 必ず↓の「__uploadFile」Functionを定義しないとアップロード完了できない。
         * ＠param files: 選択されたファイルのデータ
         * ＠param editor: Ckeditor Object
         * ＠＠param htmlDP: HtmlDataProcessor (https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_dataprocessor_htmldataprocessor-HtmlDataProcessor.html)
         * 
         */

        function __uploadFile(files, editor, htmlDP) {
            var fd = new FormData();

            if (files.length > 10) {
                alert('最大１０ファイルまでしかアップロードできません。');
                return false;
            }

            var total_size = 0;
            var is_check_size = false;

            for (let i = 0; i < files.length; i++) {
                const __size = (files[i].size / 1024 / 1024).toFixed(2);
                total_size += parseFloat(__size);

                if (__size > 32 || total_size > 32) {
                    is_check_size = true;
                    break;
                }
                fd.append('files[]', files[i]);
            };

            if (is_check_size) {
                alert('総容量は３２MBが超えました。');
                return false;
            }

            return $.ajax({
                'url': "/user/user-sites/upload-files",
                'contentType': false,
                'processData': false,
                'method': 'post',
                'data': fd,
                'dataType': 'json',
                'success': function(resp) {
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

                    for (let i = 0; i < resp.data.length; i++) {
                        editor.model.change(writer => {
                            editor.model.insertContent(
                                // a tag
                                writer.createText(resp.data[i].original_name, {
                                    linkHref: resp.data[i].url
                                }),
                                // Ckeditor内に追加するPosition
                                editor.model.document.selection
                            );
                        });
                    }

                }
            });
        }


        function uploadFile(e) {
            var fd = new FormData();
            var files = $(e)[0].files;

            $(e).parent('td').find('.error-message').remove();

            if (files.length > 10) {
                $(e)
                    .parent('td')
                    .append(`<div class="error-message">
                <div class="error-message">最大１０ファイルまでしかアップロードできません。</div>
            </div>`);

                return false;
            }

            var total_size = 0;

            var is_check_size = false;

            for (let i = 0; i < files.length; i++) {
                const __size = (files[i].size / 1024 / 1024).toFixed(2);
                total_size += parseFloat(__size);

                if (__size > 32 || total_size > 32) {
                    is_check_size = true;
                    break;
                }
                fd.append('files[]', files[i]);
            };

            if (is_check_size) {
                $(e)
                    .parent('td')
                    .append(`<div class="error-message">
                <div class="error-message">総容量は３２MBが超えました。</div>
            </div>`);

                return false;
            }
            // ... check size and max file on server ...
            $.ajax({
                'url': "/user/user-sites/upload-files",
                'contentType': false,
                'processData': false,
                'method': 'post',
                'data': fd,
                'dataType': 'json',
                'success': function(resp) {
                    if (resp.success) {
                        for (let i = 0; i < resp.data.length; i++)
                            $(e).parent('td').append(`
                        <p class="row_file">
                            <a class="is_file ${resp.data[i].class}" href="${resp.data[i].url}" target="_blank">${resp.data[i].original_name}</a>
                            <span onclick="removeFile(this)">X</span>
                            <input type="hidden" name="__files[${resp.data[i].original_name}]" value="${resp.data[i].url}"/>
                        </p>
                        `);
                    }
                }
            });
        }


        function removeFile(e) {
            $(e).parents('p').remove();
        }
    </script>


    <?= $this->fetch('beforeBodyClose'); ?>
</body>

</html>