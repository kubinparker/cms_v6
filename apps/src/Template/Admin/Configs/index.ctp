<?php $this->start('beforeHeaderClose'); ?>

<?php $this->end(); ?>

<div class="title_area">
	<h1>ページ作成</h1>
	<div class="pankuzu">
		<ul>
			<?= $this->element('pankuzu_home'); ?>
			<li>ページ作成</li>
		</ul>
	</div>
</div>

<div class="content_inr">
	<div class="box">
		<h3>ページ作成</h3>
		<div class="table_area form_area">
			<?= $this->Form->create(null, ['type' => 'file', 'id' => 'frm-form']); ?>
			<table class="vertical_table table__meta">
				<tr>
					<td>ページタイトル<span class="attent">※必須</span></td>
					<td>
						<?= $this->Form->control('title', ['label' => false, 'label' => false]); ?>
						<span>※100文字以内で入力してください</span>
					</td>
				</tr>
				<tr>
					<td>Slug<span class="attent">※必須</span></td>
					<td>
						<?= $this->Form->control('slug', ['label' => false]); ?>
						<span>※15文字以内で入力してください</span>
					</td>
				</tr>
				<tr>
					<td>管理部分</td>
					<td>
						<?= $this->Form->checkbox('management_part[]', ['value' => 0, 'hiddenField' => false, 'id' => 'front-part']); ?>
						<?= $this->Form->label('front_part', '表側'); ?>
						<?= $this->Form->checkbox('management_part[]', ['value' => 1, 'hiddenField' => false, 'id' => 'admin-part']); ?>
						<?= $this->Form->label('admin_part', '管理側'); ?>
					</td>
				</tr>
			</table>
			<div class="btn_area btn_area--center">
				<a href="#" class="btn_confirm submitButton">作成する</a>
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