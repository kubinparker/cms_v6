<?php

namespace App\Controller\Admin;

use Cake\Event\Event;
use App\Controller\Admin\AppController;
use Cake\Utility\Inflector;
use App\Model\Entity\User;


class UsersController extends AppController
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
        $cond = [];

        $role = @$this->Session->read($this->auth_storage_key)['role'];
        if ($this->isLogin() && $role != User::ROLE_DEVELOP) {
            $cond['role !='] = User::ROLE_DEVELOP;
        }
        parent::_lists($cond, ['limit' => null]);
    }


    public function edit($id = null)
    {
        $this->setList();
        parent::_edit($id);
    }


    public function delete($id)
    {
        parent::_delete($id, 'content');
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
