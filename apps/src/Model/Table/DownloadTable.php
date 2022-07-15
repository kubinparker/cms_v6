<?php

namespace App\Model\Table;

use Cake\Validation\Validator;
use App\Model\Table\AppTable;


class DownloadTable extends AppTable
{
    public $attaches = [
        'images' => [
            'image' => [
                'extensions' => ['jpg', 'jpeg', 'gif', 'png'],
                'width' => 430,
                'height' => 290,
                'file_name' => 'img_%d_%s',
                'thumbnails' => [
                    's' => [
                        'prefix' => 's_',
                        'width' => 123,
                        'height' => 123
                    ]
                ],
            ],
        ],
        'files' => [],
    ];

    public function initialize(array $config)
    {
        $this->slug = "Download";
        $options["contain"] = $this->_associations_attached();
    }

    public function validationDefault(Validator $validator)
    {
        // any validation
        return $validator;
    }
}
