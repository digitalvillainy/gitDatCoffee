<?php
namespace Neoan3\Components;
use Neoan3\Frame\Cafe;

class Home extends Cafe {
    private $loadedComponents = ['navBar', 'signInModal'];
    function init(){
        $this->hook('main', 'Home')
            ->addHead('title','gitDat.coffee, Coffee for coders')
            ->vueComponents($this->loadedComponents)
            ->output();
    }
}
