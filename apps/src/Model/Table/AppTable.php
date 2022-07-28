<?php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Event\Event;
use Cake\ORM\TableRegistry;
use Cake\Datasource\EntityInterface;



class AppTable extends Table
{
    public $code_upload = null;
    public $slug = null;
    public $curent_id = 0;

    public $attaches = ['images' => [], 'files' => []];

    public function initialize(array $config)
    {
        $this->addBehavior('Position');
    }

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
        if (is_null($this->slug)) return;

        $datas = [
            'files' => [
                'content' => $entity->_files ?? [], // Ckeditorの
                'attach' => $entity->__files ?? [] // 添付
            ],
            'images' => [
                'content' => $entity->_images ?? [], // Ckeditorの
                'attach' => $entity->__images ?? [] // 添付
            ]
        ];

        $entity = $this->process_upload($entity, $datas['files'], 'files');
        $entity = $this->process_upload($entity, $datas['images'], 'images');

        if ($this->code_upload) {
            if (is_dir(WWW_ROOT . 'upload_tmp' . DS . $this->code_upload)) {
                array_map('unlink', array_filter((array) glob(WWW_ROOT . 'upload_tmp' . DS . $this->code_upload . DS . '*')));
                rmdir(WWW_ROOT . 'upload_tmp' . DS . $this->code_upload);
            }
            if (is_dir(WWW_ROOT . 'upload_file_tmp' . DS . $this->code_upload)) {
                array_map('unlink', array_filter((array) glob(WWW_ROOT . 'upload_file_tmp' . DS . $this->code_upload . DS . '*')));
                rmdir(WWW_ROOT . 'upload_file_tmp' . DS . $this->code_upload);
            }
        }
        if ($entity->content) {
            $this->slug = null;
            $this->save($entity);
        }

        return true;
    }


    protected function process_upload($entity, $datas, $type)
    {
        $dir = __('upload/{slug}/{id}/{type}/', ['slug' => $this->slug, 'id' => $entity->id, 'type' => $type]);

        $common_tmp = WWW_ROOT . md5($dir);
        (new \Cake\Filesystem\Folder())->create($common_tmp, 0777);

        $content = $this->__upload_content($dir, $common_tmp, $datas['content']);
        $attach = $this->__upload_attach($dir, $common_tmp, $datas['attach'], $entity->id, $type);

        // 存在しているファイルが削除する
        if (is_dir(WWW_ROOT . $dir)) array_map('unlink', array_filter((array) glob(__('{0}{1}*', [WWW_ROOT, $dir]))));
        // 逆に、新しいフォルダを作成する
        else (new \Cake\Filesystem\Folder())->create(__('{0}{1}', [WWW_ROOT, $dir]), 0777);

        rename($common_tmp . DS, WWW_ROOT . $dir);

        $attached = TableRegistry::getTableLocator()->get('Attached');
        $attached->deleteAll(['table_id' => $entity->id, 'slug' => $this->slug, 'type' => $type]);

        if (!empty($attach)) {
            $entities = $attached->newEntities($attach);
            $attached->saveMany($entities);
        }

        if ($entity->content) {
            foreach ($content as $replace) {
                $entity->content = str_replace($replace[1], $replace[0], $entity->content);
            }
        }

        return $entity;
    }


    protected function __upload_content($dir, $common_tmp, $data)
    {
        $result = [];
        foreach ($data as $data_content) {
            $file = explode(DS, $data_content);

            if (count($file) > 2 && in_array($file[1], ['upload_file_tmp', 'upload_tmp', 'upload'], true)) {
                // $result配列に入れる
                if (in_array($file[1], ['upload_file_tmp', 'upload_tmp']))
                    $result[] = [DS . $dir . end($file), $data_content];
                // Postしてくれるファイルは共通 folderに移動する
                if (is_file(WWW_ROOT . ltrim($data_content, DS)))
                    copy(WWW_ROOT . ltrim($data_content, DS), $common_tmp . DS . end($file));
            }
        }
        return $result;
    }


    protected function __upload_attach($dir, $common_tmp, $data, $id, $type)
    {
        $result = [];

        foreach ($data as $original_name => $data_content) {

            $file = explode(DS, $data_content['path']);
            $file_name = end($file);
            // Attachedテーブルに保存するデータ
            $_data_file['table_id'] = intval($id);
            $_data_file['slug'] = $this->slug;
            $_data_file['file_name'] = $file_name;
            $_data_file['original_file_name'] = str_replace('=&', ']', $original_name);
            $_data_file['size'] = intval($data_content['size']);
            $_data_file['extension'] = getExtension($file_name);
            $_data_file['type'] = $type;

            $result[] = $_data_file;
            // Postしてくれるファイルは共通 folderに移動する
            if (is_file(WWW_ROOT . ltrim($data_content['path'], DS)))
                copy(WWW_ROOT . ltrim($data_content['path'], DS), $common_tmp . DS . $file_name);

            // mover thumbnail to 共通 folder
            if ($type == 'images' && !empty($this->attaches[$type]['thumbnails'])) {
                $tmp_dir = WWW_ROOT . 'upload_tmp' . DS . $this->code_upload . DS;

                foreach ($this->attaches[$type]['thumbnails'] as $prefix => $_) {
                    $thumb_file = $prefix . $file_name;

                    if (is_file($tmp_dir . $thumb_file))
                        copy($tmp_dir . $thumb_file, $common_tmp . DS . $thumb_file);

                    if (is_file($dir . $thumb_file))
                        copy($dir . $thumb_file, $common_tmp . DS . $thumb_file);
                }
            }
        }
        return $result;
    }


    public function afterSave(Event $event, EntityInterface $entity, \ArrayObject $options)
    {
        $this->_uploadForCkEditor($entity);
        return true;
    }
}
