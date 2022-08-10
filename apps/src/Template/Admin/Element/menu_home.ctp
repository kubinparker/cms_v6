<div class="box">
    <h3 style="margin-bottom:20px;" class="box_h3"><?= $h3 ?></h3>
    <div class="row row-cols-4">
        <?php foreach ($config_ as $menu) : ?>
            <div class="btn_area" style="text-align:left;margin-left: 20px;margin-bottom: 10px !important;">
                <div class="col">
                    <?php
                    $url = ['prefix' => 'admin', 'controller' => strtolower($menu->slug), 'action' => 'index'];
                    ?>
                    <?= $this->Html->link(
                        $menu->title,
                        $url,
                        ['class' => 'btn_send btn_search', 'style' => 'width:130px;text-align:center;']
                    ); ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>