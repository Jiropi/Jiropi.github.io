const renderer = new THREE.WebGLRenderer
(
    {
        antialias : true,
        alpha : true
    }
);

renderer.setClearColor(new THREE.Color(), 0);
renderer.setSize(640, 480);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0px';
renderer.domElement.style.left = '0px';
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.visible = false;
const cameta = new THREE.Camera();
scene.add(camera);

const arToolkitSource = new THREEx.ArToolkitSource
(
    {
        sourceType : 'webcam'
    }
);

arToolkitSource.init(() =>
{
    onresize();
});

function onresize()
{
    arToolkitSource.OnResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if(arToolkitContext.arController != null)
    {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
};

const arToolkitContext = new THREEx.arToolkitContext
(
    {
        cameraParameterUrl : 'data/camera_para.dat',
        detecionMode : 'mono'
    }
);

arToolkitContext.init(() =>
{
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

const arMarkerControls = new THREEx.arMarkerControls
(
    arToolkitContext,
    camera,

    {
        type : 'pattern',
        patternUrl : 'data/patt.hiro',
        changeMatrixMode : 'cameraTransformMatrix'
    }
);

let clock = new THREE.Clock();
let animationMixer = null;

let model = null;

const loader = new THREE.GLTFLoader();
loader.setCrossOrigin('anonymous');
const dloader = new THREE.DRACOLoader();
loader.setDRACOLoader(dloader);
loader.load('model/Monky.glb', function(gltf)
{
    model = gltf.scene;
    model.scale.set(40.0, 40.0, 40.0);
    model.position.set(0,0,0);
    model.rotation.set(0,0,0);

    const animations = gltf.animations;
    if(animations && animations.length)
    {
        let i;
        animationMixer = new THREE.animationMixer(model);
        for(i = 0; i < animations.length; i++)
        {
            animationMixer.clipAction(animations[i]).play();
        }
    }
    console.log('load');
    scene.add(model);
});

renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
directionalLight.position.set(1,1,1);
directionalLight.intensity = 2;
scene.add(directionalLight);
scene.add(ambientLight);

tick();

function tick()
{
    renderer.render(scene, camera);

    if(clock && animationMixer)
    {
        animationMixer.update(clock.getDelta());
    }
    if(arToolkitSource.ready)
    {
        arToolkitContext.update(arToolkitSource.domElement);
        scene.visible = camera.visible;
    }
}