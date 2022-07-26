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
        <h3 class="box__caption--count"><span>作成ファイル詳細</span></h3>
        
        <div class="table_area">
            <?php foreach ($entity->create_data as $view_code) : ?>
            <a href="" target="_blank"><?= $view_code ?></a></br>
            <?php endforeach; ?>
        </div>
        <div class="btn_area" style="padding-top:100px;"><a href="<?= $this->Url->build(['action' => 'index']); ?>" class="btn_confirm btn_post">TOPへ</a></div>
    </div>
</div>