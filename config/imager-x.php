<?php

return [
  'imagerSystemPath' => '@webroot/images/transforms/',
  'imagerUrl' => '@web/images/transforms',
  'jpegQuality' => 80,
  'webpQuality' => 80,
  'optimizers' => ['jpegtran', 'gifscile', 'pngquant'],
  'useCwebp' => true,
  'interlace' => 'plane',
  'allowUpscale' => false
];
