<?php $this->start('beforeHeaderClose'); ?>
<?= $this->Html->css([
	"/admin/assets/css/config.css",
]); ?>
<script src="/admin/common/js/ckeditor.js"></script>
<script src="/admin/common/js/ja.js"></script>
<?php $this->end(); ?>
<style>
	.button {
		position: relative;
		padding: 12px 24px;
		background: #009579;
		border: none;
		outline: none;
		border-radius: 2px;
		cursor: pointer;
	}

	.button--loading .button__text {
		visibility: hidden;
		opacity: 0;
	}

	.button--loading::after {
		content: "";
		position: absolute;
		width: 26px;
		height: 26px;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		border: 4px solid transparent;
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: button-loading-spinner 1s ease infinite;
	}

	@keyframes button-loading-spinner {
		from {
			transform: rotate(0turn);
		}

		to {
			transform: rotate(1turn);
		}
	}
</style>
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
			<!-- <a href="#" class="btn_confirm submitButton">作成する</a> -->

			<button type="button" class="btn_confirm submitButton button">
				<span class="button__text">作成する</span>
			</button>
		</div>
	</div>
</div>

<div class="modal fade" id="modal-option" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="exampleModalLabel">項目設定</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form>
					<!-- <div class="form-group">
						<label for="recipient-name" class="col-form-label">Recipient:</label>
						<input type="text" class="form-control" id="recipient-name">
					</div>
					<div class="form-group">
						<label for="message-text" class="col-form-label">Message:</label>
						<textarea class="form-control" id="message-text"></textarea>
					</div> -->
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">閉じる</button>
				<button type="button" class="btn btn-primary">同意する</button>
			</div>
		</div>
	</div>
</div>

<?php $this->start('beforeBodyClose'); ?>
<?= $this->Html->script([
	"/admin/common/js/popper.min",
	"/admin/common/js/bootstrap.min",
	'/admin/assets/js/drag-arrange',
	'/admin/assets/js/build-modal',
]); ?>
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

		if (__._array.in_array(type, ['textarea_editor', 'file', 'images']) && countB >= 1) return false;

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
				dragDrop();
			}
		});
	}


	function dragDrop() {
		$('.list-box-item-content table tr').arrangeable({
			dragSelector: '.move_icon'
		});
	}


	$(function() {
		$('.submitButton').on('click', evt => {
			if ($("#title").val().replace(/^\s+|\s+$/gm, '') == '' || $("#slug").val().replace(/^\s+|\s+$/gm, '') == '') {
				alert('ページタイトル又はSlugを記入していません。')
				return false;
			}

			var thisRegex = new RegExp(/^[a-zA-Z0-9]+$/g);

			if (!thisRegex.test($("#slug").val())) {
				alert('※Slugはアンファーベストと数字だけで入力してください。')
				return false;
			}
			$(this).addClass('button--loading');
			$('table.admin_table tr').each(function(i) {
				var attrs = [].filter.call($(this).find('.item_options')[0].attributes, function(at) {
					return at.name !== 'type' && at.name !== 'class';
				});
				var tr = $(this);
				tr.find('.data_options').remove();

				attrs.forEach(element => {
					tr.append(`<input type="hidden" class="data_options" name="data_options[${i}][${element.name}]" value="${element.value}"/>`);
				});
			});
			setTimeout(() => {
				$('#frm-form').submit();
			}, 800);
		});

		$('.management_part').change(function() {
			var box = $(`.box-id-${$(this).val()}`);
			if ($(this).is(':checked')) box.removeClass('display_none');
			else box.addClass('display_none');
		});

		$('.list-box-item .btn').click(function() {
			$(this).parent('.list-box-item').toggleClass('active');
		});

		// add more option for item (MODAL)
		$('#modal-option').on('show.bs.modal', function(event) {
			var button = $(event.relatedTarget);
			var recipient = button.data('whatever');
			var tr = button.parents('tr');
			var modal = $(this);
			button.addClass('btn-active');

			new BuildModalContent(modal, recipient, tr).__run__();
		});

		// close MODAL event
		$('#modal-option').on('hidden.bs.modal', function(event) {
			$('span.plus_icon').removeClass('btn-active');
			$(this).find('form').trigger('reset');
		});
	});
</script>

<?php $this->end(); ?>