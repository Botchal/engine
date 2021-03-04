import {Texture} from "../../../three/src/textures/Texture";
import {ShaderMaterial} from "../../../three/src/materials/ShaderMaterial";
import {UniformsUtils} from "../../../three/src/renderers/shaders/UniformsUtils";
import {ShaderLib} from "../../../three/src/renderers/shaders/ShaderLib";
import {RepeatWrapping} from "../../../three/src/constants";

export interface SplatBlendMaterialParams {

    r_map: Texture,
    r_normal_map: Texture,
    r_bamp_map: Texture,

    g_map: Texture,
    g_normal_map: Texture,
    g_bamp_map: Texture,

    b_map: Texture,
    b_normal_map: Texture,
    b_bamp_map: Texture,

    a_map: Texture,
    a_normal_map: Texture,
    a_bamp_map: Texture,

    mask_map: Texture,
    mask_normal_map?: Texture,

    /**
     * Наименование материала, который будет использован при замене
     */
    material_name: string,

    /**
     * Влияние тумана
     */
    fog: boolean,

    /**
     * Использовать ли карту рельефа
     * 0 - нет
     * 1 - свою
     * 4 - все 4
     */
    bump: number,

    /**
     * Использовать ли карту нормалей
     * 0 - нет
     * 1 - свою
     * 4 - все 4
     */
    normal: number,
}

/**
 * Материал для мультитекстурирования
 *
 * работает на базе 12 текстур (maps + normal maps + bamp maps) и текстуру маски RGBA
 * каждый цвет в текстуре маски будет заменён на материал
 */
export class SplatBlendMaterial {
    params: SplatBlendMaterialParams

    /**
     *
     * @param params Объект параметров
     */
    constructor(params: SplatBlendMaterialParams) {
        this.params = params;
    }

