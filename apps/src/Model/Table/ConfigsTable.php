<?php

namespace App\Model\Table;

use Cake\Event\Event;
use Cake\ORM\Table;
use Cake\Datasource\EntityInterface;
use Cake\Validation\Validator;
use Cake\ORM\TableRegistry;


class ConfigsTable extends Table
{

    public function initialize(array $config)
    {
        $this->addBehavior('My');
    }

    public function validationDefault(Validator $validator)
    {
        $validator
            ->notEmptyString('title', 'ご入力してください')
            ->notBlank('title', 'ご入力してください')
            ->minLength('title', 2, '２文字以上でご入力してください')
            ->maxLength('title', 50, '５０文字以上でご入力してください');

        $validator
            ->notEmptyString('slug', 'ご入力してください')
            ->notBlank('slug', 'ご入力してください')
            ->minLength('slug', 2, '２文字以上でご入力してください')
            ->maxLength('slug', 15, '１５文字以上でご入力してください')
            ->add(
                'slug',
                [
                    'custom' => [
                        'rule' => function ($value, $context) {
                            if (
                                $this->find(
                                    'all',
                                    [
                                        'conditions' => [
                                            'slug' => $value
                                        ]
                                    ]
                                )
                                ->toArray()
                            ) {
                                return '※既に存在しています';
                            }
                            return true;
                        }
                    ]
                ]
            );

        return $validator;
    }
}
