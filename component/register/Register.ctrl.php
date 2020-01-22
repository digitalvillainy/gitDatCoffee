<?php
/* Generated by neoan3-cli */

namespace Neoan3\Components;

use Neoan3\Apps\Db;
use Neoan3\Apps\Ops;
use Neoan3\Apps\DbException;
use Neoan3\Apps\Session;
use Neoan3\Apps\Stateless;
use Neoan3\Core\RouteException;
use Neoan3\Core\Unicore;
use Neoan3\Frame\Cafe;
use Neoan3\Model\UserModel;
use Neoan3\Model\IndexModel;

/**
 * Class Register
 * @package Neoan3\Components
 */
class Register extends Cafe {
    /**
     * @param $credentials
     *
     * @return array
     * @throws RouteException
     */
    function postRegister(array $credentials) {
        /*        echo '<pre>';
                var_dump($credentials);
                die();*/
        $newUser = [
            'userName' => $credentials['userName'],
            'emails' => [['email' => $credentials['email']]],
            'password' => ['password' => $credentials['password']]
        ];

        try {
            $user = UserModel::create($newUser);
        } catch (\Exception $e) {
            throw new RouteException($e->getMessage(), 422);
        }

        // TODO: Update with PHPMailer verification
        $jwt = Stateless::assign($user['id'], 'user', ['exp' => time() + (2 * 60 * 60)]);
        return ['token' => $jwt];
    }

    /**
     * @param $body
     *
     * @return bool
     * @throws DbException
     * @throws RouteException
     */
    function putRegister(array $body) {
        $user = UserModel::get($body['userId']);
        if (empty($user)) {
            throw new RouteException('Bad Request', 400);
        }
        $password = IndexModel::first(Db::easy('user_password.id',
            ['confirm_code' => $body['confirmCode'], 'user_id' => '$' . $user['id'], '^delete_date', '^confirm_date']));
        if (empty($password)) {
            throw new RouteException('Bad Request', 400);
        }
        $insertPassword = '=' . password_hash($body['password'], PASSWORD_DEFAULT);
        Db::ask('>UPDATE user_password SET delete_date = NOW() WHERE delete_date IS NULL AND user_id = UNHEX({{user_id}}) AND id != UNHEX({{id}})',
            [
                'id' => $password['id'],
                'user_id' => $user['id']
            ]);
        Db::user_password(['user_id' => '$' . $user['id'], 'password' => $insertPassword, 'confirm_date' => '.'],
            ['id' => '$' . $password['id']]);
        return true;

    }
}
