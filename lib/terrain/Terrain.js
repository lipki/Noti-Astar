

function Terrain() {
    
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0x333366, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 600;
    camera.position.z = 300;
    camera.position.x = 0;

    var ambient_light = new THREE.AmbientLight(0xcccccc);
    scene.add(ambient_light);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.4;
    controls.noZoom = false;
    controls.noPan = true;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.4;
    controls.minDistance = 300;
    controls.maxDistance = 600;
    
}

Terrain.prototype.addMesh = function (WORLD) {
    
    this.size = WORLD.width;
    this.max = this.size - 1;
    this.map = new Float32Array(this.size * this.size);
    this.player_mesh;
    var self = this;

    var terrain_geometry = new THREE.PlaneGeometry(this.size, this.size, this.size - 1, this.size - 1);
    var min_height = Infinity;
    var max_height = -Infinity;
    for (var y = 0; y < this.size; y++) {
        for (var x = 0; x < this.size; x++) {
            var height_val = WORLD.get(x, y);
            if ( height_val < min_height ) min_height = height_val;
            if ( height_val > max_height ) max_height = height_val;
            if ( height_val < 0 ) height_val = 0;
            //if (y === 0 || y === this.size - 1 || x === 0 || x === this.size - 1) height_val = 0.0;
            terrain_geometry.vertices[y * this.size + x].z = height_val;
        }
    }

    terrain_geometry.computeFaceNormals();
    terrain_geometry.computeVertexNormals();

    scene.remove(terrain_mesh);

    terrain_material  = new THREE.MeshNormalMaterial();
    terrain_mesh = new THREE.Mesh(terrain_geometry, terrain_material);
    terrain_mesh.rotation.x = -Math.PI / 2.0;
    scene.add(terrain_mesh);

    var water_geometry = new THREE.BoxGeometry(this.size, this.size, 1);
    var water_material = new THREE.MeshBasicMaterial({
        color: 0x3366aa,
        transparent: true,
        opacity: 0.7
    });
    water_mesh = new THREE.Mesh(water_geometry, water_material);
    water_mesh.scale.z = water_height;
    water_mesh.position.z = water_height/2;
    terrain_mesh.add(water_mesh);

    var player_geometry = new THREE.BoxGeometry(5, 5, 5);
    var player_material = new THREE.MeshBasicMaterial({
        color: 0xFF0000
    });
    this.player_mesh = new THREE.Mesh(player_geometry, player_material);
    this.player_mesh.position.z = 128;
    terrain_mesh.add(this.player_mesh);

    var end_geometry = new THREE.BoxGeometry(5, 5, 5);
    var end_material = new THREE.MeshBasicMaterial({
        color: 0x00FF00
    });
    this.end_mesh = new THREE.Mesh(end_geometry, end_material);
    this.end_mesh.position.z = 128;
    terrain_mesh.add(this.end_mesh);
};

Terrain.prototype.player = function (pos) {
    this.player_mesh.position.x = pos[0]-this.size/2;
    this.player_mesh.position.y = this.size-pos[1]-this.size/2;
    this.player_mesh.position.z = WORLD.get(pos[0], pos[1]);
};

Terrain.prototype.end = function (pos) {
    this.end_mesh.position.x = pos[0]-this.size/2;
    this.end_mesh.position.y = this.size-pos[1]-this.size/2;
    this.end_mesh.position.z = WORLD.get(pos[0], pos[1]);
};
