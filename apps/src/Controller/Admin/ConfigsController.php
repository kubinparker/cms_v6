<?php

namespace App\Controller\Admin;

use Cake\Event\Event;
use App\Model\Entity\User;
use Cake\Utility\Inflector;
use Cake\Datasource\ConnectionManager;
use App\Controller\Admin\AppController;


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
        $view  = 'created';

        $data = $this->codeBlocks(parent::_edit(0, ['redirect' => false]));
        $view = $this->request->is(['post', 'put']) && empty($data->getErrors()) ? $view : 'index';

        $this->render($view);
    }


    public function getItem()
    {
        if (!$this->request->is(['ajax', 'post'])) $this->redirect('/admin/logout');
        $result = ['success' => false];
        if ($this->request->getData('type')) {
            $f = '';

            // if (is_file(DEFAULT_ADMIN_TEMP . __('form/{0}_ajax.txt', $this->request->getData('type'))))
            //     $f = DEFAULT_ADMIN_TEMP . __('form/{0}_ajax.txt', $this->request->getData('type'));

            // else 
            if (is_file(DEFAULT_ADMIN_TEMP . __('form/ajax/{0}.txt', $this->request->getData('type'))))
                $f = DEFAULT_ADMIN_TEMP . __('form/ajax/{0}.txt', $this->request->getData('type'));

            if ($f !== '') {
                $result['success'] = true;
                $result['data'] = __(file_get_contents($f, true), '<input type="hidden" value="' . $this->request->getData('type') . '" name="data_item[]">');
            }
        }
        echo json_encode($result);
        exit();
    }


    public function clearConfig()
    {
        //メモ： 公開したら　全てSlugの is_default は PUBLISH_CONFIG (2) に変更する

        $role = @$this->Session->read($this->auth_storage_key)['role'];
        if (!in_array($role, [User::ROLE_DEVELOP], true)) $this->redirect('/admin');

        $config = $this->{$this->modelName}->find('all')
            ->where(['is_default' => self::NEW_CONFIG])
            ->toArray();

        foreach ($config as $cf) {
            $slug = ucfirst($cf->slug);

            // remove
            $files = [
                // controller
                APP . 'Controller/Admin/' . $slug . 'Controller.php',
                APP . 'Controller/' . $slug . 'Controller.php',
                // form
                APP . 'Form/' . $slug . 'Form.php',
                // model
                APP . 'Model/Table/' . $slug . 'Table.php',
                // Template
                APP . 'Template/' . $slug . '/',
                APP . 'Template/Admin/' . $slug . '/',
                // upload
                WWW_ROOT . 'upload/' . $slug . '/',
                // template mail
                WWW_ROOT . 'Template/Email/text/' . $slug . '.ctp',
                WWW_ROOT . 'Template/Email/text/' . $slug . '_admin.ctp'
            ];

            system(escapeshellcmd(__('rm -rf {0}', implode(' ', $files))));

            // drop table
            $connection = ConnectionManager::get('default');
            $connection->execute('DROP TABLE IF EXISTS `' . $cf->slug . '`;');

            // delete row in table config and in table attached by slug
            $this->{$this->modelName}->delete($cf);
        }
        $this->redirect('/admin');
    }


    protected function codeBlocks($data)
    {
        if ($this->request->is(['post', 'put']) && empty($data->getErrors())) {
            $create_datas = $data->create_data ?? $this->redirect(['action' => 'index']);

            foreach ($create_datas as $k => $path) {
                $handle = fopen($path, "r");

                $pre = '<pre>{0}</pre>';

                if ($handle) {
                    $str = '';
                    while (($line = fgets($handle)) !== false) {
                        $str .= __('<code>{0}</code>', str_replace(['<', '>'], ['&lt;', '&gt;'], $line));
                    }

                    fclose($handle);
                    $pre = __($pre, $str);
                }
                $data->create_data[$k] = [$path, $pre];
            }
        }

        $this->set('entity', $data);
        return $data;
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
