export class StringHelper {
    public static namespaceToPath(namespace: string): string {
        return StringHelper.replaceAll(namespace, '\\', '/') + '.ts';
    }

    public static replaceAll(str:string, find:string, replace:string) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
}