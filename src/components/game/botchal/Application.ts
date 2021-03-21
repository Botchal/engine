import {BaseLevelInterface} from "../base/BaseLevel";
import {CharacterCameraInterface} from "../character/CharacterCamera";
import {CharacterObjectInterface} from "../character/CharacterObject";
import {CharacterControlsInterface} from "../character/CharacterControls";

export class Application {
    levels:Array<BaseLevelInterface>;
    charObj:CharacterCameraInterface;
    charCam:CharacterObjectInterface;
    charCon:CharacterControlsInterface;
}