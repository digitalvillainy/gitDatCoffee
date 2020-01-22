<?php
namespace Neoan3\Components;
use Neoan3\Frame\Cafe;

class CreatorDashboard extends Cafe {
    private $loadedComponents = ['navBar'];
    function init(){
        $this->hook('main', 'CreatorDashboard')->vueComponents($this->loadedComponents)
            ->output();
    }
}
