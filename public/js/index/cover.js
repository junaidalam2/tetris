import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'; //0.126.1
//import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'; //'three/addons/controls/OrbitControls.js';
//import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js'; //'three/addons/loaders/GLTFLoader.js';


import {

    cubeDimension,
    textureResourcePath,
    numberOfBoxes,
    cameraFieldOfView,
    cameraAspectRatio,
    cameraBorderFront,
    cameraBorderRear,
    cameraPositionXAxis,
    cameraPositionYAxis,
    cameraPositionZAxis,
    velocityXAxis,
    velocityYAxis,
    velocityZAxis,
    cubeRotationXAxis,
    cubeRotationYAxis,
    cubeRotationZAxis,
    halfLineLength,
    cubePositionAvgDispersion,
    button,
    tetrisPath,

} from './coverConstants.js';


class Environment {
    constructor(BoxDimension) {
        this.dimension = BoxDimension;
        this.setCanvas();
        this.setScene();
        this.setCamera();
        this.setFrustum();
        this.setRenderer();
        this.createBoxTemplate();
        this.boxArray = [];
        this.boundingBoxArray = [];
        this.animate();
        this.activateLister();
    }
    
    setCanvas() {
       this.canvas = document.querySelector('.webgl');
    }
    
    setScene() {
        this.scene = new THREE.Scene();
    }

    setCamera() {
        this.camera = new THREE.PerspectiveCamera( cameraFieldOfView, cameraAspectRatio, cameraBorderFront, cameraBorderRear );
        this.camera.position.set( cameraPositionXAxis, cameraPositionYAxis, cameraPositionZAxis );
        this.camera.updateMatrix();
        this.camera.updateMatrixWorld();
    }

    setFrustum() {
        this.frustum = new THREE.Frustum();
        this.frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices( this.camera.projectionMatrix,  this.camera.matrixWorldInverse)); 
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: this.canvas });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    }

    createBoxTemplate() {
        this.geometry = new THREE.BoxGeometry( this.dimension, this.dimension, this.dimension );
        this.texture = new THREE.TextureLoader().load(textureResourcePath);
        this.material = new THREE.MeshBasicMaterial( { map: this.texture } );
        this.box = new THREE.Mesh( this.geometry, this.material );
        this.box.position.set( this.positionX, this.positionY, this.positionZ );
    }

    detectAllBoundaryCollisions() {
        this.boxArray.forEach(element => {
            element.detectBoundaryCollisions();
        });
    }

    updateBoundingBoxPosition() {
        this.boundingBoxArray.forEach((element, index) => {
            element.copy( this.boxArray[index].box.geometry.boundingBox ).applyMatrix4( this.boxArray[index].box.matrixWorld );
        });
    }
    
    detectAllBoxCollisions() {
        for(let i = 0; i < this.boxArray.length - 1; i++){
            for(let j = i + 1; j < this.boxArray.length; j++) {
                this.boxArray[i].collisionDetection(this.boxArray[j], this.boundingBoxArray[j], this.boundingBoxArray[i]);
            } 
        }
    }

    updateBoxPositions() {
        this.boxArray.forEach(element => {
            element.box.position.x += element.velocityX * element.directionX;
            element.box.position.y += element.velocityY * element.directionY;
            element.box.position.z += element.velocityZ * element.directionZ;

            element.box.rotation.x += element.rotationX * element.directionX;
            element.box.rotation.y += element.rotationY * element.directionY;
            element.box.rotation.z += element.rotationZ * element.directionZ;
        });
    }

    animate() {
        window.requestAnimationFrame( ()=> this.animate());
        this.detectAllBoundaryCollisions();
        this.updateBoundingBoxPosition();
        this.detectAllBoxCollisions();
        this.updateBoxPositions();    
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );        
        this.setFrustum();
    }
    
    activateLister() {
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }
}


