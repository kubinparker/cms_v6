<?php $this->start('beforeHeaderClose'); ?>

<?php $this->end(); ?>

<div class="title_area">
	<h1>ユーザー管理</h1>
	<div class="pankuzu">
		<ul>
			<?= $this->element('pankuzu_home'); ?>
			<li><a href="<?= $this->Url->build(['action' => 'index']); ?>">一覧画面</a></li>
			<li><span><?= (@$data->id > 0) ? '編集' : '新規登録'; ?></span></li>
		</ul>
	</div>
</div>

<div class="content_inr">
	<div class="box">
		<h3 class="box_h3"><?= (@$data->id > 0) ? '編集' : '新規登録'; ?></h3>
		<?= $this->Flash->render('post_fail') ?>
		<div class="table_area form_area">
			<?= $this->Form->create($entity, ['type' => 'file', 'id' => 'frm-form']); ?>
			<table class="vertical_table table__meta">
				<tr>
					<td>氏名<span class="attent">※必須</span></td>
					<td>
						<?= $this->Form->control('name', ['label' => false, 'label' => false]); ?>
						<span>※60文字以内で入力してください</span>
					</td>
				</tr>
				<tr>
					<td>メールアドレス<span class="attent">※必須</span></td>
					<td>
						<?= $this->Form->control('email', ['label' => false]); ?>
						<span>※60文字以内で入力してください</span>
					</td>
				</tr>
				<tr>
					<td>ログインネーム<span class="attent">※必須</span></td>
					<td>
						<?= $this->Form->control('username', ['label' => false]); ?>
						<span>※30文字以内で入力してください</span>
					</td>
				</tr>
				<tr>
					<td>パスワード<span class="attent">※必須</span></td>
					<td>
						<?= $this->Form->control('password', ['label' => false]); ?>
					</td>
				</tr>
				<tr>
					<td>権限</td>
					<td>
						<?= $this->Form->control('role', ['type' => 'select', 'options' => $role_list, 'label' => false]); ?>
					</td>
				</tr>
				<tr>
					<td>掲載中/下書き</td>
					<td>
						<?= $this->Form->control('status', ['type' => 'select', 'options' => ['publish' => '掲載中', 'draft' => '下書き'], 'label' => false]); ?>
					</td>
				</tr>
			</table>
			<div class="btn_area btn_area--center">
				<a href="#" class="btn_confirm submitButton"><?= @$data->id > 0 ? '変更する' : '登録する' ?></a>
				<?php if (@$data->id > 0) ?><a href="javascript:kakunin('データを完全に削除します。よろしいですか？','<?= $this->Url->build(['action' => 'delete', $data['id'], 'content']) ?>')" class="btn_delete">削除する</a>
			</div>
			<?= $this->Form->end(); ?>
		</div>
	</div>
</div>

<?php $this->start('beforeBodyClose'); ?>

<script>
	function kakunin(msg, url) {
		if (confirm(msg)) {
			location.href = url;
		}
	}

	$(function() {
		$('.submitButton').on('click', evt => $('#frm-form').submit());
	});
</script>

<?php $this->end(); ?>