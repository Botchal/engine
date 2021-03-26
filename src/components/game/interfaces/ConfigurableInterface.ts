export interface Config {
    [key: string]: any;
}

export interface ConfigurableInterface {
    /**
     * Configurable is the interface that should be implemented by classes who support configuring
     * its properties through the parameter to its constructor.
     *
     * @param config
     */
    constructor(config:Config);
}