class Box {
    constructor(positionX, positionY, positionZ, directionX, directionY, directionZ) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.positionZ = positionZ;
        this.createBox();
        this.velocityX = velocityXAxis;
        this.velocityY = velocityYAxis;
        this.velocityZ = velocityZAxis;
        this.directionX = directionX;
        this.directionY = directionY;
        this.directionZ = directionZ;
        this.rotationX = cubeRotationXAxis;
        this.rotationY = cubeRotationYAxis;
        this.rotationZ = cubeRotationZAxis;
    }

    createBox() {
        this.box = environment.box.clone();
        this.box.position.set(this.positionX, this.positionY, this.positionZ);
        environment.scene.add( this.box );
    }

    detectBoundaryX() {

        let offset = -environment.dimension;
        if(this.directionX > 0 ) {
            offset = environment.dimension;
        }
        
        let vectorPositionX1 = new THREE.Vector3(this.box.position.x + offset, this.box.position.y - halfLineLength, this.box.position.z);
        let vectorPositionX2 = new THREE.Vector3(this.box.position.x + offset, this.box.position.y + halfLineLength, this.box.position.z);
        let line = new THREE.Box3(vectorPositionX1, vectorPositionX2);
        if(!environment.frustum.intersectsBox(line)) {
            this.directionX *= -1;
        }
    }

    detectBoundaryY() {

        let offset = -environment.dimension;
        if(this.directionY > 0 ) {
            offset = environment.dimension;
        }
        
        let vectorPositionY1 = new THREE.Vector3(this.box.position.x - halfLineLength, this.box.position.y + offset, this.box.position.z);
        let vectorPositionY2 = new THREE.Vector3(this.box.position.x + halfLineLength, this.box.position.y + offset, this.box.position.z);
        let line = new THREE.Box3(vectorPositionY1, vectorPositionY2);
    
        if(!environment.frustum.intersectsBox(line)) {
            this.directionY *= -1;
        }
    }

    detectBoundaryZ() {

        let vectorPositionZ1 = new THREE.Vector3(this.box.position.x + halfLineLength, this.box.position.y, this.box.position.z);
        let vectorPositionZ2 = new THREE.Vector3(this.box.position.x - halfLineLength, this.box.position.y, this.box.position.z);
        let line = new THREE.Box3(vectorPositionZ1, vectorPositionZ2);
    
        if(!environment.frustum.intersectsBox(line)) {
            this.directionZ *= -1;
        }
    }

    detectBoundaryCollisions() {

        this.detectBoundaryX();
        this.detectBoundaryY();
        this.detectBoundaryZ();
    }

    createBoundingBox() {

        this.cubeBoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.cubeBoundingBox.setFromObject(this.box);
        environment.boundingBoxArray.push(this.cubeBoundingBox);
    }

    collisionDetection(cube2, cube2BoundingBox, cube1BoundingBox) {

        if(cube1BoundingBox.intersectsBox(cube2BoundingBox)) {
    
            if((this.directionX > cube2.directionX && this.box.position.x < cube2.box.position.x)
                || (this.directionX < cube2.directionX && this.box.position.x > cube2.box.position.x)) {
                this.directionX *= -1;
                cube2.directionX *= -1;
            } 
            
            if((this.directionY > cube2.directionY && this.box.position.y < cube2.box.position.y) 
                || (this.directionY < cube2.directionY && this.box.position.y > cube2.box.position.y)) {
                this.directionY *= -1;
                cube2.directionY *= -1;
            }
                
            if((this.directionZ > cube2.directionZ && this.box.position.z < cube2.box.position.z) 
                || (this.directionZ < cube2.directionZ && this.box.position.z > cube2.box.position.z)) {
                this.directionZ *= -1;
                cube2.directionZ *= -1;
            } 
        }
    }
}

const environment = new Environment(cubeDimension);

function createCubeInstances(numberOfBoxes) {

    let counter = numberOfBoxes;
    while(counter > 0) {

        let directionX = Math.random() > 0.5? 1:-1;
        let directionY = Math.random() > 0.5? 1:-1;
        let directionZ = Math.random() > 0.5? 1:-1;
        let positionX = Math.random() * cubePositionAvgDispersion * directionX;
        let positionY = Math.random() * cubePositionAvgDispersion * directionY;
        let positionZ = Math.random() * cubePositionAvgDispersion * directionZ;

        let cube = new Box(positionX, positionY, positionZ, directionX, directionY, directionZ);
        environment.boxArray.push(cube);
        environment.boxArray[environment.boxArray.length - 1].createBoundingBox();

        counter--;
    }
}

createCubeInstances(numberOfBoxes);

window.addEventListener('click', () => {
    document.location.href = tetrisPath;
});

window.addEventListener('keydown', () => {
    document.location.href = tetrisPath;
});

button.addEventListener('click', () => {
    document.location.href = tetrisPath;
});
