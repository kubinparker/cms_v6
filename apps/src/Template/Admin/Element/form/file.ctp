<?php $accept = isset($accept) && $accept != '' ? $accept : false ?>
<!-- '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' -->
<?= $this->Form->input('files[]', ['type' => 'file', 'label' => false, 'onchange' => 'uploadFile(this, "' . $ModelName . '")', 'multiple' => 'true', 'error' => false, 'accept' => $accept]); ?>
<?php if ($accept) : ?><div class="remark">※ <?= $accept ?> ファイルのみ</div><?php endif ?>
<div class="remark">※１度に10ファイル分（合計32MB以内）のアップロードが可能です</div>
<div class="progress display_none">
    <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
</div>

<?php if (isset($entity->attaches['files'])) :
    foreach ($entity->attaches['files'] as $att) : ?>
        <?php $classFile = in_array($att->extension, ['xls', 'xlsx'], true) ? 'xls' : $att->extension ?>
        <?php $classFile = in_array($classFile, ['doc', 'docx'], true)  ? 'doc' : $classFile ?>
        <p class="row_file">
            <a class="is_file <?= $classFile ?>" href="<?= $att->path ?>" target="_blank"><?= h($att->original_file_name) ?></a>
            <span onclick="removeFile(this)">削除</span>
            <input type="hidden" name="__files[<?= h(str_replace(']', '=&', $att->original_file_name)) ?>][path]" value="<?= $att->path ?>">
            <input type="hidden" name="__files[<?= h(str_replace(']', '=&', $att->original_file_name)) ?>][size]" value="<?= $att->size ?>">
        </p>
    <?php endforeach; ?>
<?php endif ?>

<?php if ($this->Form->isFieldError('files') || $this->Form->isFieldError('__files')) : ?>
    <div class="error-message">
        <div class="error-message"><?= $this->Form->error('files') . $this->Form->error('__files') ?></div>
    </div>
<?php endif ?>