    /**
     * @return ShaderMaterial
     */
    getMaterial() {

        this.params.r_map.wrapS = this.params.r_map.wrapT = RepeatWrapping;
        this.params.r_normal_map.wrapS = this.params.r_normal_map.wrapT = RepeatWrapping;
        //this.params.r_bamp_map.wrapS = this.params.r_bamp_map.wrapT = RepeatWrapping;

        this.params.g_map.wrapS = this.params.g_map.wrapT = RepeatWrapping;
        this.params.g_normal_map.wrapS = this.params.g_normal_map.wrapT = RepeatWrapping;
        //this.params.g_bamp_map.wrapS = this.params.g_bamp_map.wrapT = RepeatWrapping;

        this.params.b_map.wrapS = this.params.b_map.wrapT = RepeatWrapping;
        this.params.b_normal_map.wrapS = this.params.b_normal_map.wrapT = RepeatWrapping;
        //this.params.b_bamp_map.wrapS = this.params.b_bamp_map.wrapT = RepeatWrapping;

        this.params.a_map.wrapS = this.params.r_map.wrapT = RepeatWrapping;
        this.params.a_normal_map.wrapS = this.params.a_normal_map.wrapT = RepeatWrapping;
        //this.params.a_bamp_map.wrapS = this.params.a_bamp_map.wrapT = RepeatWrapping;

        this.params.mask_map.wrapS = this.params.mask_map.wrapT = RepeatWrapping;
        //this.params.mask_normal_map.wrapS = this.params.mask_normal_map.wrapT = RepeatWrapping;

        let splat_name = {
            mat: "standard",
            lib: ShaderLib.standard.uniforms,
            vs: ShaderLib.standard.vertexShader,
            fs: ShaderLib.standard.fragmentShader,
            fog: this.params.fog, // ВЛИЯНИЕ ТУМАНА true ВКЛЮЧИТЬ ИЛИ false ВЫКЛЮЧИТЬ
            bump: this.params.bump, // ИСПОЛЬЗОВАТЬ ЛИ КАРТУ РЕЛЬЕФА bumpMap. 0 - НЕТ. 1 - ДА, ОДНА ТЕКСТУРА. 4 - ДА, 4 ТЕКСТУРЫ
            normal: this.params.normal, // ИСПОЛЬЗОВАТЬ ЛИ КАРТУ НОРМАЛИ normalMap. 0 - НЕТ. 1 - ДА, ОДНА ТЕКСТУРА. 4 - ДА, 4 ТЕКСТУРЫ
            u: {} // ПАРАМЕТРЫ UNIFORMS. ЗАПОЛНЯТЬ НЕ НАДО
        };



        var splat_r_tex=[
            "uniform sampler2D mask_tex,alpha_tex,red_tex,green_tex,blue_tex;",
            "uniform vec2 red_offset,alpha_repeat,red_repeat,green_repeat,blue_repeat;",
        ].join("\n");


        var splat_r_diffuse=[
            "vec4 mask_map=texture2D(mask_tex,vUv);",
            "vec4 valpha_tex=texture2D(alpha_tex,vUv*alpha_repeat);",
            "vec4 vred_tex=texture2D(red_tex,(vUv*red_repeat+red_offset));",
            "vec4 vgreen_tex=texture2D(green_tex,vUv*green_repeat);",
            "vec4 vblue_tex=texture2D(blue_tex,vUv*blue_repeat);",
            "vec4 texelColor=(vred_tex*mask_map.r*mask_map.a+vgreen_tex*mask_map.g*mask_map.a+vblue_tex*mask_map.b*mask_map.a+(valpha_tex*(1.0-mask_map.a)));",
            "vec4 diffuseColor=LinearToLinear(texelColor);",
        ].join("\n");


        var splat_r_bump_1=[
            "uniform vec2 b_one_repeat;",
            "uniform sampler2D bumpMap;",
            "uniform float bumpScale;",
            "vec2 dHdxy_fwd(){",
            "vec2 vUv_b=vUv*b_one_repeat;",
            "vec2 dSTdx=dFdx(vUv_b);",
            "vec2 dSTdy=dFdy(vUv_b);",
            "float Hll=bumpScale*texture2D(bumpMap,vUv_b).x;",
            "float dBx=bumpScale*texture2D(bumpMap,vUv_b+dSTdx).x-Hll;",
            "float dBy=bumpScale*texture2D(bumpMap,vUv_b+dSTdy).x-Hll;",
            "return vec2(dBx,dBy);",
            "}",
            "vec3 perturbNormalArb(vec3 surf_pos,vec3 surf_norm,vec2 dHdxy){",
            "vec3 vSigmaX=vec3(dFdx(surf_pos.x),dFdx(surf_pos.y),dFdx(surf_pos.z));",
            "vec3 vSigmaY=vec3(dFdy(surf_pos.x),dFdy(surf_pos.y),dFdy(surf_pos.z));",
            "vec3 vN=surf_norm;",
            "vec3 R1=cross(vSigmaY,vN);",
            "vec3 R2=cross(vN,vSigmaX);",
            "float fDet=dot(vSigmaX,R1);",
            "vec3 vGrad=sign(fDet)*(dHdxy.x*R1+dHdxy.y*R2);",
            "return normalize(abs(fDet)*surf_norm-vGrad);",
            "}",
        ].join("\n");


        var splat_r_bump_4=[
            "uniform vec2 b_alpha_repeat,b_red_repeat,b_green_repeat,b_blue_repeat;",
            "uniform sampler2D b_alpha_tex,b_red_tex,b_green_tex,b_blue_tex;",

            "uniform float bumpScale;",
            "vec2 dHdxy_fwd(){",
            "vec2 dSTdx=dFdx(vUv);",
            "vec2 dSTdy=dFdy(vUv);",

            "vec4 mask_map=texture2D(mask_tex,vUv);",

            "vec4 vb_alpha_tex=texture2D(b_alpha_tex,vUv*b_alpha_repeat);",
            "vec4 vb_red_tex=texture2D(b_red_tex,(vUv*b_red_repeat+red_offset));",
            "vec4 vb_green_tex=texture2D(b_green_tex,vUv*b_green_repeat);",
            "vec4 vb_blue_tex=texture2D(b_blue_tex,vUv*b_blue_repeat);",
            "vec4 full_bump_1=(vb_red_tex*mask_map.r*mask_map.a+vb_green_tex*mask_map.g*mask_map.a+vb_blue_tex*mask_map.b*mask_map.a+(vb_alpha_tex*(1.0-mask_map.a)));",

            "vb_alpha_tex=texture2D(b_alpha_tex,vUv*b_alpha_repeat+dSTdx);",
            "vb_red_tex=texture2D(b_red_tex,(vUv*b_red_repeat+red_offset+dSTdx));",
            "vb_green_tex=texture2D(b_green_tex,vUv*b_green_repeat+dSTdx);",
            "vb_blue_tex=texture2D(b_blue_tex,vUv*b_blue_repeat+dSTdx);",
            "vec4 full_bump_2=(vb_red_tex*mask_map.r*mask_map.a+vb_green_tex*mask_map.g*mask_map.a+vb_blue_tex*mask_map.b*mask_map.a+(vb_alpha_tex*(1.0-mask_map.a)));",

            "vb_alpha_tex=texture2D(b_alpha_tex,vUv*b_alpha_repeat+dSTdy);",
            "vb_red_tex=texture2D(b_red_tex,(vUv*b_red_repeat+red_offset+dSTdy));",
            "vb_green_tex=texture2D(b_green_tex,vUv*b_green_repeat+dSTdy);",
            "vb_blue_tex=texture2D(b_blue_tex,vUv*b_blue_repeat+dSTdy);",
            "vec4 full_bump_3=(vb_red_tex*mask_map.r*mask_map.a+vb_green_tex*mask_map.g*mask_map.a+vb_blue_tex*mask_map.b*mask_map.a+(vb_alpha_tex*(1.0-mask_map.a)));",

            "float Hll=bumpScale*full_bump_1.x;",
            "float dBx=bumpScale*full_bump_2.x-Hll;",
            "float dBy=bumpScale*full_bump_3.x-Hll;",

            "return vec2(dBx,dBy);",
            "}",
            "vec3 perturbNormalArb(vec3 surf_pos,vec3 surf_norm,vec2 dHdxy){",
            "vec3 vSigmaX=vec3(dFdx(surf_pos.x),dFdx(surf_pos.y),dFdx(surf_pos.z));",
            "vec3 vSigmaY=vec3(dFdy(surf_pos.x),dFdy(surf_pos.y),dFdy(surf_pos.z));",
            "vec3 vN=surf_norm;",
            "vec3 R1=cross(vSigmaY,vN);",
            "vec3 R2=cross(vN,vSigmaX);",
            "float fDet=dot(vSigmaX,R1);",
            "vec3 vGrad=sign(fDet)*(dHdxy.x*R1+dHdxy.y*R2);",
            "return normalize(abs(fDet)*surf_norm-vGrad);",
            "}",
        ].join("\n");


        var splat_r_normal_1=[
            "uniform vec2 n_one_repeat;",
            "uniform sampler2D normalMap;",
            "uniform vec2 normalScale;",
            "vec3 perturbNormal2Arb(vec3 eye_pos,vec3 surf_norm){",
            "vec3 q0=vec3(dFdx(eye_pos.x),dFdx(eye_pos.y),dFdx(eye_pos.z));",
            "vec3 q1=vec3(dFdy(eye_pos.x),dFdy(eye_pos.y),dFdy(eye_pos.z));",
            "vec2 st0=dFdx(vUv.st);",
            "vec2 st1=dFdy(vUv.st);",
            "vec3 S=normalize(q0*st1.t-q1*st0.t);",
            "vec3 T=normalize(-q0*st1.s+q1*st0.s);",
            "vec3 N=normalize(surf_norm);",
            "vec3 mapN=texture2D(normalMap,vUv*n_one_repeat).xyz*2.0-1.0;",
            "mapN.xy=normalScale*mapN.xy;",
            "mat3 tsn=mat3(S,T,N);",
            "return normalize(tsn*mapN);",
            "}",
        ].join("\n");


        var splat_r_normal_4=[
            "uniform vec2 n_alpha_repeat,n_red_repeat,n_green_repeat,n_blue_repeat;",
            "uniform sampler2D n_alpha_tex,n_red_tex,n_green_tex,n_blue_tex;",

            "uniform vec2 normalScale;",
            "vec3 perturbNormal2Arb(vec3 eye_pos,vec3 surf_norm){",
            "vec3 q0=vec3(dFdx(eye_pos.x),dFdx(eye_pos.y),dFdx(eye_pos.z));",
            "vec3 q1=vec3(dFdy(eye_pos.x),dFdy(eye_pos.y),dFdy(eye_pos.z));",
            "vec2 st0=dFdx(vUv.st);",
            "vec2 st1=dFdy(vUv.st);",
            "vec3 S=normalize(q0*st1.t-q1*st0.t);",
            "vec3 T=normalize(-q0*st1.s+q1*st0.s);",
            "vec3 N=normalize(surf_norm);",

            "vec4 mask_map=texture2D(mask_tex,vUv);",
            "vec4 vn_alpha_tex=texture2D(n_alpha_tex,vUv*n_alpha_repeat);",
            "vec4 vn_red_tex=texture2D(n_red_tex,(vUv*n_red_repeat+red_offset));",
            "vec4 vn_green_tex=texture2D(n_green_tex,vUv*n_green_repeat);",
            "vec4 vn_blue_tex=texture2D(n_blue_tex,vUv*n_blue_repeat);",
            "vec4 full_normal=(vn_red_tex*mask_map.r*mask_map.a+vn_green_tex*mask_map.g*mask_map.a+vn_blue_tex*mask_map.b*mask_map.a+(vn_alpha_tex*(1.0-mask_map.a)));",

            "vec3 mapN=full_normal.xyz*2.0-1.0;",
            "mapN.xy=normalScale*mapN.xy;",
            "mat3 tsn=mat3(S,T,N);",
            "return normalize(tsn*mapN);",
            "}",
        ].join("\n");


        var splat_r_normal_4_2=[
            "normal = perturbNormal2Arb( -vViewPosition, normal);",
        ].join("\n");


        splat_name.fs = splat_r_tex + "\n" + splat_name.fs;

        splat_name.fs = splat_name.fs.replace("#include <map_fragment>", splat_r_diffuse);

        splat_name.fs = splat_name.fs.replace("vec4 diffuseColor = vec4( diffuse, opacity );", "");

        if (splat_name.mat != "basic" && splat_name.mat != "lambert") {
            if (splat_name.bump == 1) {
                splat_name.fs = splat_name.fs.replace("#include <bumpmap_pars_fragment>", splat_r_bump_1);
            }
            if (splat_name.bump == 4) {
                splat_name.fs = splat_name.fs.replace("#include <bumpmap_pars_fragment>", splat_r_bump_4);
            }
        }

        if(splat_name.mat!="basic" && splat_name.mat!="lambert"){
            if(splat_name.normal==1){ splat_name.fs=splat_name.fs.replace("#include <normalmap_pars_fragment>",splat_r_normal_1); }
            if(splat_name.normal==1){ splat_name.fs=splat_name.fs.replace("#include <normal_fragment_maps>",splat_r_normal_4_2); }
            if(splat_name.normal==4){ splat_name.fs=splat_name.fs.replace("#include <normalmap_pars_fragment>",splat_r_normal_4); }
            if(splat_name.normal==4){ splat_name.fs=splat_name.fs.replace("#include <normal_fragment_maps>",splat_r_normal_4_2); }
        }


        let splat_mat = {
            uniforms: splat_name.u,
            vertexShader: splat_name.vs,
            fragmentShader: splat_name.fs,
            lights: true,
            fog: splat_name.fog,
            defines: {USE_MAP: true, USE_UV:true}
        };


        if (splat_name.mat == "basic") {
            splat_mat.lights = false;
        }


        if (splat_name.mat != "basic" && splat_name.mat != "lambert" && (splat_name.bump > 0 || splat_name.normal > 0)) {
            splat_mat.extensions = {derivatives: true};
        }


        if (splat_name.mat != "basic" && splat_name.mat != "lambert" && splat_name.bump > 0) {
            splat_mat.defines.USE_BUMPMAP = true;
        }

        if (splat_name.mat != "basic" && splat_name.mat != "lambert" && splat_name.normal > 0) {
            splat_mat.defines.USE_NORMALMAP = true;
        }





        splat_name.u = UniformsUtils.merge([
                splat_name.lib,
                {

                    mask_tex: {type: "t", value: null}, // RGBA МАСКА
                    alpha_tex: {type: "t", value: null}, // ДЛЯ ПРОЗРАЧНЫХ МЕСТ
                    red_tex: {type: "t", value: null}, // ДЛЯ КРАСНОГО ЦВЕТА
                    green_tex: {type: "t", value: null}, // ДЛЯ ЗЕЛЕНОГО ЦВЕТА
                    blue_tex: {type: "t", value: null}, // ДЛЯ СИНЕГО ЦВЕТА
                    b_alpha_tex: {type: "t", value: null}, // РЕЛЬЕФ ДЛЯ ПРОЗРАЧНЫХ МЕСТ
                    b_red_tex: {type: "t", value: null}, // РЕЛЬЕФ ДЛЯ КРАСНОГО ЦВЕТА
                    b_green_tex: {type: "t", value: null}, // РЕЛЬЕФ ДЛЯ ЗЕЛЕНОГО ЦВЕТА
                    b_blue_tex: {type: "t", value: null}, // РЕЛЬЕФ ДЛЯ СИНЕГО ЦВЕТА
                    n_alpha_tex: {type: "t", value: null}, // НОРМАЛЬ ДЛЯ ПРОЗРАЧНЫХ МЕСТ
                    n_red_tex: {type: "t", value: null}, // НОРМАЛЬ ДЛЯ КРАСНОГО ЦВЕТА
                    n_green_tex: {type: "t", value: null}, // НОРМАЛЬ ДЛЯ ЗЕЛЕНОГО ЦВЕТА
                    n_blue_tex: {type: "t", value: null}, // НОРМАЛЬ ДЛЯ СИНЕГО ЦВЕТА

                    alpha_repeat: {type: "v2", value: {x: 32, y: 32}},
                    red_repeat: {type: "v2", value: {x: 32, y: 32}},
                    green_repeat: {type: "v2", value: {x: 32, y: 32}},
                    blue_repeat: {type: "v2", value: {x: 32, y: 32}},
                    b_one_repeat: {type: "v2", value: {x: 1, y: 1}}, // ДЛЯ ОДНОГО РЕЛЬЕФА bumpMap
                    b_alpha_repeat: {type: "v2", value: {x: 32, y: 32}},
                    b_red_repeat: {type: "v2", value: {x: 32, y: 32}},
                    b_green_repeat: {type: "v2", value: {x: 32, y: 32}},
                    b_blue_repeat: {type: "v2", value: {x: 32, y: 32}},
                    n_one_repeat: {type: "v2", value: {x: 1, y: 1}}, // ДЛЯ ОДНОЙ НОРМАЛИ normalMap
                    n_alpha_repeat: {type: "v2", value: {x: 32, y: 32}},
                    n_red_repeat: {type: "v2", value: {x: 32, y: 32}},
                    n_green_repeat: {type: "v2", value: {x: 32, y: 32}},
                    n_blue_repeat: {type: "v2", value: {x: 32, y: 32}},

                    red_offset: {type: "vec2", value: {x: 0, y: 0}}
                }
            ]
        );


        if (splat_name.u.shininess != undefined) {
            splat_name.u.shininess.value = 80;
        }

        if (splat_name.u.roughness != undefined) {
            splat_name.u.roughness.value = 0.1;
        }

        if (splat_name.u.metalness != undefined) {
            splat_name.u.metalness.value = 0.2;
        }

        if (splat_name.mat != "basic" && splat_name.mat != "lambert") {
            if (splat_name.bump == 1) {
                splat_name.u.bumpMap.value = this.params.r_map;
            }
            if (splat_name.bump > 0) {
                splat_name.u.bumpScale.value = 1;
            }
        }


        if (splat_name.mat != "basic" && splat_name.mat != "lambert") {

            if (splat_name.normal == 1) {
                splat_name.u.normalMap.value = this.params.mask_normal_map;
            }

            if (splat_name.normal > 0) {
                splat_name.u.normalScale.value = {x: 1, y: 1};
            }
        }


        splat_name.u.mask_tex.value = this.params.mask_map;

        splat_name.u.red_tex.value =  this.params.r_map;
        splat_name.u.green_tex.value = this.params.g_map;
        splat_name.u.blue_tex.value = this.params.b_map;
        splat_name.u.alpha_tex.value = this.params.a_map;

        splat_name.u.b_red_tex.value = this.params.r_bamp_map;
        splat_name.u.b_green_tex.value = this.params.g_bamp_map;
        splat_name.u.b_blue_tex.value = this.params.b_bamp_map;
        splat_name.u.b_alpha_tex.value = this.params.a_bamp_map;

        splat_name.u.n_green_tex.value = this.params.g_normal_map;
        splat_name.u.n_blue_tex.value = this.params.b_normal_map;
        splat_name.u.n_alpha_tex.value = this.params.a_normal_map;
        splat_name.u.n_red_tex.value = this.params.r_normal_map;


        splat_mat.uniforms = splat_name.u;


        return new ShaderMaterial(splat_mat);


    }
}