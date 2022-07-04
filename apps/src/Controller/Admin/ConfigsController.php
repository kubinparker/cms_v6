<?php

namespace App\Controller\Admin;

use Cake\Event\Event;
use App\Controller\AppController;
use Cake\Utility\Inflector;


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
    }


    protected function setList()
    {
        parent::setList();

        $list['user_menu_list'] = [
            'コンテンツ' => []
        ];

        $list['user_menu_list']['設定'] = [['コンテンツ設定' => '/admin/configs']];

        if (!empty($list)) $this->set(array_keys($list), $list);

        $this->list = $list;
        return $list;
    }
}
