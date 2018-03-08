class FlatRandomParticlePositions extends ParticlePosition {
    position(particle, i, s){
        // let uvSize = Math.random() * 0.9;
        let fact = 600
        asXYZ(particle.scale
            , Math.random() * 2 + 0.8
            , Math.random() * 6 + 0.8
            , Math.random() * 2 + 0.8
            )

        asXYZ(particle.position
            , (Math.random() - 0.5) * fact
            , particle.scale.y / 2 + 0.01
            , (Math.random() - 0.5) * fact
            )

        particle.rotation.y = Math.random() * 3.5;

        let grey = 1.0 - Math.random() * 0.5;
        particle.color = new BABYLON.Color4(grey + 0.1, grey + 0.1, grey, 1);
        //particle.uvs.x = Math.random() * 0.1;
        //particle.uvs.y = Math.random() * 0.1;
        //particle.uvs.z = particle.uvs.x + uvSize;
        //particle.uvs.w = particle.uvs.y + uvSize;
    }

    vertex(){}
}


class RandomParticlePositions extends ParticlePosition {

    options(){
        return {
            size: 100
        }
    }

    position(particle, i, s){
        // let uvSize = Math.random() * 0.9;
        let size = this.data.size;
        asXYZ(particle.position
            , (Math.random() - .5) * size
            , (Math.random() - .5) * size
            , (Math.random() - .5) * size
            )

        let grey = 1.0 - Math.random() * 0.5;
        particle.color = colors.emissive('white')
        //new BABYLON.Color4(grey + 0.1, grey + 0.1, grey, 1);
    }

    vertex(){}
}


class MatrixParticlePositions extends ParticlePosition {

    init(){
        this.xStepper = 0;
        this.yStepper = 0;
        this.zStepper = 0;

        super.init.apply(this, arguments)
    }

    options(){
        return {
            size: 100
        }
    }

    position(particle, i, s){
        // let uvSize = Math.random() * 0.9;
        let size = this.data.size;
        let width = 6;
        // zStepper = (i % 6)
        //
        // this[l] = this[l] + ( (i % width) == 0? 2: 0)
        this.xStepper = (i % width) + ((i % width) + 1);
        this.yStepper = this.yStepper + ( (i % width) == 0? 2: 0)

        if(this.yStepper > width + 2) {
            this.yStepper = 0
            this.zStepper += 2
        }

        asXYZ(particle.position
            , this.xStepper
            , this.yStepper
            , this.zStepper
            )
    }

    vertex(){}

    update(particle){
        particle.rotation.x += 0.005
        //this.position(particle, particle.idx)
    }
}


class SlowRotateParticlePositions extends ParticlePosition {

    options(){
        return {
            speed: 0.05
        }
    }

    position(particle, i, s){

        particle.rotation.y += this.data.speed;
        //sps.mesh.position.y = Math.sin( (k - Date.now())/10000 )
        //k += 0.0002
    }
}

class SlowRotateMeshPositions extends ParticlePosition {

    options(){
        return {
            speed: 0.0005
        }
    }

    step(sps){
        sps.mesh.rotation.y += this.data.speed;
        sps.mesh.position.y = Math.sin( (k - Date.now())/10000 )
        k += 0.0002
    }
}


class SprayParticlePositions extends ParticlePosition {

    options(){
        return {
            gravity: 30
            , velocity: 2
            , rotation: [.1, .05, .008]
            , factor: 1
        };
    }

    create(sps) {
        // : lets you set all the initial particle properties. You must iterate
        // over all the particles by using the SPS.nbParticles property. The
        // usage of this function is not mandatory.
        let particles = sps.particles, pt
        for (var p = 0; p < sps.nbParticles; p++) {
            pt = particles[p]
            // pt.age = Math.random() * 20;
            this.recycle(pt)
        }
    }

    position(particle, spsIndex, s) {
        /* Calls on update of every particle the initParticles */
        particle.rotation.y = s / 300;
        particle.position.x = s - 300;
        //particle.uvs = new BABYLON.Vector4(0, 0, 0.33, 0.33); // first image from an atlas
        //particle.scaling.y -= .01
    }


    recycle(particle){
        // : lets you set a particle to be recycled. It is called per particle.
        //  The usage of this function is not mandatory.
        let vel = this.data.velocity * .5
        particle.position.x = 0;
        particle.position.y = 0;
        particle.position.z = 0;
        particle.velocity.x = (Math.random() - .5) * vel;
        particle.velocity.y = Math.random() * vel;
        particle.velocity.z = (Math.random() - .5) * vel;
    }

    setParticles(sps){
        sps.setParticles()
    }

    update(particle) {
        if (particle.position.y < 0) {
            this.recycle(particle);
        }

        let vel = this.data.velocity * .5
        let f = this.data.factor
        let r = this.data.rotation

        particle.velocity.y += (-0.001 * this.data.gravity);
        (particle.position).addInPlace(particle.velocity.multiply({x:f, y:f, z:f}));      // update particle new position
        particle.position.y += vel / 2;
        var sign = (particle.idx % 2 == 0) ? 1 : -1;            // rotation sign and new value
        particle.rotation.z += r[0] * sign;
        particle.rotation.x += r[1] * sign;
        particle.rotation.y += r[2] * sign;
    }
}

