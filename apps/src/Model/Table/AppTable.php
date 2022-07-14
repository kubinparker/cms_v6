<?php

namespace App\Model\Table;

use Cake\ORM\Table;

use Cake\Event\Event;
use Cake\Datasource\EntityInterface;
use Cake\ORM\TableRegistry;


class AppTable extends Table
{
    public $code_upload = null;
    public $slug = null;

    public function afterSave(Event $event, EntityInterface $entity, \ArrayObject $options)
    {
        if (is_null($this->code_upload) || !$this->code_upload || is_null($this->slug)) return;


        $_id = $entity->id;
        $hash_code = $this->code_upload;

        $slug = $this->slug;

        $this->slug = null;

        // Ckeditorの各ファイル
        $files_in_content = @$entity->_files;
        // 添付ファイル
        $files_attach = @$entity->__files;

        $data_file = [
            'files_in_content' => $files_in_content,
            'files_attach' => $files_attach,
        ];

        // 館毎のイメージ保存パス
        $dir_img = 'upload/' . $slug . '/' . $_id . '/image/';
        // イベント毎のイメージ保存仮パス
        $tmp_upload_image = 'upload_tmp/' . $hash_code . '/';

        // 館毎のファイル保存パス
        $dir_file = 'upload/' . $slug . '/' . $_id . '/files/';
        // イベント毎のファイル保存仮パス
        $tmp_upload_file = 'upload_file_tmp/' . $hash_code . '/';

        if ($entity->content) {
            // upload image
            $entity->content = str_replace($tmp_upload_image, $dir_img, $entity->content);

            // old id edit
            // if ($save->__id) {
            //     $entity->content = str_replace(__($dir_image, [$save->__id]), $dir_img, $entity->content);
            //     $entity->content = str_replace(__($dir_files, [$save->__id]), $dir_file, $entity->content);
            // }
        }

        if ($entity->image) $this->__upload($dir_img, $tmp_upload_image, $entity->image);

        // upload file
        $tmp_file = $this->__upload($dir_file, $tmp_upload_file, $data_file, 'files');

        if ($entity->content) {
            foreach ($tmp_file['files_in_content'] as $tmp)
                $entity->content = str_replace($tmp[1], $tmp[0], $entity->content);

            $this->save($entity);
        }

        $model_attached = TableRegistry::getTableLocator()->get('Attached');
        $model_attached->deleteAll(['table_id' => $_id, 'slug' => $slug]);

        if (!empty($tmp_file['files_attach'])) {
            $data_files = array_map(function ($dt) use ($_id, $slug) {
                $dt['table_id'] = $_id;
                $dt['slug'] = $slug;
                return $dt;
            }, $tmp_file['files_attach']);

            $entities = $model_attached->newEntities($data_files);
            $model_attached->saveMany($entities);
        }
        return true;
    }


    protected function __upload($dir, $dir_tmp, $data_upload, $type = 'image')
    {
        $result = [];

        if (!empty($data_upload)) {
            // 共通 folder
            $common_tmp = WWW_ROOT . md5($dir);
            (new \Cake\Filesystem\Folder())->create($common_tmp, 0777);

            // 共通 folderにファイルを移動する
            if ($type == 'image')
                for ($i = 0; $i < count($data_upload); $i++) system(escapeshellcmd(__('cp -f {0} {1}/', [WWW_ROOT . ltrim($data_upload[$i], '/'), $common_tmp])));
            else if ($type == 'files') {
                foreach ($data_upload as $place => $place_data) {
                    $result[$place] = [];
                    if ($place_data) {
                        foreach ($place_data as $orignal_file_name => $path_tmp) {
                            $file = explode('/', $path_tmp);

                            if ($place == 'files_in_content') {
                                if (count($file) > 2 && in_array($file[1], ['upload_file_tmp', 'upload'])) {
                                    // Postしてくれるファイルは共通 folderに移動する
                                    if ($file[1] === 'upload_file_tmp') $result[$place][] = ['/' . $dir . end($file), $path_tmp];
                                    system(escapeshellcmd(__('cp -f {0} {1}/', [WWW_ROOT . ltrim($path_tmp, '/'), $common_tmp])));
                                }
                            } else {
                                $_data_file['file_name'] = end($file);
                                $_data_file['original_file_name'] = $orignal_file_name;
                                $file_exp = explode('.', $_data_file['file_name']);
                                $_data_file['extension'] = end($file_exp);

                                $result[$place][] = $_data_file;
                                // Postしてくれるファイルは共通 folderに移動する
                                system(escapeshellcmd(__('cp -f {0} {1}/', [WWW_ROOT . ltrim($path_tmp, '/'), $common_tmp])));
                            }
                        }
                    }
                };
            }
            // 存在しているファイルが削除する
            if (is_dir($dir)) array_map('unlink', array_filter((array) glob(__('{0}{1}*', [WWW_ROOT, $dir]))));
            // 逆に、新しいフォルダを作成する
            else (new \Cake\Filesystem\Folder())->create(__('{0}{1}', [WWW_ROOT, $dir]), 0777);

            // 共通 folderから実パスにファイルを移動する
            rename($common_tmp . '/', WWW_ROOT . $dir);

            // 共通 folderのファイルを全て削除する
            if (is_dir($common_tmp)) system(escapeshellcmd(__('rm -rf {0}', [$common_tmp])));

            // Tmp folderのファイルも全て削除する
            if (is_dir(WWW_ROOT . $dir_tmp)) system(escapeshellcmd(__('rm -rf {0}{1}', [WWW_ROOT, $dir_tmp])));
        } else {
            // 存在しているファイルが削除する
            if (is_dir($dir)) array_map('unlink', array_filter((array) glob(__('{0}{1}*', [WWW_ROOT, $dir]))));
        }
        return $result;
    }
}
