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