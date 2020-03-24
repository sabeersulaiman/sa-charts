export interface Chart<TData, TConfig> {
    render: (data: TData, container: HTMLElement, config: TConfig) => void;
}
