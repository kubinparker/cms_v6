<?php

namespace App\Model\Behavior;

use Cake\Event\Event;
use Cake\ORM\Behavior;
use Cake\Filesystem\Folder;
use Cake\Datasource\EntityInterface;
use Cake\Datasource\ConnectionManager;

/**
 * Position Behavior.
 *
 * データ並び順を設定
 *
 */
class MyBehavior extends Behavior
{
    public $slug;
    public $title = '';
    public $font_type = 0;

    static $TYPE_BLOG = 0;
    static $TYPE_FORM = 1;

    static $LIST_PAGE = 0;
    static $DETAIL_PAGE = 1;

    static $FORM_3_STEP = 0;
    static $FORM_3_STEP_SAVE = 1;

    static $FRONT = 0;
    static $ADMIN = 1;

    public $is_front = false;
    public $is_admin = false;

    public $is_list_page = false;
    public $is_detail_page = false;

    public $data_item = [];
    public $path = [];


    public function setSlug($slug)
    {
        $this->slug = $slug;
    }


    public function setHeading($title)
    {
        $this->title = $title;
    }


    public function setFrontType($type)
    {
        $this->font_type = $type;
    }


    public function setIsFront($bool)
    {
        $this->is_front = $bool;
    }


    public function setIsAdmin($bool)
    {
        $this->is_admin = $bool;
    }


    public function setIsListPage($bool)
    {
        $this->is_list_page = $bool;
    }


    public function setIsDetailPage($bool)
    {
        $this->is_detail_page = $bool;
    }


    public function setIsForm3Step($bool)
    {
        $this->is_form_3_step = $bool;
    }


    public function setIsForm3StepSave($bool)
    {
        $this->is_form_3_step_save = $bool;
    }

    public function setDataFormItem($data_item)
    {
        $this->data_item = $data_item;
    }


    protected function __setConfig(EntityInterface $entity)
    {
        $this->setSlug($entity->slug);
        $this->setHeading($entity->title);
        $this->setFrontType($entity->font_type);

        $this->setIsFront($entity->management_part && in_array(strval($this::$FRONT), $entity->management_part, true));
        $this->setIsAdmin($entity->management_part && in_array(strval($this::$ADMIN), $entity->management_part, true));

        $this->setIsListPage($entity->font_type_options_0 && in_array(strval($this::$LIST_PAGE), $entity->font_type_options_0, true));
        $this->setIsDetailPage($entity->font_type_options_0 && in_array(strval($this::$DETAIL_PAGE), $entity->font_type_options_0, true));

        $this->setIsForm3Step($entity->font_type_options_1 && in_array(strval($this::$FORM_3_STEP), $entity->font_type_options_1, true));
        $this->setIsForm3StepSave($entity->font_type_options_1 && in_array(strval($this::$FORM_3_STEP_SAVE), $entity->font_type_options_1, true));

        $this->setDataFormItem($entity->data_item);
    }


    protected function __runBuild()
    {
        $this->buildForFront();
        $this->buildForAdmin();
    }

    protected function buildBlog()
    {
        if ($this->font_type != $this::$TYPE_BLOG) return;
        $slug = ucfirst($this->slug);

        // controller
        $content_controller = [DEFAULT_FRONT_TEMP . ($this->is_list_page ? 'controller/index_list.txt' : 'controller/index.txt')];
        if ($this->is_detail_page) $content_controller[] = DEFAULT_FRONT_TEMP . 'controller/detail.txt';


        $content = '';
        foreach ($content_controller as $p) $content .= __(file_get_contents($p, true), $slug);
        $controller = __(file_get_contents(DEFAULT_FRONT_TEMP . 'controller/common.txt', true), $slug, $content);
        $file = APP . 'Controller/' . $slug . 'Controller.php';
        file_put_contents($file, str_replace(['&=', '=&'], ['{', '}'], $controller));
        $this->path[] = $file;


        // template
        $folder = APP . 'Template/' . $slug . '/';
        if (!is_dir($folder)) (new Folder())->create($folder, 0777);
        file_put_contents($folder . 'index.ctp', file_get_contents(DEFAULT_FRONT_TEMP . 'template/index.txt', true));
        $this->path[] = $folder . 'index.ctp';
        if ($this->is_detail_page) file_put_contents($folder . 'detail.ctp', file_get_contents(DEFAULT_FRONT_TEMP . 'template/detail.txt', true));
        $this->path[] = $folder . 'detail.ctp';
    }


