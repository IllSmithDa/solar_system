/* eslint-disable @typescript-eslint/no-unused-vars */
import * as THREE from "three"
import pxPath from '../assets/stars/galaxy/milky_way/cube_map/px.png';
import nxPath from '../assets/stars/galaxy/milky_way/cube_map/nx.png';
import pyPath from '../assets/stars/galaxy/milky_way/cube_map/py.png';

import nyPath from '../assets/stars/galaxy/milky_way/cube_map/ny.png';
import pzPath from '../assets/stars/galaxy/milky_way/cube_map/pz.png';
import nzPath from '../assets/stars/galaxy/milky_way/cube_map/nz.png';
export default function generateCubeMap(
  scene: THREE.Scene,
  path: string,
) {
  scene.background = new THREE.CubeTextureLoader()
	.load( [
				pxPath,
				nxPath,
				pyPath,
				nyPath,
				pzPath,
				nzPath
			] );
}