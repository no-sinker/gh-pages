// based on http://irukanobox.blogspot.jp/2016/08/threejs_13.html, http://matorel.com/archives/723
$(function() {
    // キューブマップ用のテクスチャ作成
    var cubeTexture = new THREE.CubeTextureLoader()
	.setPath( './image/clouds1/' )
	.load( [ 'clouds1_south.png',
		 'clouds1_west.png',
		 'clouds1_up.png',
		 'clouds1_down.png',
		 'clouds1_north.png',
		 'clouds1_east.png' ] );
    cubeTexture.format = THREE.RGBFormat;

    // シーンの作成
    var scene = new THREE.Scene();
    // シーンの背景テクスチャを設定
    scene.background = cubeTexture;
    // カメラの作成
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 500;
    // レンダラーの作成（アンチエイリアス有効）
    var renderer = new THREE.WebGLRenderer( {antialias: true} );
    canvas = document.getElementById('mirrorball');
    // レンダラーが描画するキャンバスサイズの設定
    // renderer.setSize( canvas.clientWidth, canvas.clientHeight);
    var ratio = canvas.clientWidth / window.innerWidth / 1.7;
    renderer.setSize( window.innerWidth * ratio, window.innerHeight * ratio);

    // キャンバスをDOMツリーに追加
    canvas.appendChild( renderer.domElement );

    // 環境光の作成
    var light = new THREE.AmbientLight( 0xffffff );

    // 環境光をシーンへ追加
    scene.add( light );

    // 球体ジオメトリの作成
    var geometry = new THREE.SphereGeometry( 200, 64, 32 );

    // マテリアルの作成
    // 環境マップ（envmap）に作成したテクスチャ(cubeTexture)を設定
    // 鏡のパネルが並んでいるようにTHREE.FlatShadingを使う
    var material1 = new THREE.MeshStandardMaterial( { color: 0xffffff, envMap: cubeTexture, shading: THREE.FlatShading, roughness: 0.1, metalness: 0.9} );

    // オブジェクトの作成
    var mball1 = new THREE.Mesh( geometry, material1 );
    // mball1.position.x = -250;

    // オブジェクトをシーンへ追加
    scene.add( mball1 );

    // OrbitControlsインスタンス作成
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    // controls.autoRotate = true;
    controls.enableZoom = false;

    function render() {
        requestAnimationFrame( render );

        // レンダリング
        renderer.render(scene,camera);

        controls.update();
    }
    render();
});
