<?php
namespace Neoan3\Components;
use Neoan3\Apps\Stateless;
use Neoan3\Frame\Cafe;
use Neoan3\Core\RouteException;
class UserProfile extends Cafe {
    private $loadedComponents = ['navBar', 'signInModal'];

    /**
     * @throws \Neoan3\Core\RouteException
     */
    function init(){
        $this->hook('main', 'UserProfile')
             ->addHead('title', 'User Profile')
             ->vueComponents($this->loadedComponents)
             ->output();

    }
}
