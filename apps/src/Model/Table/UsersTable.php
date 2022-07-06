<?php

namespace App\Model\Table;

use Cake\Auth\DefaultPasswordHasher;
use Cake\Event\Event;
use Cake\ORM\Table;
use Cake\Utility\Security;
use Cake\Validation\Validator;
use App\Model\Entity\User;

class UsersTable extends Table
{


    public function beforeSave(Event $event)
    {
        $entity = $event->getData('entity');

        if ($entity->isNew()) {
            $hasher = new DefaultPasswordHasher();

            // Generate an API 'token'
            $entity->api_key_plain = Security::hash(Security::randomBytes(32), 'sha256', false);

            // Bcrypt the token so BasicAuthenticate can check
            // it during login.
            $entity->api_key = $hasher->hash($entity->api_key_plain);
        }
        return true;
    }


    public function validationDefault(Validator $validator)
    {
        $validator->notBlank('name', 'お名前をご入力ください')
            ->notEmptyString('name', 'お名前をご入力ください')
            ->maxLength('name', 60, '60字以内でご入力ください');

        $validator->notBlank('email', 'メールアドレスをご入力ください')
            ->notEmptyString('email', 'メールアドレスをご入力ください')
            ->maxLength('email', 60, '60字以内でご入力ください')
            ->add('email', 'valid-email', ['rule' => 'email', 'message' => __('メールアドレスフォーマットをご入力ください')]);

        $validator->notBlank('username', 'ログインネームをご入力ください')
            ->notEmptyString('username', 'ログインネームをご入力ください')
            ->maxLength('username', 30, '30字以内でご入力ください');

        $validator->notBlank('password', 'パスワードをご入力ください')
            ->notEmptyString('password', 'パスワードをご入力ください')
            ->maxLength('password', 200, '200字以内でご入力ください');

        $validator->add('status', 'validStatus', [
            'rule' => 'isValidStatus',
            'message' => __('掲載中又は下書きを選択してください'),
            'provider' => 'table',
        ]);

        $validator->add('role', 'validRole', [
            'rule' => 'isValidRole',
            'message' => __('権限を選択してください'),
            'provider' => 'table',
        ]);

        return $validator;
    }

    public function isValidRole($value, array $context)
    {
        return isset(User::$role_list[$value]);
    }

    public function isValidStatus($value, array $context)
    {
        return in_array($value, ['publish', 'draft'], true);
    }
}