    protected function buildForm()
    {
        if ($this->font_type != $this::$TYPE_FORM) return;
        $slug = ucfirst($this->slug);

        // controller
        $content_controller = [];
        if ($this->is_form_3_step_save) $content_controller[] = DEFAULT_FRONT_TEMP . 'controller/index_form_3step_save.txt';
        else if ($this->is_form_3_step) $content_controller[] = DEFAULT_FRONT_TEMP . 'controller/index_form_3step.txt';
        else $content_controller[] = DEFAULT_FRONT_TEMP . 'controller/index.txt';

        $content = '';
        foreach ($content_controller as $p) $content .= __(file_get_contents($p, true), $slug);
        $controller = __(file_get_contents(DEFAULT_FRONT_TEMP . 'controller/common.txt', true), $slug, $content);
        $file = APP . 'Controller/' . $slug . 'Controller.php';
        file_put_contents($file, str_replace(['&=', '=&'], ['{', '}'], $controller));
        $this->path[] = $file;

        // template
        $folder = APP . 'Template/' . $slug . '/';
        if (!is_dir($folder)) (new Folder())->create($folder, 0777);

        file_put_contents($folder . 'index.ctp', file_get_contents(DEFAULT_FRONT_TEMP . 'template/form_index.txt', true));
        $this->path[] = $folder . 'index.ctp';
        if ($this->is_form_3_step || $this->is_form_3_step_save) {
            file_put_contents($folder . 'confirm.ctp', file_get_contents(DEFAULT_FRONT_TEMP . 'template/form_confirm.txt', true));
            file_put_contents($folder . 'complete.ctp', file_get_contents(DEFAULT_FRONT_TEMP . 'template/form_complete.txt', true));
            $this->path[] = $folder . 'confirm.ctp';
            $this->path[] = $folder . 'complete.ctp';
        }

        // class form
        file_put_contents(APP . 'Form/' .  $slug . 'Form.php', str_replace(['&=', '=&'], ['{', '}'], __(file_get_contents(DEFAULT_FRONT_TEMP . 'form/form.txt', true), [$slug, $this->slug])));
        $this->path[] = APP . 'Form/' .  $slug . 'Form.php';
        // email template
        file_put_contents(APP . 'Template/Email/text/' . $this->slug . '.ctp', file_get_contents(DEFAULT_FRONT_TEMP . 'mail/user.txt', true));
        file_put_contents(APP . 'Template/Email/text/' . $this->slug . '_admin.ctp', file_get_contents(DEFAULT_FRONT_TEMP . 'mail/admin.txt', true));
        $this->path[] = APP . 'Template/Email/text/' . $this->slug . '.ctp';
        $this->path[] = APP . 'Template/Email/text/' . $this->slug . '_admin.ctp';
    }


    protected function buildForFront()
    {
        if (!$this->is_front) return;
        $this->buildBlog();
        $this->buildForm();
    }


    protected function buildForAdmin()
    {
        if (!$this->is_admin) return;
        $slug = ucfirst($this->slug);

        $id_attached = ($this->data_item && (in_array('file', $this->data_item, true) || in_array('images', $this->data_item, true)));
        $model_contain = $id_attached ? '$options["contain"] = $this->_associations_attached();' : '';

        // controller
        $controller = __(file_get_contents(DEFAULT_ADMIN_TEMP . 'controller/common.txt', true), [$slug, 'contain' => $model_contain]);
        $file = APP . 'Controller/Admin/' . $slug . 'Controller.php';
        file_put_contents($file, str_replace(['&=', '=&'], ['{', '}'], $controller));
        $this->path[] = $file;

        // model
        $model = __(file_get_contents(DEFAULT_ADMIN_TEMP . 'model/common.txt', true), [$slug, 'contain' => $model_contain]);
        $file = APP . 'Model/Table/' . $slug . 'Table.php';
        file_put_contents($file, str_replace(['&=', '=&'], ['{', '}'], $model));
        $this->path[] = $file;

        // table
        $table = __(file_get_contents(DEFAULT_ADMIN_TEMP . 'model/table.txt', true), $this->slug);
        $connection = ConnectionManager::get('default');
        $connection->execute($table);

        //template folder
        $folder = APP . 'Template/Admin/' . $slug . '/';
        if (!is_dir($folder)) (new Folder())->create($folder, 0777);


        // edit file content
        $edit_content = '';
        if ($this->data_item) foreach ($this->data_item as $item) $edit_content .= __(file_get_contents(DEFAULT_ADMIN_TEMP . 'form/' . $item . '.txt', true), '');


        $edit = __(file_get_contents(DEFAULT_ADMIN_TEMP . 'template/edit.txt', true), $this->title, $edit_content);
        file_put_contents($folder . 'edit.ctp', $edit);
        $this->path[] = $folder . 'edit.ctp';

        // index file content
        $index = __(file_get_contents(DEFAULT_ADMIN_TEMP . 'template/index.txt', true), $this->title, $this->slug);
        file_put_contents($folder . 'index.ctp', $index);
        $this->path[] = $folder . 'index.ctp';
    }


    public function afterSave(Event $event, EntityInterface $entity, \ArrayObject $options)
    {
        $this->__setConfig($entity);
        $this->__runBuild();
        $entity->set('create_data', $this->path);
        return true;
    }
}
