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
	<div class="box config">
		<h3>ページ作成</h3>
		<?php $this->Form->setTemplates([
			'nestingLabel' => '{{hidden}}{{input}}<label{{attrs}}>{{text}}</label>',
			'formGroup' => '{{input}}{{label}}',
			'checkboxWrapper' => '<div class="checkbox checkbox-inline">{{label}}</div>'
		]); ?>
		<?= $this->Form->create($config, ['type' => 'file', 'id' => 'frm-form']); ?>
		<div class="table_area form_area">
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
						<?php
						$options = ['表側', '管理側'];
						echo $this->Form->select('management_part', $options, [
							'multiple' => 'checkbox',
							'class' => 'management_part',
							'label' => ['class' => 'mar_r20'],
							'hiddenField' => false
						]);
						?>
					</td>
				</tr>
			</table>
		</div>
		<div class="box box-id-0">
			<h3>表側</h3>
			<div class="table_area">
				<table>
					<tr>
						<?php foreach ($font_config as $key => $type) : ?>
							<td class="w-50 pad_b25 position_relative">
								<?= $this->Form->radio('font_type', [$key => ''], ['label' => false, 'hiddenField' => false, 'default' => 0]); ?>
								<label for="font-type-<?= $key ?>"><img src="/admin/common/images/cms/<?= $key == 0 ? 'info' : 'contact' ?>_default.png"></label>
								<div class="position_absolute position_bottom_<?= $key ?>">
									<?= $this->Form->select('font_type_options_' . $key, $type['options'], [
										'multiple' => 'checkbox',
										'label' => ['class' => 'mar_r20'],
										'hiddenField' => false
									]); ?>
								</div>
							</td>
						<?php endforeach; ?>
					</tr>
				</table>
			</div>
		</div>
		<div class="box box-id-1 display_none">
			<h3>管理側</h3>
			<div class="table_area">
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
				</table>
			</div>
		</div>
		<?= $this->Form->end(); ?>
		<div class="btn_area btn_area--center">
			<a href="#" class="btn_confirm submitButton">作成する</a>
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

		$('.management_part').change(function() {
			var box = $(`.box-id-${$(this).val()}`);
			if ($(this).is(':checked')) box.removeClass('display_none');
			else box.addClass('display_none');
		});
	});
</script>

<?php $this->end(); ?>