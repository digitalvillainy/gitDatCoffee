<?php
namespace Neoan3\Components;
use Neoan3\Frame\Cafe;

class {{name}} extends Cafe {
    private $loadedComponents = [];
    function init(){
        $this->hook('main', '{{name}}')->vueComponents($this->loadedComponents)
            ->output();
    }
}
