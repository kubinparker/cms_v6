<?php

namespace App\Model\Behavior;

use Cake\Datasource\EntityInterface;
use Cake\Event\Event;
use Cake\Filesystem\Folder;
use Cake\ORM\Behavior;

/**
 * Position Behavior.
 *
 * データ並び順を設定
 *
 */
class MyBehavior extends Behavior
{
    public $slug;
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


    public function setSlug($slug)
    {
        $this->slug = $slug;
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

        $path_default_temp = $this->_pathDefaultTemplate();

        $this->buildController($path_default_temp['controller']);
        $this->buildTemplate($path_default_temp['template']);
        // $this->buildModel($path_default_temp['model']);
        $this->buildForm($path_default_temp['form']);
        $this->buildEmailTemplate($path_default_temp['email']);
        $this->buildDataItem($path_default_temp['formItem']);
    }


    protected function _pathDefaultTemplate()
    {
        $slug = ucfirst($this->slug);

        $listPath = [
            'controller' => [],
            'template' => [],
            'model' => [],
            'form' => [],
            'email' => [],
            'formItem' => []
        ];

        if ($this->is_front) {
            if ($this->font_type == $this::$TYPE_BLOG) {

                $listPath['controller'][] =  DEFAULT_FRONT_TEMP . ($this->is_list_page ? 'controller/index_list.txt' : 'controller/index.txt');
                $listPath['template']['index'] = DEFAULT_FRONT_TEMP . 'template/index.txt';

                if ($this->is_detail_page) {
                    $listPath['controller'][] = DEFAULT_FRONT_TEMP . 'controller/detail.txt';
                    $listPath['template']['detail'] = DEFAULT_FRONT_TEMP . 'template/detail.txt';
                }
            } else if ($this->font_type == $this::$TYPE_FORM) {

                if ($this->is_form_3_step_save) $listPath['controller'][] = DEFAULT_FRONT_TEMP . 'controller/index_form_3step_save.txt';
                else if ($this->is_form_3_step) $listPath['controller'][] = DEFAULT_FRONT_TEMP . 'controller/index_form_3step.txt';
                else $listPath['controller'][] = DEFAULT_FRONT_TEMP . 'controller/index.txt';

                if ($this->is_form_3_step || $this->is_form_3_step_save) {
                    $listPath['template']['confirm'] = DEFAULT_FRONT_TEMP . 'template/form_confirm.txt';
                    $listPath['template']['complete'] = DEFAULT_FRONT_TEMP . 'template/form_complete.txt';
                }
                $listPath['template']['index'] = DEFAULT_FRONT_TEMP . 'template/form_index.txt';

                // template mail
                $listPath['email'][''] = DEFAULT_FRONT_TEMP . 'mail/user.txt';
                $listPath['email']['_admin'] = DEFAULT_FRONT_TEMP . 'mail/admin.txt';

                // class form
                $listPath['form'][] = DEFAULT_FRONT_TEMP . 'form/form.txt';
            }
        }
        if ($this->is_admin) {
            foreach ($this->data_item as $item) {
                $listPath['formItem'][] = DEFAULT_ADMIN_TEMP . 'form/' . $item . '.txt';
            }
        }

        return $listPath;
    }


    protected function buildController($listPath)
    {
        $slug = ucfirst($this->slug);
        $content = '';
        foreach ($listPath as $p) $content .= __(file_get_contents($p, true), $slug);
        $controller = __(file_get_contents(DEFAULT_FRONT_TEMP . 'controller/common.txt', true), $slug, $content);
        $file = APP . 'Controller/' . $slug . 'Controller.php';
        file_put_contents($file, str_replace(['&=', '=&'], ['{', '}'], $controller));
    }


    protected function buildTemplate($listPath)
    {
        $slug = ucfirst($this->slug);
        $folder = APP . 'Template/' . $slug . '/';
        if (!is_dir($folder)) (new Folder())->create($folder, 0777);
        foreach ($listPath as $file_name => $path) file_put_contents($folder . $file_name . '.ctp', file_get_contents($path, true));
    }


    protected function buildEmailTemplate($listPath)
    {
        foreach ($listPath as $file_name => $path) file_put_contents(APP . 'Template/Email/text/' . $this->slug . $file_name . '.ctp', file_get_contents($path, true));
    }


    protected function buildForm($listPath)
    {
        foreach ($listPath as $file_name => $path) file_put_contents(APP . 'Form/' . ucfirst($this->slug) . 'Form.php', str_replace(['&=', '=&'], ['{', '}'], __(file_get_contents($path, true), ucfirst($this->slug))));
    }


    protected function buildDataItem($listPath)
    {
        $slug = ucfirst($this->slug);
        $content = '';
        foreach ($listPath as $p) $content .= __(file_get_contents($p, true), '');
        $ctp = __(file_get_contents(DEFAULT_ADMIN_TEMP . 'edit.txt', true), $content);
        $file = APP . 'Template/Admin/' . $slug . '/edit.ctp';
        file_put_contents($file, $ctp);
    }


    public function afterSave(Event $event, EntityInterface $entity, \ArrayObject $options)
    {
        $this->__setConfig($entity);
        $this->__runBuild();
        return true;
    }
}
