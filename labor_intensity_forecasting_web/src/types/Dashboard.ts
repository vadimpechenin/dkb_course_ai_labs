export interface Dashboard {


    operationsCount: number;

    featuresCount: number;

    activeModel: string;

    framework: string;

    weightsPath: string;

    datasetSize: number;

    trainPercent: number;

    testPercent: number;

    lastImport: string;

    lastTraining: string;

    mae: number;

    rmse: number;

    r2: number;

    trainingTime: number;

    history: {
        date: string;
        rmse: number;
    }[];

}