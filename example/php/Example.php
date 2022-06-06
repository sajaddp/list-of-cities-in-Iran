<?php

class Example
{
    /** @return array  */
    public static function getCities(): array
    {
        $json = file_get_contents("../../json/cities.json");
        // var_dump(json_decode($json, true));
        return json_decode($json, true);
    }

    /** @return array  */
    public static function getProvinces(): array
    {
        $json = file_get_contents("../../json/provinces.json");
        // var_dump(json_decode($json, true));
        return json_decode($json, true);
    }
}
