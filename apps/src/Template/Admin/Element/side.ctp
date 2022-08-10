<style>
    .side_li {
        border-bottom: 1px solid #828282;
    }

    .menu_active {
        background: #cccccc5c;
    }
</style>
<div id="side">
    <nav style="height: 100%; overflow: auto;">
        <ul class="menu scrollbar">
            <h3 class="text-center bb-1">日本語版</h3>
            <?php foreach ($config_list as $menu) : ?>
                <?php
                $url = ['prefix' => 'admin', 'controller' => strtolower($menu->slug), 'action' => 'index'];
                ?>
                <li class="side_li">
                    <?= $this->Html->link($menu->title, $url, ['class' => strtolower($menu->slug) == strtolower($ModelName) ? 'menu_active' : '']); ?>
                </li>
            <?php endforeach; ?>
        </ul>

        <ul class="menu scrollbar">
            <h3 class="text-center bb-1" style="margin-top:50px;">ENGLISH</h3>
            <?php foreach ($config_list_en as $menu) : ?>
                <?php
                $url = ['prefix' => 'admin', 'controller' => strtolower($menu->slug), 'action' => 'index'];
                ?>
                <li class="side_li">
                    <?= $this->Html->link($menu->title, $url, ['class' => strtolower($menu->slug) == strtolower($ModelName) ? 'menu_active' : '']); ?>
                </li>
            <?php endforeach; ?>
        </ul>
    </nav>
</div>