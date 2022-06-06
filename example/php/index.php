<?php

require_once 'Example.php';

echo "<h1>Example Class `./example\php\Example.php`</h1>\n\n";

echo "<h2>Provinces: array</h2>\n";
print_r(Example::getProvinces());

echo "<h2>Cities: array</h2>\n";
print_r(Example::getCities());
