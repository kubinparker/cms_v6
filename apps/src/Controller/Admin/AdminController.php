<?php

namespace App\Controller\Admin;

use Cake\Event\Event;
use App\Controller\AppController;
use Cake\Utility\Inflector;


class AdminController extends AppController
{

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        $this->modelName = Inflector::camelize($this->name);
        // Viewに渡す
        $this->set('ModelName', $this->modelName);
        $this->Auth->deny(['index', 'logout']);
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
            if ($users) $this->Auth->setUser($users);

            if (empty($users) || !$users) {
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

        $list['user_menu_list'] = [
            'コンテンツ' => []
        ];

        $list['user_menu_list']['設定'] = [['コンテンツ設定' => '/admin/configs']];

        if (!empty($list)) $this->set(array_keys($list), $list);

        $this->list = $list;
        return $list;
    }
}
