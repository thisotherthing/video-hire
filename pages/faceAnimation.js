import { Clock, Scene, PerspectiveCamera, Mesh, MeshBasicMaterial, BoxBufferGeometry, WebGLRenderer, Camera } from 'three';
import React from 'react';

export default class faceAnimation extends React.Component {
    componentDidMount() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth/window.innerHeight,
            0.1,
            1000,
        );
        this.camera.position.z = 5;

        this.renderer = new WebGLRenderer({
            canvas: this.canvasRef,
        });
        this.renderer.setClearColor(0xff0000, 1.0);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        var geometry = new BoxBufferGeometry( 1, 1, 1 );
		var material = new MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
        this.cube = new Mesh( geometry, material );
        this.scene.add( this.cube );

        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render( this.scene, this.camera );
    };

    render() {
        return (
            <div style={{
                background: "red",
            }}>

            <canvas
                ref={(ref) => (this.canvasRef = ref)}
            />
            </div>

        )
    }
}