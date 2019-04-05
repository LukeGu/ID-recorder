import React, { Component } from "react";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

class MyCamera extends Component {
  state = {
    image: ""
  };
  onTakePhoto(dataUri) {
    // Do stuff with the photo...
    //console.log(dataUri);

    var canvas = document.getElementById("c");
    var ctx = canvas.getContext("2d");
    var image = new Image();
    image.onload = function() {
      ctx.drawImage(image, 10, 10);
    };
    image.src = dataUri;

    this.setState({
      image: dataUri
    });
    console.log("takePhoto");
  }

  onCameraError(error) {
    console.error("onCameraError", error);
  }

  onRecongize() {
    var img = document.getElementById("imgID");
    var blobImg = convertBase64UrlToBlob(img.src);

    var canvas = document.getElementById("c");

    var Tesseract = window.Tesseract;

    Tesseract.recognize(canvas)
      //.progress(function  (p) { console.log('progress', p)    })
      .then(function(result) {
        console.log("result", result);
      });
  }

  render() {
    return (
      <div className="App">
        <Camera
          onTakePhoto={dataUri => {
            this.onTakePhoto(dataUri);
          }}
          onCameraError={error => {
            this.onCameraError(error);
          }}
          idealFacingMode={FACING_MODES.ENVIRONMENT}
          idealResolution={{ width: 640, height: 480 }}
          imageType={IMAGE_TYPES.JPG}
          imageCompression={0.97}
          isMaxResolution={false}
          isImageMirror={false}
          isDisplayStartCameraError={true}
          sizeFactor={1}
        />
        <hr />
        <button onClick={this.onRecongize}>Analyse</button>
        <hr />
        <p>CANVAS</p>
        <canvas id="c" width="640" height="480" />
        <p>IMAGE</p>
        <img id="imgID" src={this.state.image} alt="img" />
      </div>
    );
  }
}

const convertBase64UrlToBlob = urlData => {
  const bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
  //处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type: "image/png" });
};

export default MyCamera;
