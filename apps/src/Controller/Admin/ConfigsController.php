<?php

namespace App\Controller\Admin;

use Cake\Event\Event;
use App\Controller\AppController;
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

        $config = new ConfigForm();

        if ($this->request->is(['post', 'put'])) {
            $data = $this->request->getData();

            $data['management_part'] = !isset($data['management_part']) ? [] : $data['management_part'];
            if ($config->execute($data)) {
                foreach ($data['management_part'] as $pos) {
                    // front
                    if (0 === intval($pos)) {
                        $this->My->setFrontType($data['font_type']);
                        $this->My->setSlug($data['slug']);
                        $this->My->createTemplate();
                    }
                }
            } else {
                // error
            }
        }
        $this->set('config', $config);
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
