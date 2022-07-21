<?= $this->Form->input('images[]', ['type' => 'file', 'label' => false, 'onchange' => 'uploadImages(this,"' . $ModelName . '")', 'multiple' => 'true', 'error' => false, 'accept' => 'image/jpeg,image/png,image/gif']); ?>
<div class="remark">※jpeg , jpg , gif , png ファイルのみ</div>
<div class="remark">※横幅700以上を推奨。1200x1200以内に縮小されます</div>
<div class="remark">※１度に10ファイル分（合計32MB以内）のアップロードが可能です</div>

<?php if (isset($entity->attaches['images'])) :
    foreach ($entity->attaches['images'] as $att) : ?>

        <p class="row_file data_image">
            <img src="<?= $att->path ?>" alt="<?= h($att->original_file_name) ?>" />
            <span onclick="removeFile(this)">削除</span>
            <input type="hidden" name="__images[<?= h(str_replace(']', '=&', $att->original_file_name)) ?>][path]" value="<?= $att->path ?>" />
            <input type="hidden" name="__images[<?= h(str_replace(']', '=&', $att->original_file_name)) ?>][size]" value="<?= $att->size ?>" />
        </p>

    <?php endforeach; ?>
<?php endif ?>

<?php if ($this->Form->isFieldError('images')) : ?>
    <div class="error-message">
        <div class="error-message"><?= $this->Form->error('images') ?></div>
    </div>
<?php endif ?>