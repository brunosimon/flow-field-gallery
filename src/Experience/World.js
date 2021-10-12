import * as THREE from 'three'
import Experience from './Experience.js'
import Picture from './Picture/Picture.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setPicture()
            }
        })
    }

    setPicture()
    {
        this.picture = new Picture()
    }

    resize()
    {
    }

    update()
    {
        if(this.picture)
            this.picture.update()
    }

    destroy()
    {
    }
}