<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    public static function bootHasSlug()
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = self::generateUniqueSlug(get_class($model), $model->title);
            }
        });

        static::updating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = self::generateUniqueSlug(get_class($model), $model->title);
            }
        });
    }

    public static function generateUniqueSlug($modelClass, $title)
    {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;

        while ($modelClass::where('slug', $slug)->exists()) {
            $slug = $original . '-' . $count++;
        }

        return $slug;
    }
}
