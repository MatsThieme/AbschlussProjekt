export class ProjectSettings {
    public static allowContextMenu: boolean = false;
    public static IsDevelopmentBuild: boolean = true;
    public static get IsCordovaApp(): boolean {
        return !!window.cordova;
    }
}