import * as THREE from 'three'

import Experience from '../Experience.js'
import FlowField from './FlowField.js'
import vertexShader from '../shaders/particles/vertex.glsl'
import fragmentShader from '../shaders/particles/fragment.glsl'

export default class Picture
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.width = 640
        this.height = 427
        this.ratio = this.width / this.height
        this.count = this.width * this.height

        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'particles'
            })
        }

        this.setPositions()
        this.setFlowfield()
        this.setGeometry()
        this.setMaterial()
        this.setPoints()
    }

    reset()
    {
        this.flowField.dispose()
        this.geometry.dispose()
        
        this.setPositions()
        this.setFlowfield()
        this.setGeometry()

        this.points.geometry = this.geometry
    }

    setPositions()
    {
        this.positions = new Float32Array(this.count * 3)

        for(let j = 0; j < this.height; j++)
        {
            for(let i = 0; i < this.width; i++)
            {
                this.positions[(j * this.width + i) * 3 + 0] = (i / this.width - 0.5) * this.ratio
                this.positions[(j * this.width + i) * 3 + 1] = j / this.height - 0.5
                this.positions[(j * this.width + i) * 3 + 2] = 0
            }
        }
    }

    setFlowfield()
    {
        this.flowField = new FlowField({ positions: this.positions, debugFolder: this.debugFolder })
    }

    setGeometry()
    {
        const size = new Float32Array(this.count)
        const uv = new Float32Array(this.count * 2)

        for(let i = 0; i < this.count; i++)
        {
            size[i] = 0.2 + Math.random() * 0.8
        }
        
        for(let j = 0; j < this.height; j++)
        {
            for(let i = 0; i < this.width; i++)
            {
                uv[(j * this.width * 2) + (i * 2) + 0] = i / this.width
                uv[(j * this.width * 2) + (i * 2) + 1] = j / this.height
            }
        }

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        this.geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
        this.geometry.setAttribute('aFboUv', this.flowField.fboUv.attribute)
        this.geometry.setAttribute('aUv', new THREE.BufferAttribute(uv, 2))
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            uniforms:
            {
                uSize: { value: 50 * this.config.pixelRatio },
                uTexture: { value: this.resources.items.imageTexture },
                uFBOTexture: { value: this.flowField.texture }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })
        
        
        if(this.debug)
        {
            this.debugFolder
                .addInput(
                    this.material.uniforms.uSize,
                    'value',
                    { label: 'uSize', min: 1, max: 100, step: 1 }
                )
        }
    }

    setPoints()
    {
        this.points = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.points)
    }

    update()
    {
        this.flowField.update()
        this.material.uniforms.uFBOTexture.value = this.flowField.texture
    }
}