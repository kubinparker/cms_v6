<?php

namespace App\Controller\Admin;

use Cake\Event\Event;
use App\Controller\Admin\AppController;
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
        parent::_edit(0);
    }


    public function getItem()
    {
        if (!$this->request->is(['ajax', 'post'])) $this->redirect('/admin/logout');
        $result = ['success' => false];
        if ($this->request->getData('type') && is_file(DEFAULT_ADMIN_TEMP . __('form/{0}.txt', $this->request->getData('type')))) {
            $result['success'] = true;
            $result['data'] = __(file_get_contents(DEFAULT_ADMIN_TEMP . __('form/{0}.txt', $this->request->getData('type')), true), '<input type="hidden" value="' . $this->request->getData('type') . '" name="data_item[]">');
        }
        echo json_encode($result);
        exit();
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
