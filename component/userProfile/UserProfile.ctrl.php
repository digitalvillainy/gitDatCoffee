<?php
namespace Neoan3\Components;
use Neoan3\Frame\Cafe;

class UserProfile extends Cafe {
    private $loadedComponents = ['navBar'];
    function init(){
        $this->hook('main', 'UserProfile')->vueComponents($this->loadedComponents)
            ->output();
    }
}
