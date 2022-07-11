<?php

namespace App\Controller\Admin;

use Cake\Event\Event;
use App\Controller\Admin\AppController;
use Cake\Utility\Inflector;


class AdminController extends AppController
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
        $layout = "default";
        $view = "login";

        $this->login();

        if ($this->isLogin()) {
            $layout = "common";
            $view = "index";
            $this->setList();
        }

        $this->render($view,  $layout);
    }


    private function login()
    {
        if ($this->request->is('post') || $this->request->is('put')) {
            $this->loadModel('Users');
            $users = $this->Auth->identify();
            if ($users && $users['status'] == 'publish') $this->Auth->setUser($users);

            if (empty($users) || !$users || $users['status'] != 'publish') {
                $this->Flash->set('アカウント名またはパスワードが違います', [
                    'key' => 'login_fail',
                    'element' => 'error'
                ]);
            }
        }
    }


    public function logout()
    {
        $this->redirect($this->Auth->logout());
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
