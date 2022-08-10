<?php $this->start('beforeHeaderClose'); ?>
<style>
    pre {
        counter-reset: line;
        margin: 1em 0;
        background-color: #f1f2f3;
        border: 1px solid #e5e5e5;
        padding: 1em;
        overflow: auto;
        background-color: #f6f8fa;
        border-radius: 3px;
        line-height: 1.45;
    }

    code {
        counter-increment: line;
        color: #24292e;
        font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        line-height: 1.45;
    }

    code:before {
        content: counter(line);
        padding: 5px 10px;
        border-right: 1px solid #ccc;
        text-align: right;
        width: 50px;
        display: inline-block;
        margin-right: 10px;
    }
</style>
<?php $this->end(); ?>
<div class="title_area">
    <h1>作成ファイル詳細</h1>
    <div class="pankuzu">
        <ul>
            <?= $this->element('pankuzu_home'); ?>
            <li><span>作成ファイル詳細</span></li>
        </ul>
    </div>
</div>

<div class="content_inr">
    <div class="box">
        <h3 class="box__caption--count box_h3"><span>作成ファイル詳細</span></h3>

        <div class="table_area">
            <?php
            $create_data = $entity->create_data ?? [];
            foreach ($create_data as $view_code) : ?>
                <div>
                    <a onclick="toggleBoxCode(this)" style="cursor: pointer; user-select: none; padding: 5px; display: block;"><?= str_replace(ROOT, '/apps', $view_code[0]) ?></a>
                    <div class="box-code display_none">
                        <?= $view_code[1] ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <div class="btn_area" style="padding-top:100px;"><a href="<?= $this->Url->build(['prefix' => 'admin', 'controller' => $entity->slug, 'action' => 'index']); ?>" class="btn_confirm btn_post">【<?= h($entity->title) ?>】へ</a></div>
    </div>
</div>
<?php $this->start('beforeBodyClose'); ?>
<script>
    function toggleBoxCode(e) {
        $(e).siblings('.box-code').toggleClass('display_none');
    }
</script>

<?php $this->end(); ?>