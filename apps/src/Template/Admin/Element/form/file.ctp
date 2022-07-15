<?php $this->start('css'); ?>
<?= $this->Html->css(["/admin/assets/css/edit"]); ?>
<?php $this->end(); ?>

<?= $this->Form->input('files[]', ['type' => 'file', 'label' => false, 'onchange' => 'uploadFile(this)', 'multiple' => 'true', 'error' => false, 'accept' => '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel']); ?>
<div class="remark">※ pdf, csv, xlsx, xls, doc, docx ファイルのみ</div>
<div class="remark">※１度に10ファイル分（合計32MB以内）のアップロードが可能です</div>

<?php if (isset($entity->attaches['files'])) :
    foreach ($entity->attaches['files'] as $att) : ?>
        <?php $classFile = in_array($att->extension, ['xls', 'xlsx'], true) ? 'xls' : $att->extension ?>
        <?php $classFile = in_array($classFile, ['doc', 'docx'], true)  ? 'doc' : $classFile ?>
        <p class="row_file">
            <a class="is_file <?= $classFile ?>" href="<?= $att->path ?>" target="_blank"><?= h($att->original_file_name) ?></a>
            <span onclick="removeFile(this)">削除</span>
            <input type="hidden" name="__files[<?= h($att->original_file_name) ?>][path]" value="<?= $att->path ?>">
            <input type="hidden" name="__files[<?= h($att->original_file_name) ?>][size]" value="<?= $att->size ?>">
        </p>
    <?php endforeach; ?>
<?php endif ?>

<?php if ($this->Form->isFieldError('files')) : ?>
    <div class="error-message">
        <div class="error-message"><?= $this->Form->error('files') ?></div>
    </div>
<?php endif ?>