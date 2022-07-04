<header>
	<p class="user__title">
		<a href="/admin/"><img src="/admin/common/images/theme/title_cms.png" alt="CATERS CMS"></a>
	</p>
	<h2>
		<?= isset($user_site_list[$this->Session->read('current_site_id')]) ? html_decode($user_site_list[$this->Session->read('current_site_id')]) : $__title__; ?>
	</h2>
	<div class="status">
		<a href="/" target="_blank"><i class="glyphs-pc"></i><span class="link_logout btn">サイト表示</span></a>
		<a href="/admin/logout" class="logout"><i class="glyphs-logout"></i><span class="link_logout btn">ログアウト</span></a>
	</div>
</header>