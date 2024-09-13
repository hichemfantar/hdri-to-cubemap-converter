import { OrbitControls } from "../examples/OrbitControls";
import { mainCamera } from "../components/base";

const cameraControl = new OrbitControls(mainCamera);
mainCamera.position.set(0, 0, 1);
cameraControl.autoRotate = false;
cameraControl.enablePan = true;
cameraControl.enableDamping = true;
cameraControl.dampingFactor = 0.1;
cameraControl.rotateSpeed = 0.035;
cameraControl.enableZoom = true;
cameraControl.enabled = false;
cameraControl.update();

export { cameraControl };
