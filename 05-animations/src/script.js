import * as THREE from 'three'
import gsap from 'gsap'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Clock
// const clock = new THREE.Clock()

gsap.to(mesh.position, { duration: 3, delay: 0, x: 2 })
gsap.to(mesh.position, { duration: 3, delay: 3, x: 0 })

// Animations
const tick = () =>
{
    // //Clock
    // const elapsedTime = clock.getElapsedTime()
   

    // // Update objects

    // camera.position.y = Math.sin(elapsedTime) * 2
    // camera.position.x = Math.cos(elapsedTime)
    // camera.lookAt(mesh.position )





    // Render frame
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

