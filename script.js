const video = document.getElementById('video')

// Loading models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // Quick realtime face detector running inside the browser.
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // Recognizing different parts of face. Nose, mouth, eyes etc.
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // Recognize faces and wrap from box.
  faceapi.nets.faceExpressionNet.loadFromUri('/models') // Recognize facial expressions. Happy, sad, angry etc.
]).then(startVideo)

function startVideo() {
  // Stream webcam video into HTML document.
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
  video.srcObject = stream;
 })
}

video.addEventListener('play', () => {
  // Creating canvas element to display FaceLandmarks and FaceExpressions.
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {
    // Detect all the faces in webcam image
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    
    // Resizing canvas to video element.
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    // Clear canvas before draw. Otherwise it will draw over the previous drawing and it will be a mess.
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

    // Drawing following things in canvas.
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})

//startVideo()