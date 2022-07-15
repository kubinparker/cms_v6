<?php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\ORM\Query;
use Cake\Event\Event;
use Cake\Utility\Text;
use Cake\ORM\TableRegistry;
use Cake\Datasource\EntityInterface;
use Cake\Database\Schema\TableSchemaInterface;



class AppTable extends Table
{
    public $code_upload = null;
    public $slug = null;

    public $attaches = ['images' => [], 'files' => []];


    /**
     * 
     * @param string $dir_file tmp_name
     * @param string $dir_thumb_file new path file
     * @param integer $max_width with
     * @param integer $max_height height
     * @param float $quality
     */
    public function generate_thumbnail($dir_file, $dir_thumb_file, $max_width, $max_height, $quality = 0.75)
    {
        // The original image must exist
        if (is_file($dir_file)) {
            // Let's create the directory if needed
            $th_path = dirname($dir_thumb_file);
            if (!is_dir($th_path))
                mkdir($th_path, 0777, true);
            // If the thumb does not aleady exists
            if (!is_file($dir_thumb_file)) {
                // Get Image size info
                list($width_orig, $height_orig, $image_type) = @getimagesize($dir_file);
                if (!$width_orig)
                    return 2;
                switch ($image_type) {
                    case 1:
                        $src_im = @imagecreatefromgif($dir_file);
                        break;
                    case 2:
                        $src_im = @imagecreatefromjpeg($dir_file);
                        break;
                    case 3:
                        $src_im = @imagecreatefrompng($dir_file);
                        break;
                }
                if (!$src_im)
                    return 3;


                $aspect_ratio = (float) $height_orig / $width_orig;

                $thumb_height = $max_height;
                $thumb_width = round($thumb_height / $aspect_ratio);
                if ($thumb_width > $max_width) {
                    $thumb_width    = $max_width;
                    $thumb_height   = round($thumb_width * $aspect_ratio);
                }

                $width = intval($thumb_width);
                $height = intval($thumb_height);
                $dst_img = @imagecreatetruecolor($width, $height);
                if (!$dst_img)
                    return 4;
                $success = @imagecopyresampled($dst_img, $src_im, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
                if (!$success)
                    return 4;
                switch ($image_type) {
                    case 1:
                        $success = @imagegif($dst_img, $dir_thumb_file);
                        break;
                    case 2:
                        $success = @imagejpeg($dst_img, $dir_thumb_file, 100);
                        break;
                    case 3:
                        $success = @imagepng($dst_img, $dir_thumb_file, intval($quality * 9));
                        break;
                }
                if (!$success)
                    return 4;
            }
            return 0;
        }
        return 1;
    }

    protected function _associations_attached()
    {
        $this->hasMany('AttachedFiles', ['className' => 'Attached'])
            ->setConditions(['type' => 'files'])
            ->setForeignKey('table_id')
            ->setDependent(true);

        $this->hasMany('AttachedImages', ['className' => 'Attached'])
            ->setConditions(['type' => 'images'])
            ->setForeignKey('table_id')
            ->setDependent(true);

        return true;
    }


    /**
     * upload以下のフォルダを作成/書き込み権限のチェック
     * 
     * */
    protected function _uploadForCkEditor(EntityInterface $entity)
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
                $dt['type'] = 'files';
                return $dt;
            }, $tmp_file['files_attach']);
            $entities = $model_attached->newEntities($data_files);
            $model_attached->saveMany($entities);
        }
    }


    public function afterSave(Event $event, EntityInterface $entity, \ArrayObject $options)
    {
        $this->_uploadForCkEditor($entity);
        return true;
    }


    protected function __upload($dir, $dir_tmp, $data_upload, $type = 'image')
    {
        $result = [];
        // dd($dir, $dir_tmp, $data_upload);
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

                    if (empty($place_data) || is_null($place_data) || !$place_data) continue;

                    foreach ($place_data as $orignal_file_name => $file_info) { //$path_tmp

                        $path_tmp = $file_info['path'];

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
                            $_data_file['size'] = intval($file_info['size']);

                            $result[$place][] = $_data_file;
                            // Postしてくれるファイルは共通 folderに移動する
                            system(escapeshellcmd(__('cp -f {0} {1}/', [WWW_ROOT . ltrim($path_tmp, '/'), $common_tmp])));
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
