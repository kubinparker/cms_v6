<?php $this->start('beforeHeaderClose') ?>
<style>
	.btn_send.btn_search {
		padding-right: 40px !important;
		line-height: 1.5 !important
	}

	.parent_link {
		line-height: 1.4 !important
	}
</style>
<?php $this->end() ?>
<div class="title_area">
	<h1>管理メニュー</h1>
	<div class="pankuzu">
		<ul>
			<?= $this->element('pankuzu_home'); ?>
			<li><span>管理メニュー</span></li>
		</ul>
	</div>
</div>
<div class="content_inr">
	<?php foreach ($user_menu_list as $title => $menu) : ?>
		<div class="box">
			<h3 style="margin-bottom:20px;"><?= html_decode($title); ?></h3>
			<?php foreach ($menu as $m) : ?>
				<div class="btn_area" style="text-align:left;margin-left: 20px;margin-bottom: 10px !important;">
					<?php foreach ($m as $name => $link) : ?>
						<a href="<?= $link; ?>" class="btn_send btn_search" style="width:130px;text-align:center;"><?= h($name); ?></a>
					<?php endforeach; ?>
				</div>
			<?php endforeach; ?>
		</div>
	<?php endforeach; ?>
</div>