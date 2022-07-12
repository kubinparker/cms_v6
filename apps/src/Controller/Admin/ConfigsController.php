<?php

namespace App\Controller\Admin;

use Cake\Event\Event;
use App\Controller\Admin\AppController;
use Cake\Utility\Inflector;
use App\Form\Admin\ConfigForm;


class ConfigsController extends AppController
{

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        $this->modelName = Inflector::camelize($this->name);
        // Viewに渡す
        $this->set('ModelName', $this->modelName);
    }


    public function index()
    {
        $this->setList();
        if ($this->request->is('post')) {
            dd($this->request->getData());
        }
        parent::_edit(0);
    }


    protected function setList()
    {
        parent::setList();
        $list = [];

        if (!empty($list)) $this->set(array_keys($list), $list);

        $this->list = $list;
        return $list;
    }
}
