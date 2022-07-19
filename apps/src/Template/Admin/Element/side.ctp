<?php

use App\Model\Entity\User;
?>
<div id="side">
    <nav>
        <ul class="menu scrollbar">
            <?php if (in_array($role, [User::ROLE_DEVELOP, User::ROLE_ADMIN], true)) : ?>
                <?php foreach ($user_site_list as $slug => $page_name) : ?>
                    <li>
                        <span class="parent_link"><?= html_decode($page_name); ?></span>
                        <ul class="submenu">
                            <li>
                                <?= $this->Html->link(
                                    '一覧画面',
                                    ['prefix' => 'admin', 'controller' => strtolower($slug), 'action' => 'index'],
                                ); ?>
                                <?= $this->Html->link(
                                    '新規登録',
                                    ['prefix' => 'admin', 'controller' => strtolower($slug), 'action' => 'edit'],
                                ); ?>
                            </li>
                        </ul>
                    </li>
                <?php endforeach; ?>
            <?php endif ?>
            <li>
                <span class="parent_link">メニュー</span>
                <ul class="submenu">
                    <li>
                        <?php foreach ($config_list as $menu) : ?>
                            <?= $this->Html->link($menu->title, ['prefix' => 'admin', 'controller' => strtolower($menu->slug), 'action' => 'index']); ?>
                        <?php endforeach; ?>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</div>