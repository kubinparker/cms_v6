<div id="side">
    <nav>
        <ul class="menu scrollbar">
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
        </ul>
    </nav>
</div>