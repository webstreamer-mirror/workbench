# workbench
Webstreamer front end to debug and test

This project is ported from [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) details see [changelog](./CHANGELOG.md).

## how use
for debug, please run command
```sh
npm run debug
```

## Features

* WebRTC

  webrtc is based of [vue-webrtc](https://github.com/westonsoftware/vue-webrtc).
  
  * webrtc/console
    
    This page is used for developer debug webrtc feature development.

    <font color=#ff0000>**Kown issue**</font>

    - audio/video checkbox is invalid

  * webrtc/livestream
    
    重复添加删除同一个webrtc audience时，需要有一定间隔



* Video.JS

  Leverage [Video.JS](videojs.com) project toe play HLS and DASH. In workbench we use the vue wrapper
  [vue-video-player](https://github.com/surmon-china/vue-video-player).
  









## Credits
* Free software [SVG online editor from runoob](https://c.runoob.com/more/svgeditor)

* Chao Lee [@miaolz123 on GitHub vue-markdown](https://github.com/miaolz123/vue-markdown)

* Surmon [@surmon-china on GitHub vue-video-player](https://github.com/surmon-china/vue-video-player)

* PanJiaChen  [@PanJiaChen on GitHub vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) 

* Andy Weston [@AndyWeston on GitHub at vue-webrtc](https://github.com/westonsoftware)

  This project is based off of the excellent work found at WebRTC Experiments:
https://www.rtcmulticonnection.org/


  The Vue.js work is based on this camera component:  
[@vinceg vue-web-cam](https://github.com/vinceg/vue-web-cam)

