<?php

namespace App\Model\Entity;

use Cake\Auth\DefaultPasswordHasher; // Add this line
use Cake\ORM\Entity;

class User extends Entity
{
    // Code from bake.
    const ROLE_DEVELOP = 0;
    const ROLE_ADMIN = 1;
    const ROLE_STAFF = 10;
    const ROLE_DEMO = 90;


    static $role_list = [
        self::ROLE_DEVELOP => '開発者',
        self::ROLE_ADMIN => '管理者',
        self::ROLE_STAFF => 'スタッフ',
        // self::ROLE_DEMO => 'デモ',
    ];


    // Add this method
    protected function _setPassword($value)
    {
        if (strlen($value)) {
            $hasher = new DefaultPasswordHasher();

            return $hasher->hash($value);
        }
    }
}
