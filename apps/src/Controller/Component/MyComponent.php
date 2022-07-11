<?php

namespace App\Controller\Component;

use Cake\Event\Event;
use Cake\Controller\Component;
use JsonSchema\Uri\Retrievers\FileGetContents;

class MyComponent extends Component
{
    public $frontType = 0;
    static $TYPE_BLOG = 0;
    static $TYPE_FORM = 0;
    public $slug;




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

        if ($this->getFrontType() === $this::$TYPE_BLOG) {
            $listPath['controller']['common'] = WEBROOT . DS . 'template/front/controller/common.txt';
            $listPath['controller']['index'] = WEBROOT . DS . 'template/front/controller/index.txt';
        }

        return $listPath;
    }


    public function createFile()
    {
        $name = false;
        while ($name) {
        }
    }

    public function createTemplate()
    {
        $paths = $this->getPath();
        $slug = ucfirst($this->getSlug());

        $content = '';
        $content .= __(file_get_contents($paths['controller']['index'], true), '');

        $common = __(file_get_contents($paths['controller']['common'], true), $slug, $content);

        $file = APP . DS . 'Controller/' . $slug . 'Controller.php';
        if (is_file($file))
            $file = $this->createFile();

        file_put_contents($file, str_replace(['&=', '=&'], ['{', '}'], $common));

        return true;
    }
}
