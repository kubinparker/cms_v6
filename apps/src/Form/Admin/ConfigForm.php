<?php

namespace App\Form\Admin;

use Cake\Form\Form;
use Cake\Form\Schema;
use Cake\Validation\Validator;

class ConfigForm extends Form
{
    protected function _buildSchema(Schema $schema)
    {
        return $schema->addField('title', 'string')
            ->addField('slug', ['type' => 'string'])
            ->addField('management_part', 'array');
    }

    public function validationDefault(Validator $validator)
    {
        $validator
            ->notEmptyString('title', 'ご入力してください')
            // ->notEmpty('title', 'ご入力してください')
            ->notBlank('title', 'ご入力してください')
            ->minLength('title', 2, '２文字以上でご入力してください')
            ->maxLength('title', 50, '５０文字以上でご入力してください');

        $validator
            ->notEmptyString('slug', 'ご入力してください')
            // ->notEmpty('slug', 'ご入力してください')
            ->notBlank('slug', 'ご入力してください')
            ->minLength('slug', 2, '２文字以上でご入力してください')
            ->maxLength('slug', 15, '１５文字以上でご入力してください');

        $validator
            ->notEmptyArray('management_part', 'ご選択してください');

        return $validator;
    }

    protected function _execute(array $data)
    {
        // Send an email.
        return true;
    }
}
