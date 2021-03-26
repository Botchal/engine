export interface LevelInterface {
    /**
     * This method will be called when the player enter the level
     *
     * It is recommended to initialize in this method entities such as Renderer, EffectComposer and etc, not in init()
     */
    enter():void;

    /**
     * This method will be called when the player exits the level
     *
     * It is recommended to desctruction in this method entities such as Renderer, EffectComposer and etc
     */
    exit():void;
}