<div class="title_area">
	<h1>ユーザー管理</h1>
	<div class="pankuzu">
		<ul>
			<?= $this->element('pankuzu_home'); ?>
			<li><span>ユーザー管理</span></li>
		</ul>
	</div>
</div>

<div class="content_inr">
	<div class="box">
		<h3 class="box__caption--count box_h3"><span>登録一覧</span><span class="count"><?= $total_count ?>件の登録</span></h3>
		<div class="btn_area" style="margin-top:10px;"><a href="<?= $this->Url->build(['action' => 'edit']); ?>" class="btn_confirm btn_post">新規登録</a></div>
		<div class="table_area">
			<table class="table__list" style="table-layout: fixed;">
				<colgroup>
					<col style="width: 135px;">
					<col style="width: 200px;">
					<col>
					<col style="width: 350px;">
					<col style="width: 120px;">
				</colgroup>
				<tr>
					<th>ステイタス</th>
					<th>ログインネーム</th>
					<th>氏名</th>
					<th>メールアドレス</th>
					<th style="text-align:center;">権限</th>
				</tr>
				<?php foreach ($users as $user) : ?>
					<?php
					$is_publish =  $user->status === 'publish';

					$status_class = $is_publish ? 'visible' : 'unvisible';
					$status_text = $is_publish ? '掲載中' : '下書き';
					$status_btn_class = $is_publish ? 'visi' : 'unvisi';
					?>
					<tr class="<?= $status_class ?>" id="content-<?= $user->id ?>">
						<td>
							<div onclick="changeStatus('<?= $is_publish ? 'draft' : 'publish' ?>',<?= $user->id ?>, '<?= strtolower($ModelName) ?>')" class="<?= $status_btn_class ?>">
								<a class="scroll_pos"><?= $status_text ?></a>
							</div>
						</td>
						<td><?= h($user->username) ?></td>
						<td><?= $this->Html->link(h($user->name), ['action' => 'edit', $user->id]) ?></td>
						<td><?= h($user->email) ?></td>
						<td style="text-align:center;"><?= isset($role_list[$user->role]) ? $role_list[$user->role] : '' ?></td>
					</tr>
				<?php endforeach; ?>
			</table>
		</div>
		<div class="btn_area" style="margin-top:10px;"><a href="<?= $this->Url->build(['action' => 'edit']); ?>" class="btn_confirm btn_post">新規登録</a></div>
	</div>
</div>