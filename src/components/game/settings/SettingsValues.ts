export class SettingsValues {

    /**
     * Качество текстур - ниже низкого, просто цвет а не текстура
     * для балалаек вроде Redmi GO
     */
    readonly TEXTURE_QUALITY_DUMMY = 1;
    /**
     * Качество текстур - низкое
     */
    readonly TEXTURE_QUALITY_LOW = 2;
    /**
     * Качество текстур - среднее
     */
    readonly TEXTURE_QUALITY_MEDIUM = 3;
    /**
     * Качество текстур - высокое
     */
    readonly TEXTURE_QUALITY_HIGH = 4;
    /**
     * Качество текстур - ульра высокое
     */
    readonly TEXTURE_QUALITY_ULTRA = 5;

    /**
     * Качество теней - низкое
     */
    readonly SHADOW_QUALITY_LOW = 1;
    /**
     * Качество теней - среднее
     */
    readonly SHADOW_QUALITY_MEDIUM = 2;
    /**
     * Качество теней - высокое
     */
    readonly SHADOW_QUALITY_HIGH = 3;
    /**
     * Качество теней - ультра
     */
    readonly SHADOW_QUALITY_ULTRA = 4;

    /**
     * Использовать карту нормалей
     */
    readonly USE_NORMAL_MAP = 1;

    /**
     * Использовать карту рельефа
     */
    readonly USE_BUMP_MAP = 1;

    /**
     * Использовать карту отражений
     */
    readonly USE_SPECULAR_MAP = 1;

    /**
     * использовать карту широховатостей
     */
    readonly USE_ROUGHNESS_MAP = 1;

    /**
     * Использовать карту смещений
     */
    readonly USE_DISPLACEMENT_MAP = 1;

    /**
     * Использовать систему частиц
     */
    readonly USE_POINTS_SYSTEM = 1;

    /**
     * Динамический мир
     */
    readonly IS_DYNAMIC_WORLD = 1;

    /**
     * Использовать шейдер воды для водной поверхности
     */
    readonly IS_SHADER_WATER = 1;

    /**
     *
     */
    readonly POST_PROCESSING_FXAA = 1;
    readonly POST_PROCESSING_BLEACH = 1;
    readonly POST_PROCESSING_COLOR_CORRECTION = 1;
    readonly POST_PROCESSING_GAMMA_CORRECTION = 1;

}