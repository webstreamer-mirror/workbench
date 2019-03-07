<template>
  <div class="app-container">
    <div id="ocr_results"></div>
    <div id="ocr_status"></div>
  </div>
</template>

<script>
import leveljs from "level-js";

export default {
  name: "tesseract",
  components: {},
  data() {
    return {
      api: null,
      db: null
    };
  },
  mounted() {
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      "http://192.168.199.128:8088/build/tesseract.js"
      //   "@/assets/wasm/tesseract.js"
    );
    recaptchaScript.async = true;
    document.head.appendChild(recaptchaScript);
    console.log("-------------------------------");
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    var noIDB = typeof indexedDB === "undefined" || iOS;
    this.db = noIDB ? { open: (_, cb) => cb(true) } : leveljs("./tessdata2");

    this.getLanguageData(data => {
      console.log(data.length);
      Module.FS_createPath("/", "tessdata", true, true);
      Module.FS_createDataFile(
        "tessdata",
        "eng.traineddata",
        data,
        true,
        false
      );
    });

    // load tesserac.js from cdn
    // let recaptchaScript = document.createElement("script");
    // recaptchaScript.setAttribute(
    //   "src",
    //   "https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v1.0.14/dist/tesseract.min.js"
    // );
    // recaptchaScript.async = true;
    // document.head.appendChild(recaptchaScript);
  },
  methods: {
    getLanguageData(cb) {
      let self = this;
      this.db.open({ compression: false }, err => {
        if (err) return self.fetchLanguageData(cb);
        self.db.get("eng", (err, data) => {
          if (err)
            return self.fetchLanguageData(data => {
              self.db.put("eng", data, err =>
                console.log("cached language data eng")
              );
            });
          console.log("get language data from db");
          cb(data);
        });
      });
    },
    fetchLanguageData(cb) {
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        //   "https://tessdata.projectnaptha.com/3.02/eng.traineddata.gz",
        "http://192.168.199.128:8088/build/data/tessdata/eng.traineddata",
        true
      );
      xhr.responseType = "arraybuffer";
      xhr.onerror = e => {
        xhr.onprogress = xhr.onload = null;
        console.log("------download error!!!!");
      };
      xhr.onprogress = e => {
        console.log(
          "----downloading------ " + Math.min(1, e.loaded / 31873501)
        ); //31873501  9453554
      };
      let self = this;
      xhr.onload = e => {
        if (!(xhr.status == 200 || (xhr.status == 0 && xhr.response))) {
          console.log("------download error");
          return;
        }

        var response = new Uint8Array(xhr.response);

        // Module.FS_createPath("/", "tessdata", true, true);
        // Module.FS_createDataFile(
        //   "tessdata",
        //   "eng.traineddata",
        //   response,
        //   true,
        //   false
        // );
        console.log("download eng.traineddata ok! size:" + response.length);
        //   self.api = new Module.TessBaseAPI();
        //   self.api.Init("/tessdata", "eng");
        //   self.api.SetVariable("tessedit_char_whitelist", "0123456789:.");
        //   self.api.SetVariable("tessedit_char_blacklist", "0123456789:.");
        if (cb) cb(response);
      };
      xhr.send();
    },
    desaturate(image) {
      var width, height;
      if (image.data) {
        var src = image.data,
          width = image.width,
          height = image.height;
        var dst = new Uint8Array(width * height);
        var srcLength = src.length | 0,
          srcLength_16 = (srcLength - 16) | 0;

        for (var i = 0, j = 0; i <= srcLength_16; i += 16, j += 4) {
          // convert to grayscale 4 pixels at a time; eveything with alpha gets put in front of 50% gray
          dst[j] =
            ((src[i] * 77 + src[i + 1] * 151 + src[i + 2] * 28) * src[i + 3] +
              ((255 - src[i + 3]) << 15) +
              32768) >>
            16;
          dst[j + 1] =
            ((src[i + 4] * 77 + src[i + 5] * 151 + src[i + 6] * 28) *
              src[i + 7] +
              ((255 - src[i + 7]) << 15) +
              32768) >>
            16;
          dst[j + 2] =
            ((src[i + 8] * 77 + src[i + 9] * 151 + src[i + 10] * 28) *
              src[i + 11] +
              ((255 - src[i + 11]) << 15) +
              32768) >>
            16;
          dst[j + 3] =
            ((src[i + 12] * 77 + src[i + 13] * 151 + src[i + 14] * 28) *
              src[i + 15] +
              ((255 - src[i + 15]) << 15) +
              32768) >>
            16;
        }
        for (
          ;
          i < srcLength;
          i += 4, ++j //finish up
        )
          dst[j] =
            ((src[i] * 77 + src[i + 1] * 151 + src[i + 2] * 28) * src[i + 3] +
              ((255 - src[i + 3]) << 15) +
              32768) >>
            16;
        image = dst;
      } else {
        throw "Invalid ImageData";
      }
      return image;
    },
    createBMP(canvas) {
      var context = canvas.getContext("2d");
      var width = canvas.width;
      var height = canvas.height;
      var imageData = context.getImageData(0, 0, width, height);
      var imgbin = this.desaturate(imageData);

      return imgbin;
    },
    runOCR(canvas) {
      //   console.log(Module.version());
      //   Module.test_file("data/tessdata/eng.traineddata");
      let api = new Module.TessBaseAPI();
      api.Init("/tessdata", "eng");
      api.SetVariable("tessedit_char_whitelist", "0123456789:.");
      api.SetVariable("tessedit_char_blacklist", " ");
      let imgbin = this.createBMP(canvas);
      //   let imgbin = this.desaturate(image);
      let dataPtr = Module._malloc(canvas.width * canvas.height);
      let dataHeap = new Uint8Array(
        Module.HEAPU8.buffer,
        dataPtr,
        canvas.width * canvas.height
      );
      dataHeap.set(new Uint8Array(imgbin));
      api.SetImage(dataPtr, canvas.width, canvas.height, 1, canvas.width);

      let result = api.GetUTF8Text();
      result = result.slice(0, 11);
      console.log(result);
      document.getElementById("ocr_results").innerText =
        new Date() + ": " + result;
      api.End();
      // Module.pixDestroy(image);
      api.delete();
      api = null;

      //   Tesseract.recognize(image, {
      //     lang: "eng",
      //     tessedit_char_whitelist: "0123456789:."
      //   })
      //     .then(function(result) {
      //       document.getElementById("ocr_results").innerText = result.text;
      //     })
      //     .progress(function(result) {
      //       document.getElementById("ocr_status").innerText =
      //         result["status"] + " (" + result["progress"] * 100 + "%)";
      //     });
    }
  }
};
</script>

