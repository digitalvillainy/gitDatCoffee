<?php
/* Generated by neoan3-cli */

namespace Neoan3\Components;
use Neoan3\Apps\Db;
use Neoan3\Apps\Stateless;
use Neoan3\Frame\Cafe;
use Neoan3\Model\IndexModel;
use Neoan3\Model\UserModel;

class User extends Cafe
{
    /**
     * @param array $body
     *
     * @return array
     * @throws \Neoan3\Apps\DbException
     * @throws \Neoan3\Core\RouteException
     */
    function getUser(array $body)
    {
        $jwt = Stateless::restrict('admin');
        $response = ['users' => [], 'total'=> 0];
        $start = isset($body['skip']) ? $body['skip'] : 0;
        $limit = isset($body['top']) ? $body['top'] : 20;
        $response['total'] = (int) IndexModel::first(
            Db::ask('>SELECT COUNT(*) as total FROM user WHERE delete_date IS NULL')
        )['total'];
        $users = Db::easy('user.id',
            ['^delete_date','user_name'=>'{ LIKE "%'.$body['nameFilter'].'%" }'],
            ['limit' => [$start, $limit]]);
        foreach ($users as $user) {
            $response['users'][] = UserModel::get($user['id']);
        }
        return $response;
    }

}
