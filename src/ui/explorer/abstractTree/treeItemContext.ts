export class TreeItemContext {
    constructor(public readonly provider: SolutionExplorerProvider, public readonly solution: SolutionFile, public readonly workspaceRoot: string, public readonly project?: Project, public readonly parent?: TreeItem) {
    }

    public get eventAggregator(): IEventAggregator {
        return this.provider.eventAggregator;
    }

    public copy(project?: Project, parent?: TreeItem): TreeItemContext {
        return new TreeItemContext(this.provider, this.solution, this.workspaceRoot, project ? project : this.project, parent ? parent : this.parent);
    }
}