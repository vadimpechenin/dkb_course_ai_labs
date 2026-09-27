# Лабораторная работа по анализу данных с обрабатывающих центров, серверная часть

## Стек технологий
python v 3.11


## Общая схема работы сервера
```text
                    Dataset
                       │
                       │ dataset_id
                       ↓
                FeatureVectors
                       │
                       │
              group = tool_id
                       │
                       ↓
                Train / Test
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
 LogisticRegression RandomForest     SVM
        ↓              ↓              ↓
 TrainingRun #1     TrainingRun #2 TrainingRun #3
        │              │              │
        ↓              ↓              ↓
 ModelFile #1        ModelFile #2    ModelFile #3
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                 метрики сравнения
```

