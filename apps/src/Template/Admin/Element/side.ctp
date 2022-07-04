<div id="side">
    <nav>
        <ul class="menu scrollbar">

            <?php foreach ($user_site_list as $id => $site_name) : ?>
                <li style="<?= $this->Session->read('current_site_id') == $id ? 'background: #ffffff52' : '' ?>">
                    <a href="<?= $this->Url->build(['prefix' => 'user', 'controller' => 'users', 'action' => 'siteChange', '?' => ['site' => $id]]) ?>"><?= html_decode($site_name) ?></a>
                </li>
            <?php endforeach; ?>

        </ul>
    </nav>
</div>