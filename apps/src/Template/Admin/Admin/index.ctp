<?php $this->start('beforeHeaderClose') ?>
<style>
	.btn_send.btn_search {
		padding-right: 40px !important;
		line-height: 1.5 !important
	}

	.parent_link {
		line-height: 1.4 !important
	}

	h3 a {
		text-decoration: none !important;
		color: #fff !important;
	}

	.user-layout #content .btn_area .btn_send,
	.btn_area {
		width: 100% !important;
	}

	.row {
		margin: 0 !important;
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
		<?php if (empty($menu)) continue; ?>
		<div class="box">
			<h3 style="margin-bottom:20px;" class="box_h3"><?= $title == '設定' ? '<a href="/admin/configs/clear-config">設定</a>' : html_decode($title); ?></h3>
			<div class="row row-cols-4">
				<?php foreach ($menu as $slug => $name) : ?>
					<div class="btn_area" style="text-align:left;margin-left: 20px;margin-bottom: 10px !important;width: 280px!important;">
						<div class="col">
							<?= $this->Html->link(
								$name,
								['prefix' => 'admin', 'controller' => strtolower($slug), 'action' => 'index'],
								['class' => 'btn_send btn_search', 'style' => 'width:130px;text-align:center;']
							); ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	<?php endforeach; ?>

	<?= $this->element('menu_home', ['h3' => '日本語版', 'config_' => $config_list]); ?>
	<?= $this->element('menu_home', ['h3' => 'ENGLISH', 'config_' => $config_list_en]); ?>
</div>