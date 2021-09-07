interface templateProject
{
    /** create template name */
    Name:(name:string)=>template,
}

interface template
{
    /** 加入 template 物件 project=eval("this['projectName'].main")、eval()*/
    Add:(obj:templateObj)=>void
}

/**
 * vue this 內import 注入功能 備註:model js 只能取 project 本身
*/
export interface ThisImport
{
    /** include project template  
     * @param path template file=[project name]@[path]   ex "@temp/MGPDS/gift"、  js file= [path] ex "@t/model/jsmodel"
    */
    import:(path:string)=>void,
}

/** template format(psyl vue) */
export interface templateObj
{
    /** template 繼承 參數
     * @param json json 參數 與 vue template data bind)
     */
    exportVue:(json:any)=>any,

    /** 注入物件 */
    Vue:any
}

/**
 * template 載入
*/
export interface vueComponent
{
    /** tamp this */
    ($t:any):templateProject
}