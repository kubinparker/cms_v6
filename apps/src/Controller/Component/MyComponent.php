<?php

namespace App\Controller\Component;

use Cake\Event\Event;
use Cake\Controller\Component;
use Cake\Filesystem\Folder;

class MyComponent extends Component
{
    public $frontType = 0;
    static $TYPE_BLOG = 0;
    static $TYPE_FORM = 1;
    static $LIST_PAGE = 0;
    static $DETAIL_PAGE = 1;
    public $slug;

    public $path_default_controller =  WEBROOT . 'template/{0}/controller/';
    public $path_default_template =  WEBROOT . 'template/{0}/template/';


    public $path_template =  APP . 'Template/{0}/';




    public function startup(Event $event)
    {
        $this->sub = $event->getSubject();
    }


    public function setFrontType($type)
    {
        $this->frontType = $type;
    }


    public function getFrontType()
    {
        return intval($this->frontType);
    }


    public function setSlug($slug)
    {
        $this->slug = $slug;
    }


    public function getSlug()
    {
        return $this->slug;
    }


    public function getPath()
    {
        $listPath = [
            'controller' => [],
            'template' => [],
            'model' => []
        ];

        // "E:\xampp\htdocs\cms_v6\apps"
        // APP = \xampp\htdocs\cms_v6\apps\src"
        // WEBROOT
        $controllerTemp = '';
        $listPath['controller']['common'] = __($this->path_default_controller, 'front') . 'common.txt';

        if ($this->getFrontType() === $this::$TYPE_BLOG) {
            $listPath['controller']['index'] = __($this->path_default_controller, 'front') . 'index.txt';
        }
        if ($this->getFrontType() === $this::$TYPE_FORM) {
            // tao controler 
            $listPath['controller']['forms'] = __($this->path_default_controller, 'front') . 'form.txt';
            $listPath['template']['forms'] = __($this->path_default_template, 'front') . 'form.txt';
            // view
        }

        return $listPath;
    }


    public function createTemplate()
    {
        $paths = $this->getPath();
        $slug = ucfirst($this->getSlug());

        $content = '';

        if ($this->getFrontType() === $this::$TYPE_BLOG) {
            $content .= __(file_get_contents($paths['controller']['index'], true), '');
        } elseif ($this->getFrontType() === $this::$TYPE_FORM) {
            $content .= __(file_get_contents($paths['controller']['forms'], true), $slug);
        }
        $common = __(file_get_contents($paths['controller']['common'], true), $slug, $content);

        $file = APP . 'Controller/' . $slug . 'Controller.php';
        file_put_contents($file, str_replace(['&=', '=&'], ['{', '}'], $common));


        // view 
        if (!is_dir(__($this->path_template, $slug))) (new Folder())->create(__($this->path_template, $slug), 0777);
        $content_view = file_get_contents($paths['template']['forms'], true);

        $file_temp = __($this->path_template, $slug) . 'index.ctp';
        file_put_contents($file_temp, $content_view);

        // form


        return true;
    }
}
