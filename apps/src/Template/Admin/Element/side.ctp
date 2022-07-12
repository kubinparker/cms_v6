<div id="side">
    <nav>
        <ul class="menu scrollbar">
            <?php if ($role == 0) : ?>
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
                    <li>
                        <span class="parent_link">メニュー</span>
                        <ul class="submenu">
                            <li>
                                <?php foreach ($ds as $menu) : ?>
                                    <?= $this->Html->link(
                                                    $menu->title,
                                                    [],
                                                    ['style' => 'padding-top:30px;']
                                                ); ?>
                                <?php endforeach; ?>
                            </li>
                        </ul>
                    </li>
                <?php endforeach; ?>
            <?php elseif ($role != 0) : ?>
                <li>
                    <span class="parent_link">メニュー</span>
                    <ul class="submenu">
                        <li>
                            <?php foreach ($ds as $menu) : ?>
                                <?= $this->Html->link(
                                            $menu->title,
                                            [],
                                            ['style' => 'padding-top:30px;']
                                        ); ?>
                            <?php endforeach; ?>
                        </li>
                    </ul>
                </li>
            <?php endif; ?>
        </ul>
    </nav>
</div>