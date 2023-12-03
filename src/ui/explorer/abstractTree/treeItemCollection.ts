import { Project } from "../../../project";
import { ProjectTreeItem } from "../projectsExplorer/projectTreeItem";
import { AbstractTreeItem } from "./abstractTreeItem";

export class TreeItemCollection {

	private children: AbstractTreeItem[] | undefined = undefined;

	public get length(): number {
		return this.children ? this.children.length : 0;
	}

	public get hasChildren(): boolean {
		return this.children !== undefined;
	}

	public get items(): AbstractTreeItem[] {
		return this.children || [];
	}

	public getItem(index: number): AbstractTreeItem {
		if (!this.children || !this.children[index]) { throw new Error("Invalid index in SolutionItemCollection"); }
		return this.children[index];
	}

	public reset(): void {
		this.children = undefined;
	}

    public async addProject(proj: Project){

		const item = new ProjectTreeItem(proj);

		if (!this.children) {
			this.children = [];
		}

		this.children.push(item);

    }

	public async addSolution(solutionPath: string, rootPath: string, solutionProvider: SolutionExplorerProvider): Promise<void> {
		const solution = await SolutionFile.parse(solutionPath);
		const item = await TreeItemFactory.createFromSolution(solutionProvider, solution, rootPath);
		if (!this.children) {
			this.children = [];
		}

		this.children.push(item);
	}

	public getLoadedChildTreeItemById(id: string): AbstractTreeItem | undefined {
		if (!this.children) { return undefined; }
		return TreeItemCollection.getInternalLoadedChildTreeItemById(id, this.children);
	}

	private static getInternalLoadedChildTreeItemById(id: string, children: AbstractTreeItem[]): AbstractTreeItem | undefined  {
        for (const child of children) {
            if (!child) {
                continue;
            }

            if (child.id === id) {
                return child;
            }

            const found = TreeItemCollection.getInternalLoadedChildTreeItemById(id, (child as any).children || []);
            if (found) {
                return found;
            }
        }

        return undefined;
    }

}
