window.addEventListener('load', init)

const width = 1920;
const height = 1080;

function init()
{
    const renderer = new THREE.WebGLRenderer
    (
        {
            canvas: document.querySelector('#myCanvas')
        }
    );
    document.body.appendChild( renderer.domElement ); 
    renderer.setPixelRatio(1);
    renderer.setSize(width, height);
    console.log(width, height);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);
    camera.position.set(0,40, +200);

    let clock = new THREE.Clock();
    let animationMixer = null;

    const texture = new THREE.Texture();

    let model = null;
    const loader = new THREE.GLTFLoader();
    loader.setCrossOrigin( 'anonymous' );
    const dloader = new THREE.DRACOLoader();
    loader.setDRACOLoader(dloader);
    loader.load('model/Test02.glb', function(gltf)
    {
        model = gltf.scene;
        model.scale.set(40.0, 40.0, 40.0);
        model.position.set(0,0,0);
        model.rotation.set(0, 0, 0);

        const animations = gltf.animations;
        if(animations && animations.length)
        {
            let i;
            animationMixer = new THREE.AnimationMixer(model);
            for( i = 0; i < animations.length; i++)
            {
                animationMixer.clipAction(animations[i]).play();
            }
        }
        console.log('load');
        
        scene.add(model);
    },
    function(xhr)
    {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error)
    {
        console.log(error);
    });

    renderer.outputEncoding = THREE.sRGBEncoding;
    //renderer.gammaOutput = true;
    // renderer.gammaFactor = 2.2;

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

        requestAnimationFrame(tick);
    }
}