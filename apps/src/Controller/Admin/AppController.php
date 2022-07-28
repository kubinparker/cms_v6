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

use Cake\ORM\Table;
use Cake\Event\Event;
use Cake\Core\Configure;
use App\Model\Entity\User;
use Cake\ORM\TableRegistry;
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
    const NEW_CONFIG = 0;
    const DEFAULT_CONFIG = 1;
    const PUBLISH_CONFIG = 2;

    public $convertPath = '/usr/bin/convert';
    public $auth_storage_key = '';

    public $font_config = [
        ['name' => '新着情報', 'options' => ['一覧', '詳細']],
        ['name' => 'お問い合わせ', 'options' => ['入力・確認・完了']]
        // ['name' => 'お問い合わせ', 'options' => ['入力・確認・完了', '保存']]
    ];

    public $admin_config = [];

    public $file_extension = ['pdf', 'csv', 'xlsx', 'xls', 'doc', 'docx'];
    public $image_extension = ['jpg', 'jpeg', 'gif', 'png'];

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
            return $this->redirect(strtolower(__('/{prefix}', ['prefix' => $prefix])));
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
        } else {
            if ($this->Session->check('code_upload')) {
                // 仮パスをRemove
                system(escapeshellcmd(__('rm -rf {0}{1}', [WWW_ROOT, 'upload_tmp/' . $this->Session->read('code_upload')])));
                system(escapeshellcmd(__('rm -rf {0}{1}', [WWW_ROOT, 'upload_file_tmp/' . $this->Session->read('code_upload')])));
                $this->Session->delete('code_upload');
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
    protected function _delete($id, $options = [])
    {
        $option = array_merge(
            ['redirect' => null],
            $options
        );
        extract($option);

        $data = $this->_detail($id);
        if ($data) {
            $this->{$this->modelName}->delete($data);

            $files = glob(WWW_ROOT . 'upload/' . $this->modelName . '/' . $id . '/files/*'); // file
            foreach ($files as $file) { // iterate files
                if (is_file($file)) {
                    unlink($file); // delete file
                }
            }
            $files = glob(WWW_ROOT . 'upload/' . $this->modelName . '/' . $id . '/images/*'); // image
            foreach ($files as $file) { // iterate files
                if (is_file($file)) {
                    unlink($file); // delete file
                }
            }
            $id = null;
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

        if (get_class($this->{$this->modelName}) !== \Cake\ORM\Table::class && $this->_detail($id))
            $this->{$this->modelName}->movePosition($this->{$this->modelName}, $id, $pos);

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

    /**
     * Ckeditorからイメージのアップロード
     * */
    public function uploadImageCkeditor()
    {
        if ($this->request->is(['post', 'put'])) {
            $upload_file = (array) $this->request->getData('upload');
            $data = $this->__uploadTmp('upload_tmp', 'upload', [$upload_file]);
            echo json_encode($data[0]);
            exit();
        }
        return $this->redirect(['prefix' => 'admin', 'controller' => 'Admin', 'action' => 'logout']);
    }

    /**
     * input から
     * */
    public function uploadImage()
    {
        if ($this->request->is(['post', 'put'])) {
            $data = (array) $this->request->getData();
            if (isset($data['images'])) {
                echo json_encode(['success' => true, 'data' => $this->__uploadTmpImages($data['images'], $data['slug'])]);
                exit();
            }
        }
        return $this->redirect(['prefix' => 'admin', 'controller' => 'Admin', 'action' => 'logout']);
    }

    /**
     * Inputファイルから
     */
    protected function __uploadTmpImages($data, $model)
    {
        if (!$this->Session->check('code_upload')) $this->Session->write('code_upload', md5(round(microtime(true) * 10000)));
        $folder_name = $this->Session->read('code_upload');

        $model = TableRegistry::getTableLocator()->get($model);
        $attaches_image = $model->attaches['images'];
        if (empty($attaches_image)) return ['setting' => '\App\Model\Table\〇〇Table ファイルの「$attaches」が設定されていません。'];

        if (isset($attaches_image['extensions']) && !empty($attaches_image['extensions']))
            $this->image_extension = $attaches_image['extensions'];

        $exts =  $this->image_extension;

        $upload_file = $data;
        $return = [];

        for ($i = 0; $i < count($upload_file); $i++) {
            $upload = $upload_file[$i];

            if (!empty($upload['tmp_name']) && $upload['error'] === UPLOAD_ERR_OK) {

                $ext = strtolower(substr(strrchr($upload['name'], '.'), 1));

                if (in_array($ext, $exts)) {
                    $newname = __('{0}_{1}.{2}', [$folder_name, round(microtime(true) * 10000), $ext]);
                    $dir = __('{0}upload_tmp/{1}/', [WWW_ROOT, $folder_name]);

                    if (!is_dir($dir)) (new \Cake\Filesystem\Folder())->create($dir, 0777);

                    if (Self::getOS() == Self::OS_WIN)
                        $model->generate_thumbnail($upload['tmp_name'], $dir . $newname, $attaches_image['width'], $attaches_image['height']);
                    else
                        $this->convert_img(__('{0}x{1}', $attaches_image['width'], $attaches_image['height']), $upload['tmp_name'], $dir . $newname);

                    if (isset($attaches_image['thumbnails']) && !empty($attaches_image['thumbnails']))
                        foreach ($attaches_image['thumbnails'] as $suffix => $val) {
                            if (Self::getOS() == Self::OS_WIN)
                                $model->generate_thumbnail($upload['tmp_name'], $dir . $suffix . $newname, $val['width'], $val['height']);
                            else
                                $this->convert_img(__('{0}x{1}', $val['width'], $val['height']), $upload['tmp_name'], $dir . $suffix . $newname);
                        }

                    $return[] = ['url' => __('/upload_tmp/{0}/{1}', [$folder_name, $newname]), 'original_name' => str_replace(']', '=&', $upload['name']), 'size' => $upload['size'], 'class' => $ext, 'element' => [$upload['name']]];
                }
            }
        }
        return $return;
    }

    /**
     * Ckeditorからファイルのアップロード
     * */
    public function uploadFiles()
    {
        if ($this->request->is(['post', 'put'])) {
            $upload_file = (array) $this->request->getData('files');
            $slug = $this->request->getData('slug') ?? false;
            $data = $this->__uploadTmp('upload_file_tmp', 'files', $upload_file, $slug);
            echo json_encode(['success' => true, 'data' => $data]);
            exit();
        }
        return $this->redirect(['prefix' => 'user', 'controller' => 'users', 'action' => 'logout']);
    }


    protected function __uploadTmp($tmpFolder = 'upload_tmp', $type, $datas, $slug = false)
    {
        if (!$this->Session->check('code_upload')) $this->Session->write('code_upload', md5(round(microtime(true) * 10000)));

        $folder_name = $this->Session->read('code_upload');

        if ($slug) {
            $model = TableRegistry::getTableLocator()->get($slug);
            $attaches_files = $model->attaches['files'];
            if (empty($attaches_files)) return ['setting' => '\App\Model\Table\〇〇Table ファイルの「$attaches」が設定されていません。'];

            if (isset($attaches_files['extensions']) && !empty($attaches_files['extensions']))
                $this->image_extension = $attaches_files['extensions'];
        }

        $exts = $type == 'files' ? $this->file_extension : $this->image_extension;

        $upload_file = $datas;
        $return = [];

        for ($i = 0; $i < count($upload_file); $i++) {
            $upload = $upload_file[$i];
            if (!empty($upload['tmp_name']) && $upload['error'] === UPLOAD_ERR_OK) {

                $ext = strtolower(substr(strrchr($upload['name'], '.'), 1));

                if (in_array($ext, $exts)) {

                    $newname = __('{0}_{1}.{2}', [$folder_name, round(microtime(true) * 10000), $ext]);
                    $dir = __('{0}{1}/{2}', [WWW_ROOT, $tmpFolder, $folder_name]);

                    if (!is_dir($dir)) (new \Cake\Filesystem\Folder())->create($dir, 0777);

                    move_uploaded_file($upload['tmp_name'], $dir . '/' . $newname);
                    chmod($dir . '/' . $newname, 0777);

                    $return[] = ['url' => __('/{0}/{1}/{2}', [$tmpFolder, $folder_name, $newname]), 'original_name' => str_replace(']', '=&', $upload['name']), 'size' => $upload['size'], 'class' => $ext, 'element' => [$upload['name']]];
                }
            }
        }
        return $return;
    }


    protected function _associations_attached()
    {
        $slug = $this->modelName;
        return [
            'AttachedFiles' => function ($q) use ($slug) {
                return $q->where(['slug' => $slug]);
            },
            'AttachedImages' => function ($q) use ($slug) {
                return $q->where(['slug' => $slug]);
            }
        ];
    }


    public function convert_img($size, $source, $dist, $method = 'fit')
    {
        list($ow, $oh, $info) = getimagesize($source);
        $sz = explode('x', $size);
        $cmdline = $this->convertPath;

        $is_local = strpos(env('HTTP_HOST'), 'local') !== false;
        if ($is_local) {
            $cmdline = '/usr/local/bin/convert';
        }
        //サイズ指定ありなら
        if (0 < $sz[0] && 0 < $sz[1]) {

            //枠をはみ出していれば、縮小
            if ($method === 'cover' || $method === 'crop') {
                //中央切り取り
                $crop = $size;
                if (($ow / $oh) <= ($sz[0] / $sz[1])) {
                    //横を基準
                    $size = $sz[0] . 'x';
                } else {
                    //縦を基準
                    $size = 'x' . $sz[1];
                }

                //cover
                $option = '-resize ' . $size;

                //crop
                if ($method === 'crop') {
                    $option .= ' -gravity center -crop ' . $crop . '+0+0';
                }
                // convert /Applications/MAMP/tmp/php/phpaEoIyy -resize  new.png
            } else {
                //通常の縮小 拡大なし
                $option = '-resize ' . $size;
            }
        } else {
            //サイズ指定なしなら 単なるコピー
            $size = $ow . 'x' . $oh;
            $option = '-resize ' . $size . '>';
        }

        $a = system(escapeshellcmd($cmdline . ' ' . $option . ' ' . $source . ' ' . $dist));
        @chmod($dist, 0666);
        return $a;
    }


    protected function setList()
    {
        parent::setList();
        $list = [];

        $role = @$this->Session->read($this->auth_storage_key)['role'];

        $list['config_list'] = $this->loadModel('configs')->find('all')
            ->where(['is_default !=' => self::DEFAULT_CONFIG])
            ->toArray();

        $list['role'] = $role;
        $list['role_list'] = User::$role_list;
        $list['user_site_list'] = [];

        $list['user_menu_list'] = [
            '管理' => []
        ];

        if ($this->isLogin() && in_array($role, [User::ROLE_DEVELOP], true)) {
            $list['user_site_list']['users'] = 'ユーザ管理';
            $list['user_menu_list']['設定']['configs'] = 'コンテンツ設定';
            $list['user_menu_list']['管理']['users'] = 'ユーザ管理';
        } else 
        if ($this->isLogin() && in_array($role, [User::ROLE_ADMIN], true)) {
            unset($list['role_list'][User::ROLE_DEVELOP]);
            $list['user_site_list']['users'] = 'ユーザ管理';
            $list['user_menu_list']['管理']['users'] = 'ユーザ管理';
        }
        if ($this->Session->check('code_upload')) $this->{$this->modelName}->code_upload = $this->Session->read('code_upload');

        if (!empty($list)) $this->set(array_keys($list), $list);
        $this->list = $list;
        return $list;
    }
}
