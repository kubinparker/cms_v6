<?php

use App\Model\Entity\User;
?>
<style>
    .side_li {
        border-bottom: 1px solid #828282;
    }

    .menu_active {
        background: #cccccc5c;
    }
</style>

<div id="side">
    <?php if (in_array($role, [User::ROLE_DEVELOP, User::ROLE_ADMIN], true)) : ?>
        <nav>
            <ul class="menu scrollbar">
                <h3 class="text-center bb-1">管理設定</h3>
                <li class="side_li">
                    <a href="users">ユーザ管理</a>
                </li>
                <?php if (in_array($role, [User::ROLE_DEVELOP], true)) : ?>
                    <li class="side_li">
                        <a href="configs">コンテンツ設定</a>
                    </li>
                <?php endif ?>
            </ul>
        </nav>
    <?php endif ?>
    <nav style="height: 100%; overflow: auto;">
        <ul class="menu scrollbar">
            <h3 class="text-center bb-1">コンテンツ</h3>
            <?php foreach (@$config_list as $menu) : ?>
                <li class="side_li">
                    <?= $this->Html->link($menu->title, ['prefix' => 'admin', 'controller' => strtolower($menu->slug), 'action' => 'index'], ['class' => strtolower($menu->slug) == strtolower($ModelName) ? 'menu_active' : '']); ?>
                </li>
            <?php endforeach; ?>
        </ul>
    </nav>

</div>