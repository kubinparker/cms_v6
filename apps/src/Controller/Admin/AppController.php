<?php

/**
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link      https://cakephp.org CakePHP(tm) Project
 * @since     0.2.9
 * @license   https://opensource.org/licenses/mit-license.php MIT License
 */

namespace App\Controller\Admin;

use Cake\Event\Event;
use Cake\Core\Configure;
use App\Model\Entity\User;
use Cake\Filesystem\File;
use App\Controller\AppController as BaseController;

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @link https://book.cakephp.org/3/en/controllers.html#the-app-controller
 */
class AppController extends BaseController
{
    public $auth_storage_key = '';

    public $font_config = [
        ['name' => '新着情報', 'options' => ['一覧', '詳細']],
        ['name' => 'お問い合わせ', 'options' => ['入力・確認・完了', '保存']]
    ];

    public $admin_config = [];

    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * e.g. `$this->loadComponent('Security');`
     *
     * @return void
     */
    public function initialize()
    {
        parent::initialize();
        $this->isPreview = $this->isLogin() && $this->request->getQuery('preview') === 'on';
    }


    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);

        // 準備
        $this->_prepare();
        $this->getAuthComponent();

        $this->set('font_config', $this->font_config);
        $this->set('admin_config', $this->admin_config);
    }


    private function _prepare()
    {
        // 管理側のログイン制限
        $params = $this->request->getAttribute('params');
        if (@$params['prefix'] == 'admin') {
            // /app/config/app.php
            $trust = (Configure::read(__('Trust.Admin.login_status.controller.{0}', $params['controller']))) ?? [];
            if (in_array($params['action'], $trust, true)) return;

            $this->checkLogin();
        }
    }


    protected function checkLogin()
    {
        if (!$this->isLogin()) {
            $prefix = $this->request->getParam('prefix');
            $this->redirect(strtolower(__('/{prefix}', ['prefix' => $prefix])));
        }
    }


    private function getAuthComponent()
    {
        $prefix = $this->request->getParam('prefix');
        if ($prefix == 'admin') {

            $this->loadComponent('Auth', [
                'loginAction' => [
                    'controller' => 'Admin',
                    'action' => 'index',
                ],
                'authError' => 'ログインが必要です。',
                'authenticate' => [
                    'Form' => [
                        'fields' => ['username' => 'username', 'password' => 'password'],
                        // 'finder' => 'auth'
                    ]
                ],
                'storage' => ['className' => 'Session', 'key' => $this->auth_storage_key],
                'authorize' => 'Controller',
            ]);
        }
    }


    // 管理側だけのログイン状態をチェック
    public function isAuthorized($user = null)
    {
        // Any registered user can access public functions
        if (!$this->request->getParam('prefix')) return true;

        // Only admins can access admin functions
        if ($this->request->getParam('prefix') === 'admin')  return (bool)($this->isLogin());

        // Default deny
        return false;
    }


    public function isLogin()
    {
        return $this->Session->check($this->auth_storage_key);
    }


    /**
     * 追加、編集
     *@param integer $id
     *@param \ArrayObject $option the options to use for the save operation
     *@param \ArrayObject $options the options to use for query
     * */
    protected function _edit($id = null, $option = [], $options = [])
    {
        $option = array_merge(
            [
                'conditions' => [],
                'saveMany' => false,
                'callback' => null,
                'redirect' => ['controller' => $this->modelName, 'action' => 'index']
            ],
            $option
        );
        extract($option);

        $data = $id &&  $this->_detail($id, $conditions, $options) ? $this->_detail($id, $conditions, $options) : $this->{$this->modelName}->newEntity();
        if ($this->request->is(['post', 'put']) && $this->request->getData()) {
            if ($saveMany) $data = $this->{$this->modelName}->patchEntity($data, $this->request->getData(), ['fields' => $saveMany]);
            else $data = $this->{$this->modelName}->patchEntity($data, $this->request->getData());

            if (empty($data->getErrors())) {
                if ($this->{$this->modelName}->save($data)) {
                    if ($callback) $callback($data);

                    if ($this->request->is('ajax')) {
                        echo json_encode(['success' => true]);
                        exit();
                    }
                    if ($redirect) $this->redirect($redirect);
                }
            } else {
                $this->set('list_errors', $data->getErrors());

                $this->Flash->set('正しく入力されていない項目があります。', [
                    'key' => 'post_fail',
                    'element' => 'error'
                ]);
            }
        }
        $this->set('data', $data);
        $this->set('entity', $data);
        return $data;
    }


    /**
     * 削除
     * @param integer $id
     * @param string $type
     * @param \ArrayObject $options
     */
    protected function _delete($id, $type, $columns = null, $options = [])
    {
        $option = array_merge(
            ['redirect' => null],
            $options
        );
        extract($option);

        $data = $this->_detail($id);
        if ($data && in_array($type, ['image', 'file', 'content'])) {
            if ($type === 'image' && isset($this->{$this->modelName}->attaches['images'][$columns])) {
                if (isset($data->attaches[$columns])) {
                    foreach ($data->attaches[$columns] as $_) {
                        $str_split = str_split($_);
                        $str_split[0] = ($str_split[0] === DS) ? '' : DS;
                        $_file = new File(WWW_ROOT . implode('', $str_split));
                        if ($_file->exists()) $_file->delete();
                    }
                }
                $data->{$columns} = null;
                $this->{$this->modelName}->save($data);
            } else if ($type === 'file' && isset($this->{$this->modelName}->attaches['files'][$columns])) {
                if (isset($data->attaches[$columns])) {
                    $str_split = str_split($data->attaches[$columns]);
                    $str_split[0] = ($str_split[0] === DS) ? '' : DS;
                    $_file = new File(WWW_ROOT . implode('', $str_split));
                    if ($_file->exists()) $_file->delete();

                    $data->{$columns} = null;
                    $data->{$columns . '_name'} = null;
                    $data->{$columns . '_size'} = null;
                    $this->{$this->modelName}->save($data);
                }
            } else if ($type === 'content') {
                $image_index = array_keys($this->{$this->modelName}->attaches['images']);
                $file_index = array_keys($this->{$this->modelName}->attaches['files']);

                $arr_file = array_merge($image_index, $file_index);
                foreach ($arr_file as $idx) {
                    if (!isset($data->attaches[$idx])) continue;
                    $data->attaches[$idx] = !is_array($data->attaches[$idx]) ? [$data->attaches[$idx]] : $data->attaches[$idx];

                    foreach ($data->attaches[$idx] as $_) {
                        $str_split = str_split($_);
                        $str_split[0] = ($str_split[0] === DS) ? '' : DS;
                        $_file = new File(WWW_ROOT . implode('', $str_split));
                        if ($_file->exists()) $_file->delete();
                    }
                }
                $this->{$this->modelName}->delete($data);
                $id = null;
            }
        }

        if ($redirect !== false) {
            if (is_null($redirect) || $redirect === true) $redirect = $id ? ['action' => 'edit', $id] : ['action' => 'index'];
            $this->redirect($redirect);
        }

        return true;
    }


    /**
     * 順番並び替え
     * @param integer $id
     * @param string $pos
     * @param \ArrayObject $options
     * */
    protected function _position($id, $pos, $options = [])
    {
        $options = array_merge([
            'redirect' => ['action' => 'index', '#' => 'content-' . $id]
        ], $options);
        extract($options);

        if ($this->_detail($id)) $this->{$this->modelName}->movePosition($id, $pos);

        if ($redirect)  $this->redirect($redirect);
    }


    /**
     * 掲載中/下書き トグル
     * @param integer $id
     * @param \ArrayObject $options
     * */
    protected function _enable($id, $options = [])
    {
        $options = array_merge([
            'redirect' => ['action' => 'index', '#' => 'content-' . $id]
        ], $options);
        extract($options);

        if ($data = $this->_detail($id)) {
            $status = $data->status != 'publish' ? 'publish' : 'draft';
            $model = $this->{$this->modelName};
            $model->updateAll([$model->aliasField('status') => $status], [$model->aliasField($model->getPrimaryKey()) => $id]);
        }
        if ($redirect) $this->redirect($redirect);
    }


    protected function setList()
    {
        $list = [];

        $list['role_list'] = User::$role_list;
        $list['user_site_list'] = [];

        $list['user_menu_list'] = [
            'コンテンツ' => []
        ];

        if ($this->isLogin() && in_array($this->Session->read($this->auth_storage_key)['role'], [User::ROLE_DEVELOP, User::ROLE_ADMIN], true)) {
            $list['user_site_list']['users'] = 'ユーザ管理';

            $list['user_menu_list']['設定']['configs'] = 'コンテンツ設定';
            $list['user_menu_list']['コンテンツ']['users'] = 'ユーザ管理';
        }

        if (!empty($list)) $this->set(array_keys($list), $list);
        $this->list = $list;
        return $list;
    }
}
