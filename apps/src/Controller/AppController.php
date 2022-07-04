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

namespace App\Controller;

use Cake\Controller\Controller;
use Cake\Event\Event;
use Cake\Core\Configure;

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @link https://book.cakephp.org/3/en/controllers.html#the-app-controller
 */
class AppController extends Controller
{
    public $auth_storage_key = '';

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
        $this->loadComponent('Flash');
        $this->Session = $this->getRequest()->getSession();
        $this->viewBuilder()->setLayout(false);

        $this->setHeadTitle();
        $this->isPreview = $this->isLogin() && $this->request->getQuery('preview') === 'on';
    }


    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        //端末判定
        $this->request->addDetector(
            'mb',
            [
                'env' => 'HTTP_USER_AGENT',
                'options' => [
                    '^DoCoMo', 'UP\\.Browser', '^SoftBank', '^Vodafone', 'J-PHONE',
                    'NetFront', 'Symbian'
                ]
            ]
        );
        $this->request->addDetector(
            'sp',
            [
                'env' => 'HTTP_USER_AGENT',
                'options' => [
                    'Android.+Mobile', 'iPhone', 'iPod', 'Windows Phone'
                ]
            ]
        );

        $this->set('isMobile', $this->request->is('mb'));
        $this->set('isSp', $this->request->is('sp'));

        $prefix = $this->request->getParam('prefix');


        if ($prefix === 'admin') {
            $this->auth_storage_key = 'Auth.Admin';
            $this->viewBuilder()->setLayout('default');
        } else {

            $this->viewBuilder()->setLayout('simple');
        }
        // 準備
        $this->_prepare();
        $this->getAuthComponent();
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


    protected function setHeadTitle($title = Null, $isFull = False)
    {
        $_title = \Cake\Core\Configure::read('App.headTitle');
        if ($title) {
            $title = is_array($title) ? implode(' | ', $title) : $title;
            $_title = $isFull ? $title : __('{0} | {1}', [$title, $_title]);
        }
        $this->set('__title__', $_title);
        return $_title;
    }


    protected function setList()
    {
        $list = [];

        $list['user_site_list'] = [];

        if (!empty($list)) $this->set(array_keys($list), $list);
        $this->list = $list;
        return $list;
    }
}
