import { ExportConfig } from "./exportconfig";

export class ExportInfo {
    api!: string;
    url!: string;
    ftp!: string;
    userName!: string;
    password!: string;
    ftpTime!: Date | null;
    email!: string;
    emailTime!: Date | null;
    configs!: ExportConfig[];

    constructor() {
        this.configs = [];
    }
}