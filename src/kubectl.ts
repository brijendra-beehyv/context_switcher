import { execAsync } from "./utils.js";

export async function getCurrentContext() {
    const { stdout } = await execAsync("kubectl config current-context");
    return stdout.trim();
}

export async function getAllContexts() {
    const { stdout } = await execAsync("kubectl config get-contexts -o name");
    return stdout.split('\n').filter(Boolean);
}

export async function useContext(context: string) {
    const { stdout } = await execAsync(`kubectl config use-context ${context}`);
    return stdout.trim();
}
