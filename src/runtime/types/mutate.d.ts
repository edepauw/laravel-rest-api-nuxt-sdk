interface IBaseRelationOperation {
    attributes?: any;
    pivot?: any;
    relations?: {
        [key: string]: IMutateRelationRequest[] | IMutateRelationRequest;
    };
}

interface IKeyedRelationOperation extends IBaseRelationOperation {
    key: number | string;
}

interface ICreateRelationOperation extends IBaseRelationOperation {
    operation: 'create';
}

interface IUpdateRelationOperation extends IKeyedRelationOperation {
    operation: 'update';
}

interface IAttachRelationOperation extends IKeyedRelationOperation {
    operation: 'attach';
}

interface IDetachRelationOperation extends IKeyedRelationOperation {
    operation: 'detach';
}

interface ISyncRelationOperation extends IKeyedRelationOperation {
    operation: 'sync';
    without_detaching?: boolean;
}

interface IToggleRelationOperation extends IKeyedRelationOperation {
    operation: 'toggle';
}

type IMutateRelationRequest =
    | ICreateRelationOperation
    | IUpdateRelationOperation
    | IAttachRelationOperation
    | IDetachRelationOperation
    | ISyncRelationOperation
    | IToggleRelationOperation;


type IMutateRequest<T> =
    | {
    operation: 'create';
    attributes?: Partial<T>;
    relations?: Record<string, IMutateRelationRequest[] | IMutateRelationRequest>;
}
    | {
    operation: 'update';
    key: number | string;
    attributes?: Partial<T>;
    without_detaching?: boolean;
    relations?: Record<string, IMutateRelationRequest[] | IMutateRelationRequest>;
};

interface IMutateResponse {
    created: number[];
    updated: number[];
}

export type {IMutateRelationRequest, IMutateRequest, IMutateResponse};
