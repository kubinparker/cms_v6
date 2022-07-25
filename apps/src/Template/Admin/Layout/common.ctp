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
    <?= $this->fetch('css'); ?>

    <?= $this->Html->script([
        "/admin/common/js/jquery-3.5.1.min",
        "/admin/common/js/jquery.datetimepicker.full.min",
        "/admin/common/js/common",
        "/assets/js/js_library",
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

    <?= $this->fetch('beforeBodyClose'); ?>
</body>

</html>