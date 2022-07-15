<?php $this->start('css'); ?>
<?= $this->Html->css(["/admin/assets/css/edit"]); ?>
<?php $this->end(); ?>

<?= $this->Form->input('images[]', ['type' => 'file', 'label' => false, 'onchange' => 'uploadImages(this)', 'multiple' => 'true', 'error' => false, 'accept' => 'image/jpeg,image/png,image/gif']); ?>
<div class="remark">※jpeg , jpg , gif , png ファイルのみ</div>
<div class="remark">※横幅700以上を推奨。1200x1200以内に縮小されます</div>
<div class="remark">※１度に10ファイル分（合計32MB以内）のアップロードが可能です</div>