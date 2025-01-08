import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'


// GUI
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene

const scene = new THREE.Scene()

// Textures

const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

//doorColorTexture.colorSpace = THREE.SRGBEncoding
//matcapTexture.colorSpace = THREE.sRGBEncoding


// Objects
//const material = new THREE.MeshBasicMaterial()
//material.map = doorColorTexture
//material.color = new THREE.Color(0x00ff00)
//material.wireframe = false
//material.opacity = 0.2
//material.transparent = true
//material.alphaMap = doorAlphaTexture
//material.side = THREE.DoubleSide

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 1
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)

const material = new THREE.MeshPhysicalMaterial()
material.metalness = 1
material.roughness = 1
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap = doorHeightTexture
material.displacementScale = 0.1
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.5)

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

// Clearcoat
// material.clearcoat = 1
// material.clearcoatMap = doorColorTexture

// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)

// Sheen
// material.sheen = 1
// material.sheenRoughness = 0.25
// material.sheenColor.set(1, 1, 1)

// gui.add(material, 'sheen').min(0).max(1).step(0.0001)
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.0001)  
// gui.addColor(material, 'sheenColor')

// Iridescence
// material.iridescence = 1
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [ 100, 800 ]

// gui.add(material, 'iridescence').min(0).max(1).step(0.0001)
// gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001)
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1)

// Transmission
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

gui.add(material, 'transmission').min(0).max(1).step(0.0001)
gui.add(material, 'ior').min(1).max(2).step(0.0001)
gui.add(material, 'thickness').min(0).max(1).step(0.0001)


//material.matcap = matcapTexture

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
)

torus.position.x = 1.5
sphere.position.x = 0
plane.position.x = -1.5

scene.add(sphere, plane, torus)

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 30)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// Eviroment map

const rgbeloader = new RGBELoader()
rgbeloader.load('/textures/environmentMap/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap

})

/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
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
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = elapsedTime * 0.1
    plane.rotation.y = elapsedTime * 0.1    
    torus.rotation.y = elapsedTime * 0.1

    sphere.rotation.x = elapsedTime * 0.15
    plane.rotation.x = elapsedTime * 0.15
    torus.rotation.x = elapsedTime * 0.15

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()