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
use Cake\ORM\Entity;

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

    const OS_UNKNOWN = 1;
    const OS_WIN = 2;
    const OS_LINUX = 3;
    const OS_OSX = 4;
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
            $this->viewBuilder()->setLayout('common');
        } else {

            $this->viewBuilder()->setLayout('simple');
        }
    }


    /**
     * 一覧
     * 
     * @param \ArrayObject $cond
     * @param \ArrayObject $options
     * */
    protected function _lists($cond = [], $options = [])
    {
        $primary_key = $this->{$this->modelName}->getPrimaryKey();
        $this->paginate = array_merge(
            [
                'order' => [$this->modelName . '.' . $primary_key . ' DESC'],
                'limit' => 10,
                'paramType' => 'querystring',
            ],
            $options
        );

        $modelName = $this->modelName;

        $mapper = function ($table, $key, $mapReduce) use ($modelName) {
            $table->attaches = [];
            $id = $table->id;

            // file attached
            if ($table->attached_files)
                $table->attaches['files'] = array_map(function ($f) use ($modelName, $id) {
                    $f->path = '/upload' . DS . $modelName . DS . $id . DS . 'files' . DS . $f->file_name;
                    return $f;
                }, $table->attached_files);

            // images attached
            if ($table->attached_images)
                $table->attaches['images'] = array_map(function ($f) use ($modelName, $id) {
                    $f->path = '/upload' . DS . $modelName . DS . $id . DS . 'images' . DS . $f->file_name;
                    $thumb = [];
                    if (isset($this->{$modelName}->attaches['images']['thumbnails']) && !empty($this->{$modelName}->attaches['images']['thumbnails'])) {
                        foreach ($this->{$modelName}->attaches['images']['thumbnails'] as $prefix => $_) {
                            $thumb[$prefix] = '/upload' . DS . $modelName . DS . $id . DS . 'images' . DS . $prefix . $f->file_name;
                        }
                    }
                    $f->thumbnail = $thumb;
                    return $f;
                }, $table->attached_images);

            $mapReduce->emit($table, $key);
        };

        $reducer = function ($table, $key, $mapReduce) {
            $mapReduce->emit($table, $key);
        };

        if ($cond) $options['conditions'] = $cond;

        if ($this->paginate['limit'] === null) {
            unset(
                $options['limit'],
                $options['paramType']
            );

            $lists = $this->{$this->modelName}
                ->find('all', $options)
                ->mapReduce($mapper, $reducer);
        } else $lists = $this->{$this->modelName}->find('all')->mapReduce($mapper, $reducer);

        $this->set('total_count', $lists->count());
        $this->set('datas', $lists);

        $datas = ($this->paginate['limit'] === null) ? $lists : $this->paginate($lists, $options);
        $this->set($this->{$this->modelName}->getTable(), $datas);
        return $datas;
    }


    /**
     * 追加、編集
     * 
     *@param integer $id
     *@param \ArrayObject $cond
     * */
    protected function _detail($id = null, $cond = [], $options = [])
    {
        $cond = empty($cond) && !is_null($id) ? [$this->modelName . '.id' => $id] : $cond;

        if (empty($cond)) return null;

        $modelName = $this->modelName;

        $mapper = function ($table, $key, $mapReduce) use ($modelName) {
            $table->attaches = [];
            $id = $table->id;

            // file attached
            if ($table->attached_files)
                $table->attaches['files'] = array_map(function ($f) use ($modelName, $id) {
                    $f->path = '/upload' . DS . $modelName . DS . $id . DS . 'files' . DS . $f->file_name;
                    return $f;
                }, $table->attached_files);

            // images attached
            if ($table->attached_images)
                $table->attaches['images'] = array_map(function ($f) use ($modelName, $id) {
                    $f->path = '/upload' . DS . $modelName . DS . $id . DS . 'images' . DS . $f->file_name;
                    $thumb = [];
                    if (isset($this->{$modelName}->attaches['images']['thumbnails']) && !empty($this->{$modelName}->attaches['images']['thumbnails'])) {
                        foreach ($this->{$modelName}->attaches['images']['thumbnails'] as $prefix => $_) {
                            $thumb[$prefix] = '/upload' . DS . $modelName . DS . $id . DS . 'images' . DS . $prefix . $f->file_name;
                        }
                    }
                    $f->thumbnail = $thumb;
                    return $f;
                }, $table->attached_images);

            $mapReduce->emit($table, $key);
        };

        $reducer = function ($table, $key, $mapReduce) {
            $mapReduce->emit($table, $key);
        };

        $options = array_merge(
            [
                'conditions' => $cond,
            ],
            $options
        );

        $data = $this->{$this->modelName}
            ->find('all', $options)
            ->mapReduce($mapper, $reducer);

        $assoctiation = $this->{$this->modelName}->associations()->keys();
        if ($assoctiation) $data = $data->contain($assoctiation);
        $data = $data->first();

        $this->set(compact('data'));
        $this->set($this->{$this->modelName}->getTable(), $data);
        return $data;
    }



    protected function setHeadTitle($title = Null, $isFull = False)
    {
        $_title = \Cake\Core\Configure::read('App.headTitle');
        if ($title) {
            $title = is_array($title) ? implode('｜', $title) : $title;
            $_title = $isFull ? $title : __('{0}｜{1}', [$title, $_title]);
        }
        $this->set('__title__', $_title);
        return $_title;
    }


    static public function getOS()
    {
        switch (true) {
            case stristr(PHP_OS, 'DAR'):
                return self::OS_OSX;
            case stristr(PHP_OS, 'WIN'):
                return self::OS_WIN;
            case stristr(PHP_OS, 'LINUX'):
                return self::OS_LINUX;
            default:
                return self::OS_UNKNOWN;
        }
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



    protected function setList()
    {
        $list = [];

        $list['status'] = [
            PUBLISH => '掲載中',
            DRAFT => '下書き'
        ];

        if (!empty($list)) $this->set(array_keys($list), $list);
        $this->list = $list;
        return $list;
    }
}
