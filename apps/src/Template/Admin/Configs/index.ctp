<?php $this->start('beforeHeaderClose'); ?>
<?= $this->Html->css([
	"/admin/assets/css/config.css",
]); ?>
<script src="/admin/common/js/ckeditor.js"></script>
<script src="/admin/common/js/ja.js"></script>
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
		<?= $this->Form->create($entity, ['type' => 'file', 'id' => 'frm-form']); ?>
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
							'hiddenField' => false,
							'default' => 0
						]);
						if (isset($entity->getErrors()['management_part'])) :
						?>
							<div class="error-message"><?= array_values($entity->getErrors()['management_part'])[0] ?></div>
						<?php endif ?>
					</td>
				</tr>
			</table>
		</div>
		<?= $this->element('user_config') ?>
		<?= $this->element('admin_config') ?>
		<?= $this->Form->end(); ?>
		<div class="btn_area btn_area--center">
			<a href="#" class="btn_confirm submitButton">作成する</a>
		</div>
	</div>
</div>

<?php $this->start('beforeBodyClose'); ?>

<script>
	function renderCkeditor() {
		DecoupledEditor
			.create(document.querySelector('#editor'), {
				language: 'ja'
			}).then(editor => {
				const toolbarContainer = document.querySelector('#toolbar-container');
				toolbarContainer.appendChild(editor.ui.view.toolbar.element);
			})
			.catch(function(error) {});
	}


	function removeItem(e, type) {
		$(e).parents('tr').remove();
		var b = $(`li.${type} b`),
			countB = parseInt(b.text());
		b.text(countB - 1);
	}


	function addItem(e, type) {
		var $this = $(e),
			parentLi = $this.parents('li'),
			b = parentLi.find('b'),
			countB = parseInt(b.text());

		if (type == 'textarea_editor' && countB >= 1) return false;

		$.ajax({
			url: '/admin/configs/getItem',
			type: 'post',
			data: {
				'type': type
			},
			dataType: 'json',
			success: function(resp) {
				if (!resp.success) return false;
				$('.list-box-item-content table').append(resp.data);
				if (type == 'textarea_editor') renderCkeditor();
				b.text(countB + 1);
				$(".list-box-item-content").scrollTop($(".list-box-item-content")[0].scrollHeight);
			}
		});
	}


	$(function() {
		$('.submitButton').on('click', evt => {
			if ($("#title").val().replace(/^\s+|\s+$/gm, '') == '' || $("#slug").val().replace(/^\s+|\s+$/gm, '') == '') {
				alert('ページタイトル又はSlugを記入していません。')
				return false;
			}

			var thisRegex = new RegExp('/^[a-zA-Z0-9]+$/u');

			if (!thisRegex.test($("#slug").val())) {
				alert('※Slugはアンファーベストと数字だけで入力してください。')
				return false;
			}
			$('#frm-form').submit();
		});

		$('.management_part').change(function() {
			var box = $(`.box-id-${$(this).val()}`);
			if ($(this).is(':checked')) box.removeClass('display_none');
			else box.addClass('display_none');
		});

		$('.list-box-item .btn').click(function() {
			$(this).parent('.list-box-item').toggleClass('active');
		});
	});
</script>

<?php $this->end(); ?>