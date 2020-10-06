import { ProjectSettings } from "./ProjectSettings.js";

export class D {
    public static warn(msg: string, src?: string) {
        const o = { type: 'warning', src, msg };
        if (ProjectSettings.IsDevelopmentBuild) {
            if (ProjectSettings.IsCordovaApp) alert(o);
            else console.warn(o);
        }
    }
    public static err(msg: string, src?: string) {
        const o = { type: 'error', src, msg };
        if (ProjectSettings.IsDevelopmentBuild) {
            if (ProjectSettings.IsCordovaApp) alert(o);
            else console.error(o);
        }
    }
}