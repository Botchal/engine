// import Post from './Post' // заимпортить класс
import './components/testBabel.ts'
import {BaseLevel} from "./components/game/base/BaseLevel";
import {ForestGround} from "./components/game/grounds/ForestGround";
import {CharacterObject} from "./components/game/character/CharacterObject";
import {AnimationConfig} from "./components/game/character/AnimationConfig";
import {CharacterControls} from "./components/game/character/CharacterControls";
import {CharacterCamera} from "./components/game/character/CharacterCamera";
import {EnvironmentService} from "./components/game/services/EnvironmentService";

console.log("Hello! Time: " + new Date());

let envService = EnvironmentService.Instance;
envService.setEnv(envService.ENV_DEV);

new BaseLevel(document.querySelector("#canvasContainer"), function(level: BaseLevel){
    new ForestGround(level.scene, (ground: ForestGround) => {
        let character = new CharacterObject(
            level.scene,
            level.clock,
            "/models/girl_mmd/miku/miku_v2.pmd",
            new AnimationConfig(),
            (object:CharacterObject) => {
                let charCamera = new CharacterCamera(object.bodyMesh, level.camera, level.directionalLight, level.renderer)
                level.updatebleObjects.push(object.animationHelper);

                ground.sectors[28].getWorldPosition(character.bodyMesh.position);
                ground.setFocusPosition(character.bodyMesh.position)

                let charControls = new CharacterControls(object, ground.getBesideSectors.bind(ground), level.scene, charCamera, (controls) => {
                    ground.setFocusPosition(character.bodyMesh.position)
                });
                level.updatebleObjects.push(charControls);
                charControls.updateGroundPosition();
            }
        );
        level.updatebleObjects.push(character);
        level.updatebleObjects.push(ground);
    });

});
