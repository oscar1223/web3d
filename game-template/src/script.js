import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
//const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Mixers para animaciones (puedes tener más de uno)
let mixerFBX, mixerGLTF

/**
 * Cargar modelo FBX
 */
 const fbxLoader = new FBXLoader()
 fbxLoader.load(
     'models/sdukdrunk.fbx', // Ruta a tu modelo FBX
     (fbx) => {
         fbx.scale.setScalar(0.025)

         fbx.traverse((child) => {
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide
                child.geometry?.computeVertexNormals()
            }
         })
         
         scene.add(fbx)
         // Configurar el AnimationMixer para el FBX
         mixerFBX = new THREE.AnimationMixer(fbx)
         if (fbx.animations.length > 0) {
             const action = mixerFBX.clipAction(fbx.animations[0])
             action.play()
         }
     },
     undefined,
     (error) => {
         console.error('Error al cargar el modelo FBX:', error)
     }
 )


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
floor.rotation.x = - Math.PI * 0.5
floor.rotation.y = -0.65
//scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(30, 20, -20)
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0x00ff00, 0xaa000ff, 1)
scene.add(hemisphereLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Actualizar tamaños
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Actualizar cámara
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Actualizar renderizador
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(8, 18, 15)
scene.add(camera)

// Controles
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const delta = clock.getDelta()

    // Actualizar mixers de animación si están definidos
    if (mixerFBX) mixerFBX.update(delta)
    if (mixerGLTF) mixerGLTF.update(delta)

    // Actualizar controles
    controls.update()

    // Renderizar escena
    renderer.render(scene, camera)

    // Llamar tick en el siguiente frame
    window.requestAnimationFrame(tick)
}

tick()
